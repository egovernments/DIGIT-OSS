package org.egov.pgr.controller;

import javax.validation.Valid;

import org.egov.pgr.contract.ReportRequest;
import org.egov.pgr.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/v1/reports/")
public class ReportController {
	
	@Autowired
	private ReportService service;

	@PostMapping("_get")
	@ResponseBody
	public ResponseEntity<?> getReports(@RequestBody @Valid ReportRequest reportRequest) {
		Object response = service.getReports(reportRequest);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
}
