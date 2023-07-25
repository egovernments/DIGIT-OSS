package org.egov.fsm.plantmapping.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.plantmapping.service.PlantMappingService;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.plantmapping.web.model.PlantMappingResponse;
import org.egov.fsm.plantmapping.web.model.PlantMappingSearchCriteria;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.util.ResponseInfoFactory;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/plantmap/v1")
public class PlantMappingController {

	@Autowired
	private PlantMappingService plantMappingService; 
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory; 
	
	@Autowired
	private FSMUtil util;

	@PostMapping(value = "/_create")
	public ResponseEntity<PlantMappingResponse> create(@Valid @RequestBody PlantMappingRequest request) {
		
		util.defaultJsonPathConfig();
		PlantMapping plantMap = plantMappingService.create(request);
		List<PlantMapping> plantList = new ArrayList<PlantMapping>();
		plantList.add(plantMap);
		PlantMappingResponse response = PlantMappingResponse.builder().plantMapping(plantList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_update")
	public ResponseEntity<PlantMappingResponse> update(@Valid @RequestBody PlantMappingRequest request) {
		
		util.defaultJsonPathConfig();
		PlantMapping plantMap = plantMappingService.update(request);
		List<PlantMapping> plantList = new ArrayList<PlantMapping>();
		plantList.add(plantMap);
		PlantMappingResponse response = PlantMappingResponse.builder().plantMapping(plantList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(request.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_search")
	public ResponseEntity<PlantMappingResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute PlantMappingSearchCriteria criteria) {
		
		PlantMappingResponse response= plantMappingService.search(criteria, requestInfoWrapper.getRequestInfo());
		
		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
}