package org.egov.demoutility.controller;

import org.egov.demoutility.model.DemoUtilityRequest;
import org.egov.demoutility.service.DemoUtilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/")
public class DemoUtilityController {

	@Autowired
	DemoUtilityService demoUtilityService;

	@PostMapping("_createdemousers")
	public ResponseEntity<?> createdemousers(@RequestBody DemoUtilityRequest demoUtilityRequest) {

		String message = demoUtilityService.createdemousers(demoUtilityRequest);

		return new ResponseEntity<>(message, HttpStatus.OK);

	}

}
