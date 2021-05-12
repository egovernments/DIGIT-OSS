package org.egov.infra.indexer.service;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.infra.indexer.util.IndexerConstants;
import org.egov.infra.indexer.util.IndexerUtils;
import org.egov.infra.indexer.web.contract.CustomJsonMapping;
import org.egov.infra.indexer.web.contract.FieldMapping;
import org.egov.infra.indexer.web.contract.Index;
import org.egov.infra.indexer.web.contract.UriMapping;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DataTransformationService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private IndexerUtils indexerUtils;

    @Value("${egov.core.reindex.topic.name}")
    private String reindexTopic;

    @Value("${egov.core.legacyindex.topic.name}")
    private String legacyIndexTopic;

    @Value("${egov.indexer.persister.create.topic}")
    private String persisterCreate;

    @Value("${egov.indexer.persister.update.topic}")
    private String persisterUpdate;

    @Value("${reindex.pagination.size.default}")
    private Integer defaultPageSizeForReindex;

    @Value("${legacyindex.pagination.size.default}")
    private Integer defaultPageSizeForLegacyindex;

    @Value("${egov.service.host}")
    private String serviceHost;

    @Value("${egov.infra.indexer.host}")
    private String esHostUrl;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndpoint;

    private ObjectMapper mapper = new ObjectMapper();


    /**
     * Tranformation method that transforms the input data to match the es index as
     * per config
     *
     * @param index
     * @param kafkaJson
     * @param isBulk
     * @param isCustom
     * @return
     */
    public String buildJsonForIndex(Index index, String kafkaJson, boolean isBulk, boolean isCustom) {
        StringBuilder jsonTobeIndexed = new StringBuilder();
        String result = null;
        JSONArray kafkaJsonArray = null;
        try {
            kafkaJsonArray = indexerUtils.constructArrayForBulkIndex(kafkaJson, index, isBulk);
            for (int i = 0; i < kafkaJsonArray.length(); i++) {
                if (null != kafkaJsonArray.get(i)) {
                    String stringifiedObject = indexerUtils.buildString(kafkaJsonArray.get(i));
                    String id = indexerUtils.buildIndexId(index, stringifiedObject);
                    if (isCustom) {
                        String customIndexJson = buildCustomJsonForIndex(index.getCustomJsonMapping(), stringifiedObject);
                        indexerUtils.pushCollectionToDSSTopic(id, customIndexJson, index);
                        indexerUtils.pushToKafka(id, customIndexJson, index);
                        StringBuilder builder = appendIdToJson(index, jsonTobeIndexed, stringifiedObject, customIndexJson);
                        if (null != builder)
                            jsonTobeIndexed = builder;
                    } else {
                        indexerUtils.pushCollectionToDSSTopic(id, stringifiedObject, index);
                        indexerUtils.pushToKafka(id, stringifiedObject, index);
                        StringBuilder builder = appendIdToJson(index, jsonTobeIndexed, stringifiedObject, null);
                        if (null != builder)
                            jsonTobeIndexed = builder;
                    }
                } else {
                    log.info("null json in kafkajsonarray, index: " + i);
                    continue;
                }
            }
            result = jsonTobeIndexed.toString();
        } catch (Exception e) {
            log.error("Error while building jsonstring for indexing", e);
        }

        return result;
    }

    /**
     * Attaches Index Id to the json to be indexed on es.
     *
     * @param index
     * @param jsonTobeIndexed
     * @param stringifiedObject
     * @param customIndexJson
     * @return
     */
    public StringBuilder appendIdToJson(Index index, StringBuilder jsonTobeIndexed, String stringifiedObject, String customIndexJson) {
        String id = indexerUtils.buildIndexId(index, stringifiedObject);
        if (StringUtils.isEmpty(id)) {
            return null;
        } else {
            final String actionMetaData = String.format(IndexerConstants.ES_INDEX_HEADER_FORMAT, "" + id);
            if (null != customIndexJson) {
                jsonTobeIndexed.append(actionMetaData).append(customIndexJson).append("\n");
            }else {
                jsonTobeIndexed.append(actionMetaData).append(stringifiedObject).append("\n");
            }
        }

        return jsonTobeIndexed;
    }
    /**
     * Helper method that builds the custom object for index. It performs following
     * actions: 1. Takes fields from the record received on the queue and maps it to
     * the object to be newly created. 2. Performs denormalization of data and
     * attaching new data by making external API calls as mentioned in the config.
     * 3. Performs denormalization of data by making MDMS called as mentioned in the
     * config.
     *
     * @param customJsonMappings
     * @param kafkaJson
     * @param urlForMap
     * @return
     */
    public String buildCustomJsonForIndex(CustomJsonMapping customJsonMappings, String kafkaJson) {
        Object indexMap = null;
        if (null != customJsonMappings.getIndexMapping()) {
            indexMap = customJsonMappings.getIndexMapping();
        } else {
            throw new CustomException("EGOV_INDEXER_MISSING_CUSTOM_MAPPING",
                    "Custom mapping for the given request is missing!");
        }
        DocumentContext documentContext = JsonPath.parse(indexMap);
        if (!CollectionUtils.isEmpty(customJsonMappings.getFieldMapping())) {
            for (FieldMapping fieldMapping : customJsonMappings.getFieldMapping()) {
                String[] expressionArray = (fieldMapping.getOutJsonPath()).split("[.]");
                String expression = indexerUtils.getProcessedJsonPath(fieldMapping.getOutJsonPath());
                try {
                    documentContext.put(expression, expressionArray[expressionArray.length - 1],
                            JsonPath.read(kafkaJson, fieldMapping.getInjsonpath()));
                } catch (Exception e) {
                    log.error("Error while building custom JSON for index: " + e.getMessage());
                    continue;
                }

            }
        }
        documentContext = enrichDataUsingExternalServices(documentContext, customJsonMappings, kafkaJson);
        documentContext = denormalizeDataFromMDMS(documentContext, customJsonMappings, kafkaJson);

        return documentContext.jsonString().toString(); // jsonString has to be converted to string
    }

    /**
     * Performs enrichment of data by attaching new data obtained from making
     * external API calls as mentioned in the config.
     *
     * @param documentContext
     * @param customJsonMappings
     * @param kafkaJson
     * @return
     */
    public DocumentContext enrichDataUsingExternalServices(DocumentContext documentContext, CustomJsonMapping customJsonMappings, String kafkaJson) {
        if (!CollectionUtils.isEmpty(customJsonMappings.getExternalUriMapping())) {
            for (UriMapping uriMapping : customJsonMappings.getExternalUriMapping()) {
                Object response = null;
                String uri = null;
                try {
                    uri = indexerUtils.buildUri(uriMapping, kafkaJson);
                    response = restTemplate.postForObject(uri, uriMapping.getRequest(), Map.class);
                    if (null == response)
                        continue;
                } catch (Exception e) {
                    log.error("Exception while making external call: ", e);
                    log.error("URI: " + uri);
                    continue;
                }
                log.debug("Response: " + response + " from the URI: " + uriMapping.getPath());
                for (FieldMapping fieldMapping : uriMapping.getUriResponseMapping()) {
                    String[] expressionArray = (fieldMapping.getOutJsonPath()).split("[.]");
                    String expression = indexerUtils.getProcessedJsonPath(fieldMapping.getOutJsonPath());
                    try {
                        String inputJsonPath = fieldMapping.getInjsonpath();
                        // if input path contains filter, fill
                        if (!StringUtils.isEmpty(fieldMapping.getFilter()) && !CollectionUtils.isEmpty(fieldMapping.getFilterMapping())) {
                            UriMapping uriMappingForInput = UriMapping.builder().filter(fieldMapping.getFilter()).filterMapping(fieldMapping.getFilterMapping()).build();
                            inputJsonPath += indexerUtils.buildFilter(uriMappingForInput, kafkaJson);
                        }
                        Object value = JsonPath.read(mapper.writeValueAsString(response), inputJsonPath);
                        documentContext.put(expression, expressionArray[expressionArray.length - 1], value);
                    } catch (Exception e) {
                        log.error("Value: " + fieldMapping.getInjsonpath() + " is not found!");
                        log.debug("URI: " + uri);
                        documentContext.put(expression, expressionArray[expressionArray.length - 1], null);
                        continue;
                    }
                }
            }
        }
        return documentContext;
    }

    /**
     * Performs denormalization of data by making MDMS calls as mentioned in the
     * config.
     *
     * @param documentContext
     * @param customJsonMappings
     * @param kafkaJson
     * @return
     */
    public DocumentContext denormalizeDataFromMDMS(DocumentContext documentContext, CustomJsonMapping customJsonMappings, String kafkaJson) {
        ObjectMapper mapper = new ObjectMapper();
        if (!CollectionUtils.isEmpty(customJsonMappings.getMdmsMapping())) {
            for (UriMapping uriMapping : customJsonMappings.getMdmsMapping()) {
                Object response = null;
                String uri = uriMapping.getPath();
                Object request = null;
                try {

                    if (uri.length() < 1)
                        uri = uri + mdmsHost + mdmsEndpoint;

                    String filter = indexerUtils.buildFilter(uriMapping, kafkaJson);
                    response = indexerUtils.fetchMdmsData(uri, uriMapping.getTenantId(), uriMapping.getModuleName(),
                            uriMapping.getMasterName(), filter);

                    if (null == response)
                        continue;
                } catch (Exception e) {
                    log.error("Exception while trying to hit: " + uri);
					log.info("MDMS Request failure: " + e);
                    continue;
                }
                log.debug("Response: " + response + " from the URI: " + uriMapping.getPath());
                for (FieldMapping fieldMapping : uriMapping.getUriResponseMapping()) {
                    String[] expressionArray = (fieldMapping.getOutJsonPath()).split("[.]");
                    String expression = indexerUtils.getProcessedJsonPath(fieldMapping.getOutJsonPath());
                    try {
                        Object value = JsonPath.read(mapper.writeValueAsString(response), fieldMapping.getInjsonpath());
                        if (value instanceof List) {
                            if (((List) value).size() == 1) {
                                value = ((List) value).get(0);
                            }
                        }
                        documentContext.put(expression, expressionArray[expressionArray.length - 1], value);
                    } catch (Exception e) {
                        log.error("Value: " + fieldMapping.getInjsonpath() + " is not found!");
                        log.debug("MDMS Request: " + request);
                        documentContext.put(expression, expressionArray[expressionArray.length - 1], null);
                        continue;
                    }
                }

            }
        }
        return documentContext;

    }
}
