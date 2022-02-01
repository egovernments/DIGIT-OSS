package org.egov.nationaldashboardingest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.producer.Producer;
import org.egov.nationaldashboardingest.repository.ServiceRequestRepository;
import org.egov.nationaldashboardingest.utils.IngestUtil;
import org.egov.nationaldashboardingest.utils.JsonProcessorUtil;
import org.egov.nationaldashboardingest.web.models.Data;
import org.egov.nationaldashboardingest.web.models.MasterData;
import org.egov.nationaldashboardingest.utils.IngestConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class CustomIndexRequestDecoratorImpl implements CustomIndexRequestDecorator {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JsonProcessorUtil jsonProcessorUtil;

    @Autowired
    private IngestUtil ingestUtil;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private Producer producer;

    @Override
    public List<JsonNode> createFlattenedIndexRequest(Data ingestData) {
        Long startTime = System.currentTimeMillis();
        List<JsonNode> finalDocumentsToBeIndexed = new ArrayList<>();
        try {
            String seedData = objectMapper.writeValueAsString(ingestData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(IngestConstants.METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);
            log.info(keyNames.toString());
            ObjectNode baseDocumentStructure = objectMapper.createObjectNode();

            // Method for enriching information in base document structure
            ingestUtil.enrichMetaDataInBaseDocumentStructureForDataIngest(baseDocumentStructure, ingestData);

            // Prepare base document structure
            keyNames.forEach(name -> {
                if(!(metricsData.get(name) instanceof ArrayNode)){
                    Object convertedValue = jsonProcessorUtil.convertJsonNodeToNativeType(metricsData.get(name));
                    jsonProcessorUtil.addAppropriateBoxedTypeValueToBaseDocument(baseDocumentStructure, name, convertedValue);
                }
            });
            log.info("Base structure - " + baseDocumentStructure.toString());

            // Creates a map of groupByMetric vs ( map of bucketName vs ( map of (flattenedFieldName vs bucketValue) ) )
            HashMap<String, HashMap<String, HashMap<String, Object>>> flattenedValuesToBeInserted = new HashMap<>();
            keyNames.forEach(name -> {
                if(metricsData.get(name) instanceof ArrayNode){
                    //log.info(name);
                    for(JsonNode currentNode : metricsData.get(name)) {
                        String groupByMetric = currentNode.get("groupBy").asText();
                        String groupByMetricInCamelCase = ingestUtil.convertFieldNameToCamelCase(groupByMetric);
                        if(!flattenedValuesToBeInserted.containsKey(groupByMetricInCamelCase)){
                            flattenedValuesToBeInserted.put(groupByMetricInCamelCase, new HashMap<>());
                        }
                        String flattenedFieldName = name + "For" + ingestUtil.capitalizeFieldName(groupByMetric);
                        //log.info(flattenedFieldName);
                        for(JsonNode bucketNode : currentNode.get("buckets")) {
                            if (!flattenedValuesToBeInserted.get(groupByMetricInCamelCase).containsKey(bucketNode.get("name").asText())){
                                flattenedValuesToBeInserted.get(groupByMetricInCamelCase).put(bucketNode.get("name").asText(), new HashMap<>());
                            }
                            flattenedValuesToBeInserted.get(groupByMetricInCamelCase).get(bucketNode.get("name").asText()).put(flattenedFieldName, jsonProcessorUtil.convertJsonNodeToNativeType(bucketNode.get("value")));
                        }
                    }
                }
            });
            //log.info(flattenedValuesToBeInserted.toString());

            // Prepare flattened JSON data and put it all onto finalDocumentsToBeIndexed list
            flattenedValuesToBeInserted.keySet().forEach(groupByCategory ->{
                ObjectNode currentStructure = baseDocumentStructure;
                flattenedValuesToBeInserted.get(groupByCategory).keySet().forEach(bucketName -> {
                    currentStructure.put(groupByCategory, bucketName);
                    flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).keySet().forEach(flattenedFieldName -> {
                        Object value = flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).get(flattenedFieldName);
                        jsonProcessorUtil.addAppropriateBoxedTypeValueToBaseDocument(currentStructure, flattenedFieldName, value);
                    });

                    //log.info(currentStructure.toString());

                    try {
                        finalDocumentsToBeIndexed.add(objectMapper.readTree(currentStructure.toString()));
                    } catch (JsonProcessingException e) {
                        throw new CustomException("EG_DS_FLATTEN_ERR", "Error while reading flattened data");
                    }

                    // Separate it out to a clean method - cleanBaseStructureForNextGroupByCategory
                    flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).keySet().forEach(flattenedFieldName ->{
                        currentStructure.remove(flattenedFieldName);
                    });
                    currentStructure.remove(groupByCategory);
                });
            });
            // If metrics data does not have any group by clauses, flattening is not required and base document can be indexed directly.
            if(CollectionUtils.isEmpty(finalDocumentsToBeIndexed)){
                finalDocumentsToBeIndexed.add(baseDocumentStructure);
            }
            log.info(finalDocumentsToBeIndexed.toString());
        }catch(JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }

        Long endTime = System.currentTimeMillis();
        log.info("Flattening incoming request took: " + (endTime - startTime) + " ms");
        return finalDocumentsToBeIndexed;
    }

    @Override
    public List<String> createFlattenedMasterDataRequest(MasterData masterData) {
        Long startTime = System.currentTimeMillis();
        List<String> finalDocumentsToBeIndexed = new ArrayList<>();
        try {
            String seedData = objectMapper.writeValueAsString(masterData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(IngestConstants.METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);
            log.info(keyNames.toString());
            ObjectNode baseDocumentStructure = objectMapper.createObjectNode();

            // Method for enriching information in base document structure
            ingestUtil.enrichMetaDataInBaseDocumentStructureForMasterDataIngest(baseDocumentStructure, masterData);

            // Prepare base document structure
            keyNames.forEach(name -> {
                if(!(metricsData.get(name) instanceof ArrayNode)){
                    Object convertedValue = jsonProcessorUtil.convertJsonNodeToNativeType(metricsData.get(name));
                    jsonProcessorUtil.addAppropriateBoxedTypeValueToBaseDocument(baseDocumentStructure, name, convertedValue);
                }
            });
            log.info("Base structure - " + baseDocumentStructure.toString());

            // Creates a map of groupByMetric vs ( map of bucketName vs ( map of (flattenedFieldName vs bucketValue) ) )
            HashMap<String, HashMap<String, HashMap<String, Object>>> flattenedValuesToBeInserted = new HashMap<>();
            keyNames.forEach(name -> {
                if(metricsData.get(name) instanceof ArrayNode){
                    //log.info(name);
                    for(JsonNode currentNode : metricsData.get(name)) {
                        String groupByMetric = currentNode.get("groupBy").asText();
                        String groupByMetricInCamelCase = ingestUtil.convertFieldNameToCamelCase(groupByMetric);
                        if(!flattenedValuesToBeInserted.containsKey(groupByMetricInCamelCase)){
                            flattenedValuesToBeInserted.put(groupByMetricInCamelCase, new HashMap<>());
                        }
                        String flattenedFieldName = name + "For" + ingestUtil.capitalizeFieldName(groupByMetric);
                        //log.info(flattenedFieldName);
                        for(JsonNode bucketNode : currentNode.get("buckets")) {
                            if (!flattenedValuesToBeInserted.get(groupByMetricInCamelCase).containsKey(bucketNode.get("name").asText())){
                                flattenedValuesToBeInserted.get(groupByMetricInCamelCase).put(bucketNode.get("name").asText(), new HashMap<>());
                            }
                            flattenedValuesToBeInserted.get(groupByMetricInCamelCase).get(bucketNode.get("name").asText()).put(flattenedFieldName, jsonProcessorUtil.convertJsonNodeToNativeType(bucketNode.get("value")));
                        }
                    }
                }
            });
            //log.info(flattenedValuesToBeInserted.toString());

            // Prepare flattened JSON data and put it all onto finalDocumentsToBeIndexed list
            flattenedValuesToBeInserted.keySet().forEach(groupByCategory ->{
                ObjectNode currentStructure = baseDocumentStructure;
                flattenedValuesToBeInserted.get(groupByCategory).keySet().forEach(bucketName -> {
                    currentStructure.put(groupByCategory, bucketName);
                    flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).keySet().forEach(flattenedFieldName -> {
                        Object value = flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).get(flattenedFieldName);
                        jsonProcessorUtil.addAppropriateBoxedTypeValueToBaseDocument(currentStructure, flattenedFieldName, value);
                    });
                    finalDocumentsToBeIndexed.add(new String(currentStructure.toString()));

                    // Separate it out to a clean method - cleanBaseStructureForNextGroupByCategory
                    flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).keySet().forEach(flattenedFieldName ->{
                        currentStructure.remove(flattenedFieldName);
                    });
                    currentStructure.remove(groupByCategory);
                });
            });
            if(CollectionUtils.isEmpty(finalDocumentsToBeIndexed)){
                finalDocumentsToBeIndexed.add(baseDocumentStructure.toString());
            }
            log.info(finalDocumentsToBeIndexed.toString());


        }catch(JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }

        Long endTime = System.currentTimeMillis();
        log.info("Flattening incoming request took: " + (endTime - startTime) + " ms");
        return finalDocumentsToBeIndexed;
    }

}
