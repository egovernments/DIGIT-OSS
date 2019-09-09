package org.egov.controller;
import java.util.List;

import javax.validation.Valid;

import org.egov.ReportApp;
import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.MetaDataRequest;
import org.egov.domain.model.ReportDefinitions;
import org.egov.report.repository.builder.ReportQueryBuilder;
import org.egov.report.service.ReportService;
import org.egov.swagger.model.MetadataResponse;
import org.egov.swagger.model.ReportDataResponse;
import org.egov.swagger.model.ReportRequest;
import org.egov.swagger.model.ReportResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;


@RestController
public class ReportController {

	public ReportDefinitions reportDefinitions;

	public static final Logger LOGGER = LoggerFactory.getLogger(ReportController.class);


	@Autowired
	public ReportController(ReportDefinitions reportDefinitions) {
		this.reportDefinitions = reportDefinitions;
	}

	@Autowired
	private ReportService reportService;
	
	/*@Autowired
	private ReportQueryBuilder reportQueryBuilder;*/

	@Autowired
    public static ResourceLoader resourceLoader;

	@PostMapping("/{moduleName}/metadata/_get")
	@ResponseBody
	public ResponseEntity<?> create(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final MetaDataRequest metaDataRequest,
			final BindingResult errors) {
		try{
		System.out.println("The Module Name from the URI is :"+moduleName);
		MetadataResponse mdr = reportService.getMetaData(metaDataRequest,moduleName);
		return reportService.getSuccessResponse(mdr, metaDataRequest.getRequestInfo(),metaDataRequest.getTenantId());
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(metaDataRequest.getRequestInfo(),metaDataRequest.getTenantId());
		}
	}

	@PostMapping("/{moduleName}/_get")
	@ResponseBody
	public ResponseEntity<?> getReportData(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final ReportRequest reportRequest,
			final BindingResult errors) {


		try {
			ReportResponse reportResponse = reportService.getReportData(reportRequest,moduleName,reportRequest.getReportName(),reportRequest.getRequestInfo().getAuthToken());
			return new ResponseEntity<>(reportResponse, HttpStatus.OK);
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(reportRequest.getRequestInfo(),reportRequest.getTenantId());
		}
	}

	@PostMapping("/{moduleName}/total/_get")
	@ResponseBody
	public ResponseEntity<?> getReportDataTotal(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final ReportRequest reportRequest,
			final BindingResult errors)  {
		try {
			ReportResponse reportResponse = reportService.getReportData(reportRequest,moduleName,reportRequest.getReportName(),reportRequest.getRequestInfo().getAuthToken());
			return new ResponseEntity<>(reportResponse.getReportData().size(), HttpStatus.OK);
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(reportRequest.getRequestInfo(),reportRequest.getTenantId());
		}
	}


	@PostMapping("_reload")
	@ResponseBody
	public ResponseEntity<?> reloadYamlData(@RequestBody @Valid final MetaDataRequest reportRequest,
			final BindingResult errors) {
		try {

		ReportApp.loadYaml("common");

		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(reportRequest.getRequestInfo(),reportRequest.getTenantId(),e);
		}
		return reportService.reloadResponse(reportRequest.getRequestInfo(),null);

	}

	@PostMapping("/{moduleName}/{version}/metadata/_get")
	@ResponseBody
	public ResponseEntity<?> createv1(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final MetaDataRequest metaDataRequest,
			final BindingResult errors) {
		try{
		System.out.println("The Module Name from the URI is :"+moduleName);
		MetadataResponse mdr = reportService.getMetaData(metaDataRequest,moduleName);
		return reportService.getSuccessResponse(mdr, metaDataRequest.getRequestInfo(),metaDataRequest.getTenantId());
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(metaDataRequest.getRequestInfo(),metaDataRequest.getTenantId());
		}
	}

	@PostMapping("/{moduleName}/{version}/_get")
	@ResponseBody
	public ResponseEntity<?> getReportDatav1(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final ReportRequest reportRequest,
			final BindingResult errors) {
		try {
		List<ReportResponse> reportResponse = reportService.getAllReportData(reportRequest,moduleName,reportRequest.getRequestInfo().getAuthToken());
		return reportService.getReportDataSuccessResponse(reportResponse, reportRequest.getRequestInfo(),reportRequest.getTenantId());
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(reportRequest.getRequestInfo(),reportRequest.getTenantId());
		}
	}


	@PostMapping("{moduleName}/{version}/_reload")
	@ResponseBody
	public ResponseEntity<?> reloadYamlDatav1(@PathVariable("moduleName") String moduleName,@RequestBody @Valid final MetaDataRequest reportRequest,
			final BindingResult errors) {
		try {

		ReportApp.loadYaml(moduleName);
		} catch(Exception e){
			e.printStackTrace();
			return reportService.getFailureResponse(reportRequest.getRequestInfo(),reportRequest.getTenantId(),e);
		}
		return reportService.reloadResponse(reportRequest.getRequestInfo(),null);

	}
	
	
	/*@PostMapping("_test")
	@ResponseBody
	public ResponseEntity<?> test(@RequestBody Object request) {
		try {
			LOGGER.info("Request: "+request);
			reportQueryBuilder.buildInlineQuery(request);
		} catch(Exception e){
			LOGGER.error("Exp: ",e );
			return new ResponseEntity<>(request, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(request, HttpStatus.OK);

	}
*/

}