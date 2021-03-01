package org.egov.vehicle.trip.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vehicle.trip.service.VehicleTripService;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.VehicleTripResponse;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.ResponseInfoFactory;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trip/v1")
public class VehicleTripController {
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private VehicleUtil vehicleLogUtil;
	
	@Autowired
	private VehicleTripService vehicleTripService;
	
	@PostMapping(value = "/_create")
	public ResponseEntity<VehicleTripResponse> create(@Valid @RequestBody VehicleTripRequest request) {
		
		vehicleLogUtil.defaultJsonPathConfig();
		VehicleTrip vehicleLog = vehicleTripService.create(request);
		List<VehicleTrip> vehicleLogList = new ArrayList<VehicleTrip>();
		vehicleLogList.add(vehicleLog);
		VehicleTripResponse response = VehicleTripResponse.builder().vehicleTrip(vehicleLogList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_update")
	public ResponseEntity<VehicleTripResponse> update(@Valid @RequestBody VehicleTripRequest request) {
		
		vehicleLogUtil.defaultJsonPathConfig();
		VehicleTrip vehicleLog = vehicleTripService.update(request);
		List<VehicleTrip> vehicleLogList = new ArrayList<VehicleTrip>();
		vehicleLogList.add(vehicleLog);
		VehicleTripResponse response = VehicleTripResponse.builder().vehicleTrip(vehicleLogList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_search")
	public ResponseEntity<VehicleTripResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute VehicleTripSearchCriteria criteria) {
		
		List<VehicleTrip> vehicleLogList = vehicleTripService.search(criteria, requestInfoWrapper.getRequestInfo());
		
		VehicleTripResponse response = VehicleTripResponse.builder().vehicleTrip(vehicleLogList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
