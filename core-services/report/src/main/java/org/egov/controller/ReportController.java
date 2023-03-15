package org.egov.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.ReportApp;
import org.egov.domain.model.MetaDataRequest;
import org.egov.domain.model.ReportDefinitions;
import org.egov.report.service.ReportService;
import org.egov.swagger.model.MetadataResponse;
import org.egov.swagger.model.ReportRequest;
import org.egov.swagger.model.ReportResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
public class ReportController {

    public ReportDefinitions reportDefinitions;

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
    public ResponseEntity<?> create(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final MetaDataRequest metaDataRequest,
                                    final BindingResult errors) {
        try {
            System.out.println("The Module Name from the URI is :" + moduleName);
            MetadataResponse mdr = reportService.getMetaData(metaDataRequest, moduleName);
            return reportService.getSuccessResponse(mdr, metaDataRequest.getRequestInfo(), metaDataRequest.getTenantId());
        } catch (CustomException ex) {
            log.error("Report config invalid", ex);
            throw ex;
        } catch (Exception e) {
            log.error("ERROR IN GETTING METADATA", e);
            throw new CustomException("ERROR_IN_GETTING_METADATA", e.getMessage());
        }
    }


    @PostMapping("/{moduleName}/_get")
    @ResponseBody
    public ResponseEntity<?> getReportData(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final ReportRequest reportRequest,
                                           final BindingResult errors) {


        try {
            ReportResponse reportResponse = reportService.getReportData(reportRequest, moduleName, reportRequest.getReportName(), reportRequest.getRequestInfo().getAuthToken());
            return new ResponseEntity<>(reportResponse, HttpStatus.OK);
        } catch (CustomException e) {
            log.error("Error in getting report data", e);
            throw e;
        } catch (Exception e) {
            log.error("Error in getting report data", e);
            throw new CustomException("ERROR_IN_RETRIEVING_REPORT_DATA", e.getMessage());
        }
    }


    @PostMapping("/{moduleName}/total/_get")
    @ResponseBody
    public ResponseEntity<?> getReportDataTotal(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final ReportRequest reportRequest,
                                                final BindingResult errors) {
        try {
            ReportResponse reportResponse = reportService.getReportData(reportRequest, moduleName, reportRequest.getReportName(), reportRequest.getRequestInfo().getAuthToken());
            return new ResponseEntity<>(reportResponse.getReportData().size(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in getting report data total", e);
            throw new CustomException("ERROR_IN_RETRIEVING_REPORT_DATA_TOTAL", e.getMessage());
        }
    }


    @PostMapping("_reload")
    @ResponseBody
    public ResponseEntity<?> reloadYamlData(@RequestBody @Valid final MetaDataRequest reportRequest,
                                            final BindingResult errors) {
        try {

            ReportApp.loadYaml("common");

        } catch (Exception e) {
            log.error("Error in reloading Yaml data", e);
            throw new CustomException("ERROR_IN_RELOADING_YAML_DATA", e.getMessage());
        }
        return reportService.reloadResponse(reportRequest.getRequestInfo(), null);

    }

    @PostMapping("/{moduleName}/{version}/metadata/_get")
    @ResponseBody
    public ResponseEntity<?> createv1(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final MetaDataRequest metaDataRequest,
                                      final BindingResult errors) {
        try {
            System.out.println("The Module Name from the URI is :" + moduleName);
            MetadataResponse mdr = reportService.getMetaData(metaDataRequest, moduleName);
            return reportService.getSuccessResponse(mdr, metaDataRequest.getRequestInfo(), metaDataRequest.getTenantId());
        } catch (Exception e) {
            log.error("Error in getting report data", e);
            throw new CustomException("ERROR_IN_RETRIEVING_REPORT_DATA", e.getMessage());
        }
    }

    @PostMapping("/{moduleName}/{version}/_get")
    @ResponseBody
    public ResponseEntity<?> getReportDatav1(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final ReportRequest reportRequest,
                                             final BindingResult errors) {
        try {
            List<ReportResponse> reportResponse = reportService.getAllReportData(reportRequest, moduleName, reportRequest.getRequestInfo().getAuthToken());
            return reportService.getReportDataSuccessResponse(reportResponse, reportRequest.getRequestInfo(), reportRequest.getTenantId());
        } catch (Exception e) {
            log.error("Error in getting Report data ver1", e);
            throw new CustomException("ERROR_IN_RETRIEVING_REPORT_DATA", e.getMessage());
        }
    }


    @PostMapping("{moduleName}/{version}/_reload")
    @ResponseBody
    public ResponseEntity<?> reloadYamlDatav1(@PathVariable("moduleName") String moduleName, @RequestBody @Valid final MetaDataRequest reportRequest,
                                              final BindingResult errors) {
        try {

            ReportApp.loadYaml(moduleName);
        } catch (Exception e) {
            log.error("Error in reloading yaml data v1", e);
            throw new CustomException("ERROR_IN_RELOADING_YAML_DATA", e.getMessage());
        }
        return reportService.reloadResponse(reportRequest.getRequestInfo(), null);

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
