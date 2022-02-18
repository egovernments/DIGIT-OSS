package org.egov.nationaldashboardingest.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.producer.Producer;
import org.egov.nationaldashboardingest.utils.IngestConstants;
import org.egov.nationaldashboardingest.web.models.ProducerPOJO;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class ElasticSearchRepository {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private Producer producer;

    public void indexFlattenedDataToES(Map<String, List<String>> indexNameVsDocumentsToBeIndexed) {
        StringBuilder bulkRequestBody = new StringBuilder();

        // Conversion of multi-index request to a single request to avoid repetitive REST calls to ES.
        indexNameVsDocumentsToBeIndexed.keySet().forEach(indexName -> {
            String actionMetaData = String.format("{ \"index\" : { \"_index\" : \"%s\", \"_type\" : \"_doc\" } }%n", indexName);
            for (String document : indexNameVsDocumentsToBeIndexed.get(indexName)) {
                bulkRequestBody.append(actionMetaData);
                bulkRequestBody.append(document);
                bulkRequestBody.append("\n");
            }
        });

        // Persisting flattened data to ES.
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> httpEntity = new HttpEntity<>(bulkRequestBody.toString(), headers);
            StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost() + IngestConstants.BULK_ENDPOINT);
            Object response = restTemplate.postForEntity(uri.toString(), httpEntity, Map.class);
            String res = objectMapper.writeValueAsString(response);
            JsonNode responseNode = objectMapper.readValue(res, JsonNode.class);
            log.info("RESPONSE FROM ES: " + responseNode.toString());
            Boolean errorWhileIndexingData = responseNode.get(IngestConstants.BODY).get(IngestConstants.ERRORS).asBoolean();
            if(errorWhileIndexingData)
                throw new CustomException("EG_ES_IDX_ERR", "Error occurred while indexing data onto ES. Please ensure input data fields are in accordance with index mapping.");
        }catch (ResourceAccessException e){
            log.error("ES is down");
            throw new CustomException("EG_ES_ERR", "Elastic search is down");
        }catch (Exception e){
            log.error("Exception while indexing data onto ES.");
            throw new CustomException("EG_ES_IDX_ERR", e.getMessage());
        }
    }

    public Integer findIfRecordAlreadyExists(StringBuilder uri) {
        Integer recordsFound = 0;
        try {
            Object response = restTemplate.getForEntity(uri.toString(), Map.class);
            String res = objectMapper.writeValueAsString(response);
            JsonNode responseNode = objectMapper.readValue(res, JsonNode.class);
            log.info(responseNode.get(IngestConstants.BODY).toString());
            recordsFound = responseNode.get(IngestConstants.BODY).get(IngestConstants.HITS).get(IngestConstants.TOTAL).asInt();
        }catch (ResourceAccessException e){
            log.error("ES is down");
            throw new CustomException("EG_ES_ERR", "Elastic search is down");
        }catch (Exception e){
            log.error("Exception while fetching data from ES.");
            throw new CustomException("EG_ES_IDX_ERR", e.getMessage());
        }
        return recordsFound;
    }

    public void pushDataToKafkaConnector(Map<String, List<JsonNode>> indexNameVsDocumentsToBeIndexed) {
        /*indexNameVsDocumentsToBeIndexed.keySet().forEach(indexName -> {
            for(JsonNode record : indexNameVsDocumentsToBeIndexed.get(indexName)) {
                producer.push(indexName, record);
            }
        });*/
        indexNameVsDocumentsToBeIndexed.keySet().forEach(indexName -> {
            producer.push("persist-national-records", ProducerPOJO.builder().requestInfo(new RequestInfo()).records(indexNameVsDocumentsToBeIndexed.get(indexName)).build());
        });
    }
}
