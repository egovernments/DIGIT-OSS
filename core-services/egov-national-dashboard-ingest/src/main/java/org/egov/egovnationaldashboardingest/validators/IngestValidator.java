package org.egov.egovnationaldashboardingest.validators;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.egovnationaldashboardingest.config.ApplicationProperties;
import org.egov.egovnationaldashboardingest.repository.ElasticSearchRepository;
import org.egov.egovnationaldashboardingest.utils.JsonProcessorUtil;
import org.egov.egovnationaldashboardingest.web.models.Data;
import org.egov.egovnationaldashboardingest.web.models.IngestRequest;
import org.egov.egovnationaldashboardingest.web.models.MasterData;
import org.egov.egovnationaldashboardingest.web.models.MasterDataRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.egov.egovnationaldashboardingest.utils.IngestConstants.METRICS;

@Slf4j
@Component
public class IngestValidator {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JsonProcessorUtil jsonProcessorUtil;

    @Autowired
    private ElasticSearchRepository repository;

    public void verifyCrossStateRequest(IngestRequest ingestRequest){
        String employeeUlb = ingestRequest.getRequestInfo().getUserInfo().getTenantId();
        String ulbPresentInRequest = ingestRequest.getIngestData().getUlb();
        if(ulbPresentInRequest.contains(".")){
            if(!employeeUlb.equals(ulbPresentInRequest))
                throw new CustomException("EG_INGEST_ERR", "Employee of ulb: " + employeeUlb + " cannot insert data for ulb: " + ulbPresentInRequest);
        }else{
            if(!employeeUlb.contains(ulbPresentInRequest.toLowerCase()))
                throw new CustomException("EG_INGEST_ERR", "Employee of ulb: " + employeeUlb + " cannot insert data for ulb: " + ulbPresentInRequest);
        }
    }

    public void verifyCrossStateMasterDataRequest(MasterDataRequest masterDataRequest) {
        String employeeUlb = masterDataRequest.getRequestInfo().getUserInfo().getTenantId();
        String ulbPresentInRequest = masterDataRequest.getMasterData().getUlb();
        if(ulbPresentInRequest.contains(".")){
            if(!employeeUlb.equals(ulbPresentInRequest))
                throw new CustomException("EG_MASTER_DATA_INGEST_ERR", "Employee of ulb: " + employeeUlb + " cannot insert data for ulb: " + ulbPresentInRequest);
        }else{
            if(!employeeUlb.contains(ulbPresentInRequest.toLowerCase()))
                throw new CustomException("EG_MASTER_DATA_INGEST_ERR", "Employee of ulb: " + employeeUlb + " cannot insert data for ulb: " + ulbPresentInRequest);
        }
    }

    public void verifyDataStructure(Data ingestData){
        Set<String> configuredFieldsForModule = new HashSet<>();

        if(applicationProperties.getModuleFieldsMapping().containsKey(ingestData.getModule()))
            configuredFieldsForModule = applicationProperties.getModuleFieldsMapping().get(ingestData.getModule());
        else
            throw new CustomException("EG_DS_VALIDATE_ERR", "Field mapping has not been configured for module code: " + ingestData.getModule());
        try {
            String seedData = objectMapper.writeValueAsString(ingestData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);

            for(String inputKeyName : keyNames){
                if(!configuredFieldsForModule.contains(inputKeyName))
                    throw new CustomException("EG_DS_VALIDATE_ERR", "The metric: " + inputKeyName + " was not configured in field mapping for module: " + ingestData.getModule());
            }

            if(keyNames.size() < configuredFieldsForModule.size()){
                List<String> absentFields = new ArrayList<>();
                configuredFieldsForModule.forEach(field -> {
                    if(!keyNames.contains(field))
                        absentFields.add(field);
                });
                throw new CustomException("EG_DS_VALIDATE_ERR", "Received less number of fields than the number of fields configured in field mapping for module: " + ingestData.getModule() + ". List of absent fields: " + absentFields.toString());
            }
        }catch (JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }

    }

    public void verifyMasterDataStructure(MasterData masterData) {
        Set<String> configuredFieldsForModule = new HashSet<>();

        if(applicationProperties.getModuleFieldsMapping().containsKey(masterData.getModule()))
            configuredFieldsForModule = applicationProperties.getMasterModuleFieldsMapping().get(masterData.getModule());
        else
            throw new CustomException("EG_DS_VALIDATE_ERR", "Master field mapping has not been configured for module code: " + masterData.getModule());
        try {
            String seedData = objectMapper.writeValueAsString(masterData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);

            for(String inputKeyName : keyNames){
                if(!configuredFieldsForModule.contains(inputKeyName))
                    throw new CustomException("EG_DS_VALIDATE_ERR", "The metric: " + inputKeyName + " was not configured in master field mapping for module: " + masterData.getModule());
            }

            if(keyNames.size() < configuredFieldsForModule.size()){
                List<String> absentFields = new ArrayList<>();
                configuredFieldsForModule.forEach(field -> {
                    if(!keyNames.contains(field))
                        absentFields.add(field);
                });
                throw new CustomException("EG_DS_VALIDATE_ERR", "Received less number of fields than the number of fields configured in master field mapping for module: " + masterData.getModule() + ". List of absent fields: " + absentFields.toString());
            }
        }catch (JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }
    }

    // The verification logic will always use module name + date to determine the uniqueness of a set of records.
    public void verifyIfDataAlreadyIngested(Data ingestData) {
        StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost());
        uri.append(applicationProperties.getModuleIndexMapping().get(ingestData.getModule()));
        uri.append("/_doc").append("/_search");
        uri.append("?q=date").append(":").append(ingestData.getDate()).append(" AND ").append("module").append(":").append(ingestData.getModule());
        log.info(uri.toString());
        repository.findIfRecordAlreadyExists(uri);
    }
    // The verification logic will always use module name + financialYear to determine the uniqueness of a set of records.
    public void verifyIfMasterDataAlreadyIngested(MasterData masterData) {
        StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost());
        uri.append(applicationProperties.getMasterDataIndex());
        uri.append("/_doc").append("/_search");
        uri.append("?q=financialYear").append(":").append(masterData.getFinancialYear()).append(" AND ").append("module").append(":").append(masterData.getModule());
        log.info(uri.toString());
        repository.findIfRecordAlreadyExists(uri);
    }
}
