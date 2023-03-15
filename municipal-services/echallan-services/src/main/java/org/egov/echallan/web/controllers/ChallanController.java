package org.egov.echallan.web.controllers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.model.ChallanResponse;
import org.egov.echallan.model.RequestInfoWrapper;
import org.egov.echallan.model.SearchCriteria;
import org.egov.echallan.service.ChallanService;
import org.egov.echallan.util.ResponseInfoFactory;
import org.egov.echallan.producer.Producer;
import org.egov.echallan.util.ChallanConstants;
import org.egov.echallan.web.models.collection.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("eChallan/v1")
public class ChallanController {

	@Autowired
	private ChallanService challanService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	private Producer producer;

	@PostMapping("/_create")
	public ResponseEntity<ChallanResponse> create(@Valid @RequestBody ChallanRequest challanRequest) {

		Challan challan = challanService.create(challanRequest);
		ResponseInfo resInfo = responseInfoFactory.createResponseInfoFromRequestInfo(challanRequest.getRequestInfo(), true);
		ChallanResponse response = ChallanResponse.builder().challans(Arrays.asList(challan))
				.responseInfo(resInfo)
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	 @RequestMapping(value = "/_search", method = RequestMethod.POST)
	 public ResponseEntity<ChallanResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
	                                                       @Valid @ModelAttribute SearchCriteria criteria) {
		 String tenantId = criteria.getTenantId();
	     List<Challan> challans = challanService.search(criteria, requestInfoWrapper.getRequestInfo());
	    	 
	     
	     Map<String,Integer> dynamicData = challanService.getDynamicData(tenantId);
	    	 
	     int countOfServices = dynamicData.get(ChallanConstants.TOTAL_SERVICES);
	     int totalAmountCollected = dynamicData.get(ChallanConstants.TOTAL_COLLECTION);
	     int validity = challanService.getChallanValidity();
	     int totalCount = challanService.countForSearch(criteria,requestInfoWrapper.getRequestInfo());

	     ChallanResponse response = ChallanResponse.builder().challans(challans).countOfServices(countOfServices)
				 .totalAmountCollected(totalAmountCollected).validity(validity).totalCount(totalCount)
				 .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				 .build();
	     return new ResponseEntity<>(response, HttpStatus.OK);
	}

	 @PostMapping("/_update")
	 public ResponseEntity<ChallanResponse> update(@Valid @RequestBody ChallanRequest challanRequest) {
		Challan challan = challanService.update(challanRequest);
		ResponseInfo resInfo = responseInfoFactory.createResponseInfoFromRequestInfo(challanRequest.getRequestInfo(), true);
		ChallanResponse response = ChallanResponse.builder().challans(Arrays.asList(challan))
				.responseInfo(resInfo)
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
		}

	@PostMapping("/_count")
	private ResponseEntity<?> count(@RequestParam("tenantId") String tenantId, @RequestBody RequestInfo requestInfo) {

		Map<String,Object> response = new HashMap<>();
		response = challanService.getChallanCountResponse(requestInfo,tenantId);
		return new ResponseEntity<>(response,HttpStatus.OK);
	}

	@PostMapping("/_test")
	public ResponseEntity test( @RequestBody ChallanRequest challanRequest){
		producer.push("update-challan",challanRequest);
		return new ResponseEntity(HttpStatus.OK);
	}
}
