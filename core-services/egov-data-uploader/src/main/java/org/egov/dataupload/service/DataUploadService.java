package org.egov.dataupload.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;

import org.egov.DataUploadApplicationRunnerImpl;
import org.egov.dataupload.model.Definition;
import org.egov.dataupload.model.Defs;
import org.egov.dataupload.model.Document;
import org.egov.dataupload.model.JobSearchRequest;
import org.egov.dataupload.model.ModuleDefs;
import org.egov.dataupload.model.Request;
import org.egov.dataupload.model.UploadDefinition;
import org.egov.dataupload.model.UploadJob;
import org.egov.dataupload.model.UploadJob.StatusEnum;
import org.egov.dataupload.model.UploaderRequest;
import org.egov.dataupload.producer.DataUploadProducer;
import org.egov.dataupload.property.models.AuditDetails;
import org.egov.dataupload.repository.DataUploadRepository;
import org.egov.dataupload.repository.UploadRegistryRepository;
import org.egov.dataupload.utils.DataUploadUtils;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;

import net.minidev.json.JSONArray;

@Service
public class DataUploadService {

    @Autowired
    private DataUploadRepository dataUploadRepository;

    @Autowired
    private UploadRegistryRepository uploadRegistryRepository;

    @Autowired
    private DataUploadApplicationRunnerImpl runner;

    @Autowired
    private DataUploadUtils dataUploadUtils;

    @Autowired
    private DataUploadProducer dataUploadProducer;

    @Autowired
    private FileIO excelIO;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${filestore.host}")
    private String fileStoreHost;

    @Value("${egov.uploadJob.save.topic}")
    private String uploadJobSaveTopic;

    @Value("${egov.uploadJob.update.topic}")
    private String uploadJobUpdateTopic;

    @Value("${filestore.get.endpoint}")
    private String getFileEndpoint;

    @Value("${response.file.name.prefix}")
    private String resFilePrefix;

    @Value("${template.download.prefix}")
    private String templateFilePrefix;
    
	@Value("${property.module.name}")
	private String propertyModuleName;

    @Value("${uploadjob.update.progress.size}")
    private int updateProgressSize;

    private static final Logger logger = LoggerFactory.getLogger(DataUploadService.class);

    public List<UploadJob> createUploadJob(UploaderRequest uploaderRequest) {
        UploadJob uploadJob = uploaderRequest.getUploadJobs().get(0);

        validateJob(uploadJob);

        StringBuilder uri = new StringBuilder();
        uri.append(fileStoreHost).append(getFileEndpoint).append("?fileStoreId=").append(uploadJob
                .getRequestFilePath()).append("&tenantId=").append(uploadJob.getTenantId());
        try {

            uploadJob.setCode(dataUploadUtils.mockIdGen(uploadJob.getModuleName(), uploadJob.getDefName()));
            String filePath = dataUploadRepository.getFileContents(uri.toString(), uploadJob.getCode()+"-"+uploaderRequest.getUploadJobs()
                    .get(0).getRequestFileName());

            uploadJob.setRequesterName(uploaderRequest.getRequestInfo().getUserInfo().getUserName());
            AuditDetails auditDetails = AuditDetails.builder().createdBy(uploaderRequest.getRequestInfo().getUserInfo().getId().toString())
                    .createdTime(new Date().getTime())
                    .lastModifiedBy(uploaderRequest.getRequestInfo().getUserInfo().getId().toString())
                    .lastModifiedTime(new Date().getTime()).build();
            uploadJob.setStatus(StatusEnum.NEW);

            updateJobsWithPersister(auditDetails,uploadJob,true);
//            uploadRegistryRepository.createJob(uploaderRequest);

            uploadJob.setLocalFilePath(filePath);
            dataUploadProducer.producer(uploaderRequest);

            return uploaderRequest.getUploadJobs();
        }/* catch (IOException ioe) {
            logger.error("Failed to create file", ioe);
            throw new CustomException("400", "Unable to create or write file");
        } */catch (RestClientException re) {
            logger.error("No .xls/.xlsx file found for: fileStoreId = " + uploadJob.getRequestFilePath()
                    + " AND tenantId = " + uploadJob.getTenantId());
            CustomException ex = new CustomException("400", "Unable to fetch file from filestore");
            ex.initCause(re);
            throw ex;
        } catch (DataAccessException de) {
            logger.error("Unable to persist job details onto DB", de);

            CustomException ex = new CustomException("400", "Unable to persist job details onto DB");
            ex.initCause(de);
            throw ex;
        } catch (Exception e) {
            logger.error("Error occurred while attempting to create job", e);
            CustomException ex = new CustomException("UNKNOWN_ERROR_OCCURRED", "UNKNOWN Error Occured");
            ex.initCause(e);
            throw ex;
        }
    }

    private void validateJob(UploadJob uploadJob) {
    	
    	
    	if(uploadJob.getModuleName().equalsIgnoreCase(propertyModuleName))
    		return;
    	
        if (Objects.isNull(uploadJob.getRequestFileName())) {
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "Please provide the requestFileName.");
        }

        Optional<Definition> definitionOptional = runner.getUploadDefinition(uploadJob.getModuleName(), uploadJob.getDefName());
        if (!definitionOptional.isPresent()) {
            logger.error("There's no Upload Definition provided for this upload feature");
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "There's no Upload Definition provided for this upload feature");
        }

        Definition uploadDefinition = definitionOptional.get();

        if (null != uploadDefinition.getIsParentChild() && uploadDefinition.getIsParentChild()) {
            if (null == uploadDefinition.getUniqueParentKeys() || uploadDefinition.getUniqueParentKeys().isEmpty()) {
                logger.error("Parent child relation is true, but there are no unique parent keys defined.");
                throw new CustomException("NO_UNIQUE_PARENT_KEYS",
                        "Parent child relation is true, but there are no unique parent keys defined.");
            }
        }

    }


    public void excelDataUpload(UploaderRequest uploaderRequest) {

        UploadJob uploadJob = uploaderRequest.getUploadJobs().get(0);
        Optional<Definition> definitionOptional = runner.getUploadDefinition(uploadJob.getModuleName(), uploadJob.getDefName());
        if (!definitionOptional.isPresent()) {
            logger.error("There's no Upload Definition provided for this upload feature");
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "There's no Upload Definition provided for this upload feature");
        }
//        Definition uploadDefinition = null;
//        try {
//            UploadDefinition definition = objectMapper.readValue(new FileInputStream
//                    ("C:\\Users\\Nithin\\Documents\\eGov\\data-upload\\egov-data-uploader\\src\\main\\resources" +
//                            "\\employee_create.json"), UploadDefinition.class);
//            uploadDefinition = definition.getDefinitions().get(0);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        Definition uploadDefinition = definitionOptional.get();
        logger.info("Definition to be used: " + uploadDefinition);
        AuditDetails auditDetails = uploadJob.getAuditDetails();
        auditDetails.setLastModifiedTime(new Date().getTime());

        try (InputStream file = new FileInputStream(uploadJob.getLocalFilePath())) {
            Document document = excelIO.read(file);

            uploadJob.setEndTime(0L);
            uploadJob.setFailedRows(0);
            uploadJob.setStartTime(new Date().getTime());
            uploadJob.setSuccessfulRows(0);
            uploadJob.setStatus(StatusEnum.INPROGRESS);
            uploadJob.setResponseFilePath(null);
            uploadJob.setTotalRows(document.getRows().size());

            updateJobsWithPersister(auditDetails,uploadJob,false);
//            uploadRegistryRepository.updateJob(uploadJob);

            if (null != uploadDefinition.getIsParentChild() && uploadDefinition.getIsParentChild()) {
                uploadParentChildData(document, uploadDefinition, uploaderRequest);
            } else {
                uploadFlatData(document, uploadDefinition, uploaderRequest);
            }

        } catch (IOException e) {
            logger.error("Unable to open file provided.", e);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setSuccessfulRows(0);
            uploadJob.setStatus(StatusEnum.fromValue("failed"));
            uploadJob.setReasonForFailure(e.getMessage());

            updateJobsWithPersister(auditDetails,uploadJob,false);
//            uploadRegistryRepository.updateJob(uploadJob);
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "Unable to open file provided.");
        } catch(Exception e){
            logger.error("Unknown error ", e);
        }
        finally {
            dataUploadUtils.clearInternalDirectory();
        }
    }


    private void uploadFlatData(Document document, Definition uploadDefinition, UploaderRequest
            uploaderRequest) {
        List<Object> outputHeaders = new ArrayList<>(document.getHeaders());
        UploadJob uploadJob = uploaderRequest.uploadJobs.get(0);
        List<Request> requests = uploadDefinition.getRequests();
        List<DocumentContext> documentContexts = new ArrayList<>();
        AuditDetails auditDetails = uploadJob.getAuditDetails();
        List<List<Object>> responseJsonPathLists=initialiseUploadProcess(document, uploadDefinition, uploaderRequest,outputHeaders,uploadJob
                ,requests,documentContexts,auditDetails);

        try {
            String resultFilePath = dataUploadUtils.createANewFile(resFilePrefix + uploadJob.getRequestFileName());
            dataUploadUtils.writeToexcelSheet(outputHeaders, resultFilePath);
            int successCount = 0;
            int failureCount = 0;
            int recordCount=1;
            for (List<Object> row : document.getRows()) {
                Object previousResponse = null;
                String failureMessage = "";
                List<Object> responseFields = new ArrayList<>();

                for (int i = 0; i < uploadDefinition.getRequests().size(); i++) {
                    logger.debug("row: " + row.toString());
                    if (!row.isEmpty()) {
                        String request = buildRequest(document.getHeaders(), requests.get(i), documentContexts.get(i),
                                uploaderRequest, row, previousResponse);
                        Object response = hitApi(request, dataUploadUtils.getURI(requests.get(i).getUrl
                                ()));

                        previousResponse = response;

                        if (response == null) {
                            failureMessage = "Module API failed with empty body in response";
                        } else {
                            if (response instanceof String) {
                                failureMessage = (String) response;
                            }
                        }
                        responseFields.addAll(dataUploadUtils.fetchValuesFromResponse(response, responseJsonPathLists
                                .get(i)));
                    }
                }

                if(!failureMessage.isEmpty()){
                    failureCount++;
                    writeResultToExcel(failureMessage, row, responseFields, resultFilePath);
                }
                else{
                    successCount++;
                    writeResultToExcel(failureMessage, row, responseFields, resultFilePath);
                }
                if((recordCount%updateProgressSize)==0)
                {   // update progress after every 'updateProgressSize' records
                    uploadJob.setSuccessfulRows(successCount);
                    uploadJob.setFailedRows(failureCount);
                    uploadJob.setStatus(StatusEnum.INPROGRESS);

                    auditDetails.setLastModifiedTime(new Date().getTime());

                    updateJobsWithPersister(auditDetails,uploadJob,false);
                }
                recordCount++;
            }
            auditDetails.setLastModifiedTime(new Date().getTime());
            String responseFilePath = getFileStoreId(uploadJob.getTenantId(), uploadJob.getModuleName(), resultFilePath);

            uploadJob.setSuccessfulRows(successCount);
            uploadJob.setFailedRows(failureCount);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setResponseFilePath(responseFilePath);
            uploadJob.setStatus(StatusEnum.COMPLETED);


            updateJobsWithPersister(auditDetails,uploadJob,false);

//            uploadRegistryRepository.updateJob(uploadJob);

        } catch (IOException e) {
            logger.error("Unable to write to output file.", e);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setStatus(StatusEnum.FAILED);
            uploadJob.setReasonForFailure("IO_Exception, unable to write to output file");


            updateJobsWithPersister(auditDetails,uploadJob,false);

//            uploadRegistryRepository.updateJob(uploadJob);
            throw new CustomException("IO_EXCEPTION", "Unable to write to output file");
        }
    }

    public void updateJobsWithPersister(AuditDetails auditDetails,UploadJob uploadJob,boolean save){
        uploadJob.setAuditDetails(auditDetails);
        HashMap<String,Object> hashMap=new HashMap<>();
        hashMap.put("UploadJob", uploadJob);
        if(save)
        {
            dataUploadProducer.push(uploadJobSaveTopic, hashMap);
        }
        else {
            dataUploadProducer.push(uploadJobUpdateTopic, hashMap);
        }
    }

    private void uploadParentChildData(Document document, Definition uploadDefinition, UploaderRequest uploaderRequest) {
        List<Object> outputHeaders = new ArrayList<>(document.getHeaders());
        UploadJob uploadJob = uploaderRequest.uploadJobs.get(0);
        List<Request> requests = uploadDefinition.getRequests();
        List<DocumentContext> documentContexts = new ArrayList<>();
        AuditDetails auditDetails = uploadJob.getAuditDetails();
        List<List<Object>> responseJsonPathLists=initialiseUploadProcess(document, uploadDefinition, uploaderRequest,outputHeaders,uploadJob
                                                                         ,requests,documentContexts,auditDetails);

        try {
            String resultFilePath = dataUploadUtils.createANewFile(resFilePrefix + uploadJob.getRequestFileName());
            dataUploadUtils.writeToexcelSheet(outputHeaders, resultFilePath);
            //Till now the columnHeaders have been written to result xls. Content processing begins now.

            int successCount = 0;
            int failureCount = 0;
            int recordCount  = 0;
            List<Integer> indexes = dataUploadUtils.getIndexes(uploadDefinition, document.getHeaders());
            List<List<Object>> excelData = document.getRows();

            Map<String, List<List<Object>>> groupedRows = DataUploadUtils.groupRowsByIndexes(excelData, indexes);

            Object previousResponse = null;
            List<List<Object>> filteredList = null;

            for (Map.Entry<String, List<List<Object>>> entry : groupedRows.entrySet()) {
                List<Object> responseFields = new ArrayList<>();
                String failureMessage = "";

                for (int i = 0; i < uploadDefinition.getRequests().size(); i++) {
                    filteredList = entry.getValue();
                    //fetching list of all the rows that will be combined to form ONE request.
                    String request = buildRequestForParentChild(filteredList, document.getHeaders(), requests
                                    .get(i), uploadDefinition,
                            documentContexts.get(i), uploaderRequest, previousResponse);

                    logger.info("FINAL REQUEST to EXTERNAL MODULE: " + request);

                    Object response= hitApi(request, dataUploadUtils.getURI(requests.get(i).getUrl()));
                    previousResponse = response;

                    if (null == response) {
                        failureMessage = "Module API failed with empty body in response";
                    } else {
                        if (response instanceof String) {
                            failureMessage = response.toString();
                        }

                    }

                    responseFields.addAll(dataUploadUtils.fetchValuesFromResponse(response, responseJsonPathLists
                            .get(i)));

                }

                if(!failureMessage.isEmpty()){
                    failureCount++;
                    writeResultToExcelParentChild(failureMessage, entry.getValue(), responseFields, resultFilePath);
                }
                else{
                    successCount++;
                    writeResultToExcelParentChild(failureMessage, entry.getValue(), responseFields, resultFilePath);
                }

                if((recordCount%updateProgressSize)==0)
                {   // update progress after every 'updateProgressSize' records
                    uploadJob.setSuccessfulRows(successCount);
                    uploadJob.setFailedRows(failureCount);
                    uploadJob.setStatus(StatusEnum.INPROGRESS);

                    auditDetails.setLastModifiedTime(new Date().getTime());

                    updateJobsWithPersister(auditDetails,uploadJob,false);

                }
                recordCount++;
            }

            auditDetails.setLastModifiedTime(new Date().getTime());
            String responseFilePath = getFileStoreId(uploadJob.getTenantId(), uploadJob.getModuleName(), resultFilePath);

            uploadJob.setSuccessfulRows(successCount);
            uploadJob.setFailedRows(failureCount);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setResponseFilePath(responseFilePath);
            uploadJob.setStatus(StatusEnum.fromValue("completed"));


            updateJobsWithPersister(auditDetails,uploadJob,false);
//            uploadRegistryRepository.updateJob(uploadJob);

        } catch (IOException e) {
            logger.error("Unable to write to output file.", e);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setStatus(StatusEnum.FAILED);
            uploadJob.setReasonForFailure("IO_Exception, unable to write to output file");

            updateJobsWithPersister(auditDetails,uploadJob,false);
//            uploadRegistryRepository.updateJob(uploadJob);
            throw new CustomException("IO_EXCEPTION", "Unable to write to output file");
        }
    }


    private  List<List<Object>> initialiseUploadProcess(Document document, Definition uploadDefinition, UploaderRequest uploaderRequest,List<Object> outputHeaders,
                                       UploadJob uploadJob,List<Request> requests,List<DocumentContext> documentContexts,AuditDetails auditDetails){

        outputHeaders.add("status");
        outputHeaders.add("message");
        auditDetails.setLastModifiedTime(new Date().getTime());
        List<List<Object>> responseJsonPathLists = new ArrayList<>();
        for (Request request : requests) {
            documentContexts.add(JsonPath.parse(request.getApiRequest()));
            if (null != request.getAdditionalResFields()) {
                List<Object> resJsonPathList = new ArrayList<>();
                for (Entry<String, String> entry : request.getAdditionalResFields().entrySet()) {
                    outputHeaders.add(entry.getValue());
                    resJsonPathList.add(entry.getKey());
                }
                responseJsonPathLists.add(resJsonPathList);
            } else
                responseJsonPathLists.add(Collections.emptyList());
        }
        return responseJsonPathLists;
    }

    private String buildRequest(List<String> columnHeaders, Request request, DocumentContext
            documentContext, UploaderRequest uploaderRequest, List<Object> row, Object previousResponse) {
        logger.debug("row size: " + row.size());
        logger.debug("columnHeaders size: " + columnHeaders.size());

        for (int i = 0; i < columnHeaders.size(); i++) {
            logger.debug("row val: " + row.get(i) + " coloumnHeader: " + columnHeaders.get(i));
            List<String> jsonPathList = request.getExcelHeadersToRequestMap().get(columnHeaders.get(i));
            if (null == jsonPathList || jsonPathList.isEmpty()) {
                logger.info("no jsonpath in config for: " + columnHeaders.get(i));
                continue;
            }
            for (String jsonPath : jsonPathList) {
                StringBuilder expression = new StringBuilder();
                String key = dataUploadUtils.getJsonPathKey(jsonPath, expression);
                documentContext.put(expression.toString(), key, row.get(i));
            }
        }

        logger.info("Adding tenantId...");
        for (String path : request.getTenantIdPaths()) {
            StringBuilder expression = new StringBuilder();
            String key = dataUploadUtils.getJsonPathKey(path, expression);
            documentContext.put(expression.toString(), key, uploaderRequest.getUploadJobs().get(0).getTenantId());
        }

        if (request.getPrevResponseToRequestMap() != null && !request.getPrevResponseToRequestMap().isEmpty()) {
            if (previousResponse != null) {
                try {
                    String response = objectMapper.writeValueAsString(previousResponse);
                    request.getPrevResponseToRequestMap().forEach((key, value) -> {
                        String val = JsonPath.read(response, key);
                        for (String path : value) {
                            StringBuilder expression = new StringBuilder();
                            String targetJsonPath = dataUploadUtils.getJsonPathKey(path, expression);
                            documentContext.put(expression.toString(), targetJsonPath, val);
                        }

                    });
                } catch (JsonProcessingException e) {
                    logger.error("Unable to parse previous response. " + previousResponse.toString());
                } catch (PathNotFoundException e) {
                    logger.error("Unable to get requested value from previous response. ", e);
                }
            }
        }

        documentContext.put("$", "RequestInfo", uploaderRequest.getRequestInfo());
        return documentContext.jsonString();
    }


    private void writeResultToExcel(String failureMessage, List<Object> row, List<Object> responseFields, String
            excelFilepath) throws IOException {

        if (!Objects.isNull(failureMessage) && !failureMessage.isEmpty()) {
            row.add("FAILED");
            row.add(failureMessage);
            row.addAll(responseFields);

        } else {
            row.add("SUCCESS");
            row.add("");
            row.addAll(responseFields);
        }
        dataUploadUtils.writeToexcelSheet(row, excelFilepath);
    }


    public Object hitApi(String request, String url) throws RestClientException {
        logger.info("Request: " + request);
        logger.info("URI: " + url);
        try {
            Map<String, Object> data = objectMapper.readValue(request, Map.class);
            return dataUploadRepository.doApiCall(data, url);
        } catch (IOException e) {
            logger.error("Unable to deserialize the request to map.");
            return null;
        } catch (HttpClientErrorException e) {
            StringBuilder failureMessage = new StringBuilder();
            logger.error("Exception while hitting url: " + url + " with Exception: ", e);
            logger.error("response: " + e.getResponseBodyAsString());
            //Handle unknown response without body, such as 401's etc
            if (e.getResponseBodyAsString().isEmpty()) {
                failureMessage.append("API_ERROR_OCCURRED_").append(e.getRawStatusCode());
            } else {
                List<Object> errors = null;
                String response = e.getResponseBodyAsString();
                try{
                    errors = JsonPath.read(response, "$.Errors");
                }catch(PathNotFoundException pe){
                    logger.error("Unable to get Errors object from Error Response, trying Error object");
                    try{
                        Error error = objectMapper.readValue(response, Error.class);
                        failureMessage.append(error.toString());
                        failureMessage.append(", ");
                    }catch(PathNotFoundException | IOException ignored){}  {
                    }
                }
                if(!Objects.isNull(errors)) {
                    for (Object error : errors) {
                        String errorObject = null;
                        try {
                            errorObject = objectMapper.writeValueAsString(error);
                        } catch (JsonProcessingException e1) {
                            logger.debug("Unable to parse error object");
                        }
                        failureMessage.append(JsonPath.read(errorObject, "$.code").toString());
                        failureMessage.append(":");
                        failureMessage.append(JsonPath.read(errorObject, "$.message").toString());
                        failureMessage.append(", ");
                    }
                    failureMessage.deleteCharAt(failureMessage.toString().length() - 2); //removing last comma
                }
                else{
                    failureMessage.append("API_ERROR_OCCURRED_").append(e.getRawStatusCode());
                }
            }
            logger.error(failureMessage.toString());
            return failureMessage.toString();
        }catch (Exception e) {
        	return e.getClass().getSimpleName().concat("--").concat(e.getMessage());
        }

    }

    public String getFileStoreId(String tenantId, String module, String filePath) throws RestClientException, JsonProcessingException {
        logger.info("Uploading result excel to filestore....");
        Map<String, Object> result = dataUploadRepository.postFileContents(tenantId, module, filePath);
        List<Object> objects = (List<Object>) result.get("files");
        String id = JsonPath.read(objectMapper.writeValueAsString(objects.get(0)), "$.fileStoreId");
        logger.info("responsefile fileStoreId: " + id);

        return id;
    }


    public List<ModuleDefs> getModuleDefs() {
        logger.info("fetching definitions for upload....");
        Map<String, UploadDefinition> uploadDefinitionMap = runner.getUploadDefinitionMap();
        List<ModuleDefs> result = new ArrayList<>();
        for (Entry<String, UploadDefinition> entry : uploadDefinitionMap.entrySet()) {
            ModuleDefs moduleDefs = new ModuleDefs();
            moduleDefs.setName(entry.getKey());
            List<Defs> definitions = new ArrayList<>();
            UploadDefinition uploadDefinition = entry.getValue();
            for (Definition definition : uploadDefinition.getDefinitions()) {
                Defs def = Defs.builder().name(definition.getName()).
                        templatePath(templateFilePrefix + "/" + definition.getTemplateFileName()).build();
                definitions.add(def);
            }
            moduleDefs.setDefinitions(definitions);

            result.add(moduleDefs);
        }
        logger.info("result: " + result);
        return result;

    }


    public List<UploadJob> getUploadJobs(JobSearchRequest jobSearchRequest) {
        logger.info("fetching upload jobs....");
        logger.info("JobSearchRequest: " + jobSearchRequest.toString());
        List<UploadJob> uploadJobs = new ArrayList<>();
        try {
            uploadJobs = uploadRegistryRepository.searchJob(jobSearchRequest);
        } catch (Exception e) {
            logger.error("Exception while searching for jobs", e);
        }

        return uploadJobs;

    }

    private String buildRequestForParentChild(List<List<Object>> filteredList, List<String> columnHeaders, Request
            request, Definition uploadDefinition, DocumentContext documentContext, UploaderRequest uploaderRequest,
                                              Object
                                                      previousResponse)
            throws IOException {

        UploadJob uploadJob = uploaderRequest.uploadJobs.get(0);
        logger.info("filteredList: " + filteredList);
        List<Map<String, Object>> filteredListObjects = new ArrayList<>();
        for (int k = 0; k < filteredList.size(); k++) {
            for (int j = 0; j < columnHeaders.size(); j++) {
                List<String> jsonPathList = request.getExcelHeadersToRequestMap().get(columnHeaders.get(j));
                if (Objects.isNull(jsonPathList) || jsonPathList.isEmpty()) {
                    logger.info("no jsonpath in config for: " + columnHeaders.get(j));
                    continue;
                }
                for (String jsonPath : jsonPathList) {
                    StringBuilder expression = new StringBuilder();
                    String key = dataUploadUtils.getJsonPathKey(jsonPath, expression);
                    logger.debug("expression: " + expression);
                    logger.debug("key: " + key);
                    logger.debug("value: " + filteredList.get(k));

                    documentContext.put(expression.toString(), key, filteredList.get(k).get(j));
                }
            }
            logger.info("Adding tenantId...");
            for (String path : request.getTenantIdPaths()) {
                StringBuilder expression = new StringBuilder();
                String key = dataUploadUtils.getJsonPathKey(path, expression);
                documentContext.put(expression.toString(), key, uploadJob.getTenantId());
            }

            if (request.getPrevResponseToRequestMap() != null && !request.getPrevResponseToRequestMap().isEmpty()) {
                if (previousResponse != null) {
                    try {
                        String response = objectMapper.writeValueAsString(previousResponse);
                        request.getPrevResponseToRequestMap().forEach((key, value) -> {
                            Object val = ((JSONArray) JsonPath.read(response, key)).get(0);
                            for (String path : value) {
                                StringBuilder expression = new StringBuilder();
                                String targetJsonPath = dataUploadUtils.getJsonPathKey(path, expression);
                                documentContext.put(expression.toString(), targetJsonPath, val);
                            }

                        });
                    } catch (JsonProcessingException e) {
                        logger.error("Unable to parse previous response. " + previousResponse.toString());
                    } catch (PathNotFoundException e) {
                        logger.error("Unable to get requested value from previous response. ", e);
                    }
                }
            }

            Map<String, Object> objectMap = objectMapper.readValue(documentContext.jsonString(), Map.class);
            //this is for setting child objects to empty list in the request if the excel doesn't have values for child.
            objectMap = dataUploadUtils.eliminateEmptyList(objectMap);
            filteredListObjects.add(objectMap);
        }
        List<String> uniqueKeysForInnerObject = new ArrayList<>();
        if (uploadDefinition.getUniqueKeysForInnerObject() != null) {
            for (String col : uploadDefinition.getUniqueKeysForInnerObject()) {
                StringBuilder expression = new StringBuilder();
                String key = dataUploadUtils.getJsonPathKey(request.getExcelHeadersToRequestMap().get(col).get(0), expression);
                uniqueKeysForInnerObject.add(key);
            }
        }
        Map<String, Object> requestMap = new HashMap<>();
        for (Map map : filteredListObjects) {
            deepMerge(requestMap, map, uniqueKeysForInnerObject);
        }
        logger.info("requestMap: " + requestMap);
        try {
            requestMap.put("RequestInfo", uploaderRequest.getRequestInfo());
        } catch (Exception e) {
            requestMap.put("requestInfo", uploaderRequest.getRequestInfo());
        }
        Object requestContentBody = null;
        try {
            requestContentBody = objectMapper.writeValueAsString(requestMap);
        } catch (Exception e) {
            logger.error("Exception while parsing requestMap to String", e);
        }
        return requestContentBody.toString();
    }

    @SuppressWarnings("rawtypes")
    private static Map deepMerge(Map original, Map newMap, List<String> uniqueKeysForInnerObject) {
        for (Object key : newMap.keySet()) {
            logger.debug("key: " + key);
            if (newMap.get(key) instanceof Map && original.get(key) instanceof Map) {
                Map originalChild = (Map) original.get(key);
                Map newChild = (Map) newMap.get(key);
                original.put(key, deepMerge(originalChild, newChild, uniqueKeysForInnerObject));
            } else if (newMap.get(key) instanceof List && original.get(key) instanceof List) {
                logger.debug("Instance of list: ");
                List originalChild = (List) original.get(key);
                logger.info("originalChild: " + originalChild);
                List newChild = (List) newMap.get(key);
                logger.info("newChild: " + newChild);
                if (originalChild.isEmpty() || newChild.isEmpty()) {
                    continue;
                }

                if(originalChild.containsAll(newChild))
                    continue;

                Map<Object, Object> originalChildEntry = (Map) originalChild.get(originalChild.size() - 1); //other entries have been verified in previous iterations
                Map<Object, Object> newChildEntry = (Map) newChild.get(0);  //cuz definitely the list will always have only one entry.
                int counter = 0;
                try {
                    for (String mapKey : uniqueKeysForInnerObject) {
                        if (originalChildEntry.get(mapKey).
                                equals(newChildEntry.get(mapKey))) {
                            counter++;
                        } else {
                            break;
                        }
                    }
                    if (counter == uniqueKeysForInnerObject.size() && counter != 0) {
                        logger.debug("Match found!");
                        for (Object originalMapKey : originalChildEntry.keySet()) {
                            if (originalChildEntry.get(originalMapKey) instanceof List) {
                                List newChildValue = (List) newChildEntry.get(originalMapKey);
                                List originalChildValue = (List) originalChildEntry.get(originalMapKey);
                                originalChildValue.addAll(newChildValue);
                                originalChildEntry.put(originalMapKey, originalChildValue);
                            }
                        }
                    } else {
                        logger.debug("No match found!");
                        originalChild.add(newChildEntry);
                    }
                } catch (Exception e) {
                    if (!originalChild.contains(newChildEntry)) {
                        originalChild.add(newChildEntry);
                        continue;
                    }
                }
            } else {
                logger.info("Adding new key: " + key + " value: " + newMap.get(key) + " to original");
                original.put(key, newMap.get(key));
            }
        }
        return original;
    }

    private void writeResultToExcelParentChild(String failureMessage, List<List<Object>> rows, List<Object>
            responseFields, String outputExcelFilepath) throws IOException{

            for (List<Object> row : rows) {
                writeResultToExcel(failureMessage, row, responseFields, outputExcelFilepath);
            }

    }
}