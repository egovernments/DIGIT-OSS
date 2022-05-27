package org.egov.vendor.driver.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.util.DriverUtil;
import org.egov.vendor.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/driver/")
public class DriverController {
//	@Autowired
//	private DriverService driverService;
//	
//	@Autowired
//	private DriverUtil driverUtil;
//	
//	@Autowired
//	private ResponseInfoFactory responseInfoFactory;
//
//	
//	@PostMapping(value = "/_create")
//	public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverRequest driverRequest){
//		driverUtil.defaultJsonPathConfig();		
//		Driver driver =  driverService.create(diverRequest);
//		List<Driver> driverList = new ArrayList<Driver>();
//		driverList.add(Driver);
//		DriverResponse response = DriverResponse.builder().diver(driverList)
//				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(driverRequest.getRequestInfo(), true))
//				.build();
		
//		return new ResponseEntity<>(response,HttpStatus.OK);
		
//	}
}
