package org.egov.vendor.driver.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.driver.service.DriverService;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverResponse;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.driver.web.model.RequestInfoWrapper;
import org.egov.vendor.driver.web.util.DriverUtil;
import org.egov.vendor.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/driver/")
public class DriverController {
	@Autowired
	private DriverService driverService;

	@Autowired
	private DriverUtil driverUtil;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping(value = "/_create")
	public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverRequest driverRequest) {
		driverUtil.defaultJsonPathConfig();
		Driver driver = driverService.create(driverRequest);
		List<Driver> driverList = new ArrayList<Driver>();
		driverList.add(driver);
		DriverResponse response = DriverResponse.builder().driver(driverList)
				.responseInfo(
						responseInfoFactory.createResponseInfoFromRequestInfo(driverRequest.getRequestInfo(), true))
				.build();

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PostMapping(value = "/_update")
	public ResponseEntity<DriverResponse> update(@Valid @RequestBody DriverRequest driverRequest) {
		driverUtil.defaultJsonPathConfig();
		Driver driver = driverService.update(driverRequest);
		List<Driver> driverList = new ArrayList<Driver>();
		driverList.add(driver);
		DriverResponse response = DriverResponse.builder().driver(driverList)
				.responseInfo(
						responseInfoFactory.createResponseInfoFromRequestInfo(driverRequest.getRequestInfo(), true))
				.build();

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PostMapping(value = "/_search")
	public ResponseEntity<DriverResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute DriverSearchCriteria criteria) {
		List<Driver> driverList = driverService.driversearch(criteria, requestInfoWrapper.getRequestInfo());
		DriverResponse response = DriverResponse.builder().driver(driverList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
}
