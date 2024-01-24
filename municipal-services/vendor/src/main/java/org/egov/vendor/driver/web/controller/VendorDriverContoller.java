package org.egov.vendor.driver.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.driver.service.DriverService;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverResponse;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.util.ResponseInfoFactory;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/driver/v1")
public class VendorDriverContoller {

	@Autowired
	private DriverService driverService;

	@Autowired
	private VendorUtil vendorUtil;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping(value = "/_create")
	public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverRequest driverRequest) throws Exception {
		vendorUtil.defaultJsonPathConfig();
		Driver driver = driverService.create(driverRequest);
		List<Driver> driverList = new ArrayList<>();
		driverList.add(driver);
		DriverResponse response = DriverResponse.builder().driver(driverList)
				.responseInfo(
						responseInfoFactory.createResponseInfoFromRequestInfo(driverRequest.getRequestInfo(), true))
				.build();

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PostMapping(value = "/_update")
	public ResponseEntity<DriverResponse> update(@Valid @RequestBody DriverRequest driverRequest) {
		vendorUtil.defaultJsonPathConfig();
		Driver driver = driverService.update(driverRequest);
		List<Driver> driverList = new ArrayList<>();
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
		DriverResponse response = driverService.search(criteria, requestInfoWrapper.getRequestInfo());
		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

}
