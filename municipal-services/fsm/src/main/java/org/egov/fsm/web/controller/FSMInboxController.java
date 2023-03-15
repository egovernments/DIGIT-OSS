package org.egov.fsm.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.service.FSMInboxService;
import org.egov.fsm.util.ResponseInfoFactory;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.VehicleCustomResponse;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1")
public class FSMInboxController {

	@Autowired
	private FSMInboxService fsmInboxService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping(value = "/fetchApplicationIds")
    public ResponseEntity<VehicleCustomResponse> fetchApplicationIds(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,@Valid @RequestBody VehicleTripSearchCriteria criteria) {

		List<String> fsmApplicationIdList = fsmInboxService.fetchApplicationIds(criteria);

		VehicleCustomResponse response = VehicleCustomResponse.builder().applicationIdList(fsmApplicationIdList)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
		return new ResponseEntity<>(response, HttpStatus.OK);
    }


}