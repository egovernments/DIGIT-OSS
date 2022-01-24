package org.egov.nationaldashboardingest.validators;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.repository.ElasticSearchRepository;
import org.egov.nationaldashboardingest.utils.JsonProcessorUtil;
import org.egov.nationaldashboardingest.web.models.Data;
import org.egov.nationaldashboardingest.web.models.IngestRequest;
import org.egov.nationaldashboardingest.web.models.MasterData;
import org.egov.nationaldashboardingest.web.models.MasterDataRequest;
import org.egov.nationaldashboardingest.utils.IngestConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

        validateDateFormat(ingestData.getDate());
        validateStringNotNumeric(ingestData.getWard());
        validateStringNotNumeric(ingestData.getUlb());
        validateStringNotNumeric(ingestData.getRegion());
        validateStringNotNumeric(ingestData.getState());

        Set<String> configuredFieldsForModule = new HashSet<>();

        if(applicationProperties.getModuleFieldsMapping().containsKey(ingestData.getModule()))
            configuredFieldsForModule = applicationProperties.getModuleFieldsMapping().get(ingestData.getModule()).keySet();
        else
            throw new CustomException("EG_DS_VALIDATE_ERR", "Field mapping has not been configured for module code: " + ingestData.getModule());
        try {
            Map<String, JsonNodeType> keyVsTypeMap = new HashMap<>();
            String seedData = objectMapper.writeValueAsString(ingestData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(IngestConstants.METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);

            for(String inputKeyName : keyNames){
                keyVsTypeMap.put(inputKeyName, metricsData.get(inputKeyName).getNodeType());
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

            keyVsTypeMap.keySet().forEach(key ->{
                JsonNodeType type = keyVsTypeMap.get(key);
                if(applicationProperties.getModuleFieldsMapping().get(ingestData.getModule()).get(key).contains("::")){
                    String valueType = applicationProperties.getModuleFieldsMapping().get(ingestData.getModule()).get(key).split("::")[1];
                    if(!(metricsData.get(key) instanceof ArrayNode)){
                        throw new CustomException("EG_DS_VALIDATE_ERR", "Key: " + key + " is configured as type array but received value of type: " + type.toString());
                    }else{
                        for(JsonNode childNode : metricsData.get(key)){
                            for(JsonNode bucketNode : childNode.get("buckets")) {
                                if (!(bucketNode.get("value").getNodeType().toString().equalsIgnoreCase(valueType)))
                                    throw new CustomException("EG_DS_VALIDATE_ERR", "Children values of the array: " + key + " should only contain values of type: " + valueType);
                            }
                        }
                    }
                } else {
                    if (!type.toString().equalsIgnoreCase(applicationProperties.getModuleFieldsMapping().get(ingestData.getModule()).get(key)))
                        throw new CustomException("EG_DS_VALIDATE_ERR", "The type of data input does not match with the type of data provided in configuration for key: " + key);
                }
            });

        }catch (JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }

    }

    private void validateStringNotNumeric(String s) {
        Pattern p = Pattern.compile("[^a-z0-9.\\- ]", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(s);
        if (m.find())
            throw new CustomException("EG_DS_ERR", "Special characters are not allowed in input.");

        if (NumberUtils.isParsable(s)) {
            throw new CustomException("EG_DS_ERR", "Received numeric value: " + s + ". Please provide String value strictly.");
        }
    }

    private void validateDateFormat(String date) {
        if (!isValidSystemDefinedDateFormat(date))
            throw new CustomException("EG_DS_ERR", "Date should be strictly in dd-MM-yyyy format.");
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        formatter.setLenient(false);
        Date currDate = new Date();
        try {
            Date inpDate = formatter.parse(date);
            if(inpDate.after(currDate))
                throw new CustomException("EG_DS_ERR", "Future date values are now allowed.");
        } catch (ParseException e) {
            throw new CustomException("EG_DS_ERR", "Date should be strictly in dd-MM-yyyy format.");
        }
    }

    private boolean isValidSystemDefinedDateFormat(String date) {
        if(!date.contains("-"))
            return false;

        String []dateArr = date.split("-");
        if(dateArr.length != 3){
            return false;
        }
        if(dateArr[0].length() == 2 && dateArr[1].length() == 2 && dateArr[2].length() == 4)
            return true;
        return false;
    }

    public void verifyMasterDataStructure(MasterData masterData) {
        validateStringNotNumeric(masterData.getModule());
        validateStringNotNumeric(masterData.getRegion());
        validateStringNotNumeric(masterData.getState());
        validateStringNotNumeric(masterData.getUlb());
        validateFinancialYear(masterData.getFinancialYear());
        Set<String> configuredFieldsForModule = new HashSet<>();

        if(applicationProperties.getModuleFieldsMapping().containsKey(masterData.getModule()))
            configuredFieldsForModule = applicationProperties.getMasterModuleFieldsMapping().get(masterData.getModule()).keySet();
        else
            throw new CustomException("EG_DS_VALIDATE_ERR", "Master field mapping has not been configured for module code: " + masterData.getModule());
        try {
            Map<String, JsonNodeType> keyVsTypeMap = new HashMap<>();
            String seedData = objectMapper.writeValueAsString(masterData);
            JsonNode incomingData = objectMapper.readValue(seedData, JsonNode.class);
            List<String> keyNames = new ArrayList<>();
            JsonNode metricsData = incomingData.get(IngestConstants.METRICS);
            jsonProcessorUtil.enrichKeyNamesInList(metricsData, keyNames);

            for(String inputKeyName : keyNames){
                keyVsTypeMap.put(inputKeyName, metricsData.get(inputKeyName).getNodeType());
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

            keyVsTypeMap.keySet().forEach(key ->{
                JsonNodeType type = keyVsTypeMap.get(key);
                if(applicationProperties.getMasterModuleFieldsMapping().get(masterData.getModule()).get(key).contains("::")){
                    String valueType = applicationProperties.getMasterModuleFieldsMapping().get(masterData.getModule()).get(key).split("::")[1];
                    if(!(metricsData.get(key) instanceof ArrayNode)){
                        throw new CustomException("EG_DS_VALIDATE_ERR", "Key: " + key + " is configured as type array but received value of type: " + type.toString());
                    }else{
                        for(JsonNode childNode : metricsData.get(key)){
                            for(JsonNode bucketNode : childNode.get("buckets")) {
                                if (!(bucketNode.get("value").getNodeType().toString().equalsIgnoreCase(valueType)))
                                    throw new CustomException("EG_DS_VALIDATE_ERR", "Children values of the array: " + key + " should only contain values of type: " + valueType);
                            }
                        }
                    }
                } else {
                    if (!type.toString().equalsIgnoreCase(applicationProperties.getMasterModuleFieldsMapping().get(masterData.getModule()).get(key)))
                        throw new CustomException("EG_DS_VALIDATE_ERR", "The type of data input does not match with the type of data provided in configuration for key: " + key);
                }
            });


        }catch (JsonProcessingException e){
            throw new CustomException("EG_PAYLOAD_READ_ERR", "Error occured while processing ingest data");
        }
    }

    private void validateFinancialYear(String financialYear) {
        if(!financialYear.contains("-"))
            throw new CustomException("EG_MASTER_DATA_VALIDATE_ERR", "Financial year is not given in correct format. Correct format is YYYY-YY");

        String fromYear = financialYear.split("-")[0];
        String toYear = financialYear.split("-")[1];
        if((!NumberUtils.isParsable(fromYear) || !NumberUtils.isParsable(toYear))){
            throw new CustomException("EG_MASTER_DATA_VALIDATE_ERR", "Financial year is not given in proper format.");
        }
    }

    // The verification logic will always use module name + date to determine the uniqueness of a set of records.
    public void verifyIfDataAlreadyIngested(Data ingestData) {
        StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost() + "/");
        uri.append(applicationProperties.getModuleIndexMapping().get(ingestData.getModule()));
        uri.append("/_doc").append("/_search");
        uri.append("?q=date").append(":").append(ingestData.getDate()).append(" AND ").append("module").append(":").append(ingestData.getModule());
        log.info(uri.toString());
        repository.findIfRecordAlreadyExists(uri);
    }
    // The verification logic will always use module name + financialYear to determine the uniqueness of a set of records.
    public void verifyIfMasterDataAlreadyIngested(MasterData masterData) {
        StringBuilder uri = new StringBuilder(applicationProperties.getElasticSearchHost() + "/");
        uri.append(applicationProperties.getMasterDataIndex());
        uri.append("/_doc").append("/_search");
        uri.append("?q=financialYear").append(":").append(masterData.getFinancialYear()).append(" AND ").append("module").append(":").append(masterData.getModule());
        log.info(uri.toString());
        repository.findIfRecordAlreadyExists(uri);
    }
}
