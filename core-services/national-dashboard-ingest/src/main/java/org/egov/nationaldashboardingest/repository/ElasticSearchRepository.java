package org.egov.nationaldashboardingest.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.utils.IngestConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

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

    public void indexFlattenedDataToES(String index, List<String> finalDocumentsToBeIndexed) {
        try {
            String actionMetaData = String.format("{ \"index\" : { \"_index\" : \"%s\", \"_type\" : \"_doc\" } }%n", index);
            StringBuilder bulkRequestBody = new StringBuilder();
            for (String document : finalDocumentsToBeIndexed) {
                bulkRequestBody.append(actionMetaData);
                bulkRequestBody.append(document);
                bulkRequestBody.append("\n");
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Object> httpEntity = new HttpEntity<>(bulkRequestBody.toString(), headers);
            StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost() + IngestConstants.BULK_ENDPOINT);
            Object response = restTemplate.postForEntity(uri.toString(), httpEntity, Map.class);
            String res = objectMapper.writeValueAsString(response);
            JsonNode responseNode = objectMapper.readValue(res, JsonNode.class);
            log.info(responseNode.toString());
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

    public void findIfRecordAlreadyExists(StringBuilder uri) {
        try {
            Object response = restTemplate.getForEntity(uri.toString(), Map.class);
            String res = objectMapper.writeValueAsString(response);
            JsonNode responseNode = objectMapper.readValue(res, JsonNode.class);
            log.info(responseNode.get(IngestConstants.BODY).toString());
            Integer recordsFound = responseNode.get(IngestConstants.BODY).get(IngestConstants.HITS).get(IngestConstants.TOTAL).asInt();
            if (recordsFound > 0){
                throw new CustomException("EG_IDX_ERR", "Records for the given date and module have already been ingested, input data will not be ingested.");
            }
        }catch (ResourceAccessException e){
            log.error("ES is down");
            throw new CustomException("EG_ES_ERR", "Elastic search is down");
        }catch (Exception e){
            log.error("Exception while fetching data from ES.");
            throw new CustomException("EG_ES_IDX_ERR", e.getMessage());
        }
    }
}
