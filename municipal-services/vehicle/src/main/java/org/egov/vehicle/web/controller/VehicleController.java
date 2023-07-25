package org.egov.vehicle.web.controller;


import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vehicle.service.VehicleService;
import org.egov.vehicle.util.ResponseInfoFactory;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.RequestInfoWrapper;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleUtil vehicleUtil;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @PostMapping(value = "/_create")
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest vehicleRequest) {

        vehicleUtil.defaultJsonPathConfig();
        Vehicle vehicle = vehicleService.create(vehicleRequest);
        List<Vehicle> vehicleList = new ArrayList<Vehicle>();
        vehicleList.add(vehicle);
        VehicleResponse response = VehicleResponse.builder().vehicle(vehicleList)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(vehicleRequest.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


	@PostMapping(value = "/_search")
	public ResponseEntity<VehicleResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute VehicleSearchCriteria criteria) {
		
		VehicleResponse response = vehicleService.search(criteria, requestInfoWrapper.getRequestInfo());
		
		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
	public ResponseEntity<VehicleResponse> plainsearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute VehicleSearchCriteria criteria) {
		List<Vehicle> vehicleList = vehicleService.vehiclePlainSearch(criteria,requestInfoWrapper.getRequestInfo());
		VehicleResponse response = VehicleResponse.builder().vehicle(vehicleList)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
