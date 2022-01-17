package org.egov.egovnationaldashboardingest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.ObjectNode;
import javafx.util.Pair;
import lombok.extern.slf4j.Slf4j;
import org.egov.egovnationaldashboardingest.config.ApplicationProperties;
import org.egov.egovnationaldashboardingest.repository.ElasticSearchRepository;
import org.egov.egovnationaldashboardingest.repository.ServiceRequestRepository;
import org.egov.egovnationaldashboardingest.utils.IngestUtil;
import org.egov.egovnationaldashboardingest.utils.JsonProcessorUtil;
import org.egov.egovnationaldashboardingest.web.models.Data;
import org.egov.egovnationaldashboardingest.web.models.MasterData;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.egovnationaldashboardingest.utils.IngestConstants.*;

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

    @Override
    public List<String> createFlattenedIndexRequest(Data ingestData) {
        Long startTime = System.currentTimeMillis();
        List<String> finalDocumentsToBeIndexed = new ArrayList<>();
        try {
            String seedData = objectMapper.writeValueAsString(ingestData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(METRICS);
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
                    finalDocumentsToBeIndexed.add(new String(currentStructure.toString()));

                    // Separate it out to a clean method - cleanBaseStructureForNextGroupByCategory
                    flattenedValuesToBeInserted.get(groupByCategory).get(bucketName).keySet().forEach(flattenedFieldName ->{
                        currentStructure.remove(flattenedFieldName);
                    });
                    currentStructure.remove(groupByCategory);
                });
            });
            // If metrics data does not have any group by clauses, flattening is not required and base document can be indexed directly.
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

    @Override
    public List<String> createFlattenedMasterDataRequest(MasterData masterData) {
        Long startTime = System.currentTimeMillis();
        List<String> finalDocumentsToBeIndexed = new ArrayList<>();
        try {
            String seedData = objectMapper.writeValueAsString(masterData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(METRICS);
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
