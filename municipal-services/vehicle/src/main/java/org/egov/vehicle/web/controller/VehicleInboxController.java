package org.egov.vehicle.web.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.vehicle.service.VehicleInboxService;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripDetailResponse;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.ResponseInfoFactory;
import org.egov.vehicle.web.model.RequestInfoWrapper;
import org.egov.vehicle.web.model.VehicleCustomResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1")
public class VehicleInboxController {

	@Autowired
    private VehicleInboxService vehicleInboxService;
	
	@Autowired
    private ResponseInfoFactory responseInfoFactory;
	
	@PostMapping(value = "/fetchApplicationStatusCount")
    public ResponseEntity<VehicleCustomResponse> fetchApplicationCount(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,@Valid @RequestBody VehicleSearchCriteria criteria) {

		List<Map<String, Object>> fsmApplicationList = vehicleInboxService.fetchStatusCount(criteria);
        
		VehicleCustomResponse response = VehicleCustomResponse.builder().applicationStatusCount(fsmApplicationList)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
		return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@PostMapping(value = "/searchTrip")
    public ResponseEntity<VehicleTripDetailResponse> fetchVehicleTripDetail(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,@Valid @RequestBody VehicleTripSearchCriteria criteria) {

		List<VehicleTripDetail> vehicleTripDetailList = vehicleInboxService.fetchTripDetails(criteria);
        
		VehicleTripDetailResponse response = VehicleTripDetailResponse.builder().vehicleTripDetail(vehicleTripDetailList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
}
