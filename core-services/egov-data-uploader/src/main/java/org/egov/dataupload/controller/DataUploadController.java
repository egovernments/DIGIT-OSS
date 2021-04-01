package org.egov.dataupload.controller;

import org.egov.dataupload.model.*;
import org.egov.dataupload.service.DataUploadService;
import org.egov.dataupload.utils.DataUploadUtils;
import org.egov.dataupload.utils.ResponseInfoFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping(value = "/v1")
public class DataUploadController {
		
	@Autowired
	private DataUploadService dataUploadService;
		
	@Autowired
    public ResourceLoader resourceLoader;
	
	@Autowired
	public ResponseInfoFactory responseInfoFactory;

	@Autowired
    public DataUploadUtils dataUploadUtils;

	public static final Logger logger = LoggerFactory.getLogger(DataUploadController.class);
	
	
	@PostMapping("jobs/_create")
	@ResponseBody
	public ResponseEntity<?> upload(@RequestBody @Valid UploaderRequest uploaderRequest) throws Exception {
		try {
				logger.info("Inside controller");
				List<UploadJob> uploadJobs = dataUploadService.createUploadJob(uploaderRequest);
				UploaderResponse result = UploaderResponse.builder()
						.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(uploaderRequest.getRequestInfo(), true))
						.uploadJobs(uploadJobs).build();
				return new ResponseEntity<>(result, HttpStatus.OK);
		} catch(Exception e){
			throw e;
		}
	}
	
	@PostMapping("upload-definitions/_search")
	@ResponseBody
	public ResponseEntity<?> definitionSearch(@RequestBody @Valid ModuleDefRequest moduleDefRequest) throws Exception {
		try {
				logger.info("Inside controller");
				List<ModuleDefs> moduleDefs = dataUploadService.getModuleDefs();
				ModuleDefResponse result = ModuleDefResponse.builder()
						.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(moduleDefRequest.getRequestInfo(), true))
						.moduleDefs(moduleDefs).build();
				return new ResponseEntity<>(result, HttpStatus.OK);
		} catch(Exception e){
			throw e;
		}
	}
	
	@PostMapping("jobs/_search")
	@ResponseBody
	public ResponseEntity<?> jobsSearch(@RequestBody @Valid JobSearchRequest jobSearchRequest) throws Exception {
		try {
				logger.info("Inside controller");
				List<UploadJob> uploadJobs = dataUploadService.getUploadJobs(jobSearchRequest);
				UploaderResponse result = UploaderResponse.builder()
						.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(jobSearchRequest.getRequestInfo(), true))
						.uploadJobs(uploadJobs).build();
				return new ResponseEntity<>(result, HttpStatus.OK);
		} catch(Exception e){
			throw e;
		}
	}


//    @PostMapping(value = "upload-definitions/_test",produces = "application/json")
//    public ResponseEntity<?> definitionTest(@RequestBody @Valid DefinitionTestRequest definitionTestRequest) throws Exception {
//        try {
//            logger.info("Inside controller");
//            DefinitionTestResponse response = new DefinitionTestResponse();
//            response.results = new ArrayList<>();
//
//            List<?> results = response.results;
//
//
//
//            List<Object> headers = definitionTestRequest.getHeaders();
//            List<List<Object>> data = definitionTestRequest.getData();
//            Definition uploadDefinition = definitionTestRequest.getDefinition();
//            UploaderRequest uploaderRequest = new UploaderRequest();
//            uploaderRequest.uploadJobs = new ArrayList<UploadJob>();
//            UploadJob uploadJob = new UploadJob();
//            uploadJob.setTenantId("default");
//            uploaderRequest.uploadJobs.add(uploadJob);
//
//			ObjectMapper objectMapper = new ObjectMapper();
//
//            if (null != uploadDefinition.getIsParentChild() && uploadDefinition.getIsParentChild()) {
//
//                DocumentContext documentContext = dataUploadUtils.getDocumentContext(uploadDefinition);
//                DocumentContext bulkApiRequest = dataUploadUtils.getBulkApiRequestContext(uploadDefinition);
//                List<Integer> indexes = dataUploadUtils.getIndexes(uploadDefinition, headers);
//
//                for (int i = 0; i < data.size(); i++) {
//                    List<List<Object>> filteredList = dataUploadUtils.filter(data, indexes, data.get(i));
//                    String request = dataUploadService.buildRequestForParentChild(i, filteredList, headers, 0, uploadDefinition, documentContext, uploaderRequest, bulkApiRequest);
//                    results.add(objectMapper.readValue(request, new TypeReference<Map<String, Object>>(){}));
//                    i +=  (filteredList.size() - 1);
//                }
//            } else {
//
//                DocumentContext documentContext = JsonPath.parse(uploadDefinition.getApiRequest());
//
//                for (int i = 0; i < data.size(); i++) {
//                    String request = dataUploadService.buildRequest(headers, 0, uploadDefinition, documentContext, uploaderRequest, data.get(i));
//                    results.add(objectMapper.readValue(request, new TypeReference<Map<String, Object>>(){}));
//                }
//            }
//
////            return "[" + String.join(",",results) + "]";
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            throw e;
//        }
//    }

}

		