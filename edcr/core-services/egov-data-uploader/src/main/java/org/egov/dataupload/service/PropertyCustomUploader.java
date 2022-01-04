package org.egov.dataupload.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.egov.common.contract.request.RequestInfo;
import org.egov.dataupload.model.UploadJob;
import org.egov.dataupload.model.UploadJob.StatusEnum;
import org.egov.dataupload.model.UploaderRequest;
import org.egov.dataupload.property.PropertyFileReader;
import org.egov.dataupload.property.models.AuditDetails;
import org.egov.dataupload.property.models.Property;
import org.egov.dataupload.repository.UploadRegistryRepository;
import org.egov.dataupload.utils.Constants.PTTemplateDetail;
import org.egov.dataupload.utils.DataUploadUtils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyCustomUploader {

	@Autowired
	private DataUploadService dataUploadService;

	@Autowired
	private PropertyFileReader propFileReader;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private UploadRegistryRepository uploadRegistryRepository;

	@Autowired
	private DataUploadUtils uploadUtils;

	@Value("${property.host}")
	private String propertyHost;

	@Value("${property.create}")
	private String propertyCreate;

	@Value("${internal.file.folder.path}")
	private String internalFolderPath;

	@Value("${uploadjob.update.progress.size}")
	private int updateProgressSize;

	@Autowired
	private DataUploadUtils dataUploadUtils;

	private String responseString = "Response";
	
	public static final String SUCCESSSTRING = "SUCCESS";

	public static final String FAILEDSTRING = "FAILED";

	public void uploadPropertyData(UploaderRequest uploaderRequest) {

		RequestInfo requestInfo = uploaderRequest.getRequestInfo();
		requestInfo.setTs(null);
		UploadJob job = uploaderRequest.getUploadJobs().get(0);
		String loc = job.getLocalFilePath();
		Map<String, Map<String, Object>> map = null;

		AuditDetails auditDetails = job.getAuditDetails();
		auditDetails.setLastModifiedTime(new Date().getTime());

		job.setStartTime(System.currentTimeMillis());
		job.setStatus(StatusEnum.INPROGRESS);

		dataUploadService.updateJobsWithPersister(auditDetails,job,false);
//		uploadRegistryRepository.updateJob(job);

		/*
		 * Resulting map from 'propFileReader.parseExcel' is a linkedhashmap to preserve
		 * the order of insertion so that results can be written back in to excel with
		 * ease
		 */
		try {
			map = propFileReader.parseExcel(loc);
		} catch (Exception e) {

			log.error("exception occurred while parsing the excel : ", e);

			job.setEndTime(System.currentTimeMillis());
			job.setStatus(StatusEnum.FAILED);
			job.setReasonForFailure("Parsing of the excel failed:");

			dataUploadService.updateJobsWithPersister(auditDetails,job,false);
			uploadUtils.clearInternalDirectory();
			CustomException exception = new CustomException("Exception Occurred while parsing the excel", e.getMessage());
			exception.initCause(e);
			throw exception;
		}

		List<Map<String, String>> responses = new ArrayList<>();
		int failCnt = 0;
		int sucCnt = 0;
		int recordCount = 1;

		for (Entry<String, Map<String, Object>> entry : map.entrySet()) {
			String failureMessage;
			Map<String, String> resp = new HashMap<>();

			if(entry.getKey().contains("duplicate"))
			{
				failCnt++;
				resp.put("Status", FAILEDSTRING);
				resp.put("Message", "Duplicate property found");
			}
			else{
				Object response = dataUploadService.hitApi(getRequestForPost((Property) entry.getValue().get("Property"), requestInfo),
						getUrlForPost());

				if (null == response) {
					resp.put("Status", FAILEDSTRING);
					resp.put("Message", "Module API failed with empty body in response");
					failCnt++;
				} else {
					if (response instanceof String) {
						resp.put("Status", FAILEDSTRING);
						resp.put("Message", response.toString());
						failCnt++;
					} else {
						sucCnt++;
						resp.put("Status", SUCCESSSTRING);
						resp.put("Message", "");
						resp.put("Property ID", getPropertyId(response));
						resp.put("Assessment Number", getPropertyAssessmentNumber(response));
					}
				}
				resp.put("_rowindex", entry.getValue().get("_rowindex").toString());
			}
			responses.add(resp);

			if((recordCount % updateProgressSize)==0)
			{   // update progress after every 'updateProgressSize' records
				job.setSuccessfulRows(sucCnt);
				job.setFailedRows(failCnt);
				job.setStatus(StatusEnum.INPROGRESS);

				auditDetails.setLastModifiedTime(new Date().getTime());

				dataUploadService.updateJobsWithPersister(auditDetails,job,false);
			}
			recordCount++;
		}

		// the responses will be taken in the same order as written in excel
		writeToExcel(job, responses);
		auditDetails.setLastModifiedTime(new Date().getTime());
		// Upload to s3 and set result file path to job
		String s3Id = null;
		try {
			s3Id = dataUploadService.getFileStoreId(job.getTenantId(), job.getModuleName(), internalFolderPath + File.separator + job.getResponseFilePath());
		} catch (Exception e) {

			log.error(" upload of the excel sheet failed : ", e);

			job.setEndTime(System.currentTimeMillis());
			job.setStatus(StatusEnum.FAILED);
			job.setReasonForFailure("upload of the excel sheet failed");

			dataUploadService.updateJobsWithPersister(auditDetails,job,false);
//			uploadRegistryRepository.updateJob(job);
			uploadUtils.clearInternalDirectory();
			throw new CustomException("upload of the excel sheet failed", e.getMessage());
		}

		job.setResponseFilePath(s3Id);
		job.setEndTime(System.currentTimeMillis());
		job.setFailedRows(failCnt);
		job.setSuccessfulRows(sucCnt);
		job.setStatus(StatusEnum.COMPLETED);
		job.setTotalRows(map.size());

		dataUploadService.updateJobsWithPersister(auditDetails,job,false);
//		uploadRegistryRepository.updateJob(job);
		uploadUtils.clearInternalDirectory();

		log.info(" the id of s3 data : " + s3Id);
	}

	private String getPropertyId(Object response) {
		DocumentContext propRes = JsonPath.parse(response);
		return propRes.read("$.Properties[0].propertyId");
	}

	private String getPropertyAssessmentNumber(Object response) {
		DocumentContext propRes = JsonPath.parse(response);
		return propRes.read("$.Properties[0].propertyDetails[0].assessmentNumber");
	}


	/**
	 * method to write the responses from the API in to the excel sheet
	 *
	 * 1. read the file from local storage
	 *
	 * 2. convert the i/p stream to workbook
	 *
	 * 3. get the property sheet from the book
	 *
	 * 4. read the rows and write the responses in to them
	 *
	 * 5. save the response excel and close the resources
	 *
	 * @param job
	 * @param responses
	 */
	private void writeToExcel(UploadJob job, List<Map<String, String>> responses) {

		FileInputStream myxls = null;
		XSSFWorkbook propertyExcel = null;

		String resPath = responseString + "-" + job.getCode() + "-" + job.getRequestFileName();
		job.setResponseFilePath(resPath);

		try {

			myxls = new FileInputStream(job.getLocalFilePath());
			propertyExcel = new XSSFWorkbook(myxls);
			XSSFSheet propertySheet = propertyExcel.getSheet("Property_Detail");
			Row firstRow = propertySheet.getRow(0);

			int fixedResNum = firstRow.getLastCellNum();

			Map<String, Integer> columnToIndex = dataUploadUtils.getColumnIndexMap(firstRow);

			String[] responseColumns =  {"Status", "Message", "Property ID", "Assessment Number"};

			for (String respCol : responseColumns) {
				if (!columnToIndex.containsKey(dataUploadUtils.getCleanedName(respCol))) {
					firstRow.createCell(fixedResNum).setCellValue(respCol);
					columnToIndex.put(dataUploadUtils.getCleanedName(respCol), fixedResNum++);
				}
			}

			for (int i = 0; i < responses.size(); i++) {

				Map<String, String> resp = responses.get(i);

				Row currRow = propertySheet.getRow(Integer.parseInt(resp.get("_rowindex")));

				for (String respCol : responseColumns) {
					String colName = dataUploadUtils.getCleanedName(respCol);
					int colIndex = columnToIndex.get(colName);
					if (resp.containsKey(respCol) == true) {
						currRow.createCell(colIndex).setCellValue(resp.get(respCol));
					}
				}

				if (resp.containsKey("Status"))
					// In case we processed the row, set the Process column value to blank
					// this will be later treated as false only for process
					currRow.getCell(PTTemplateDetail.Process.ordinal()).setCellValue("");
			}

			myxls.close();
			FileOutputStream outputFile = new FileOutputStream(new File(internalFolderPath + File.separator + resPath));
			propertyExcel.write(outputFile);
			outputFile.close();

			log.info(" file is successfully written");

		} catch (Exception e) {

			log.error(" Exception occurred while writing in sheet : ", e);

			job.setEndTime(System.currentTimeMillis());
			job.setStatus(StatusEnum.FAILED);
			job.setReasonForFailure(" writing response in excel failed");

			dataUploadService.updateJobsWithPersister(job.getAuditDetails(),job,false);
//			uploadRegistryRepository.updateJob(job);
			uploadUtils.clearInternalDirectory();
			throw new CustomException("Exception occurred while writing in sheet", e.getMessage());
		} finally {

			if (null != myxls)
				try {
					myxls.close();
				} catch (IOException e) {
					log.error("exception while closing resource in write file ");
				}

			if (null != propertyExcel)
				try {
					propertyExcel.close();
				} catch (IOException e) {
					log.error("exception while closing resource in write file ");
				}
		}
	}

	/**
	 * Creates a request Object(map) with RequestInfo and Properties
	 * 
	 * @param property
	 * @param requestInfo
	 * @return
	 */
	private String getRequestForPost(Property property, RequestInfo requestInfo) {

		Map<String, Object> reqMap = new HashMap<>();
		reqMap.put("RequestInfo", requestInfo);
		reqMap.put("Properties", Arrays.asList(property));

		String res = null;
		try {
			res = mapper.writeValueAsString(reqMap);
		} catch (JsonProcessingException e) {
			log.error(" Error occurred while writing request map to string : ", e);
			throw new CustomException(" Error occurred while writing request map to string : ", e.getMessage());
		}
		return res;
	}

	/**
	 * Method to provide the url for the API call
	 * 
	 */
	private String getUrlForPost() {
		return propertyHost.concat(propertyCreate);
	}
}
