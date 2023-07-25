package org.egov.fsm.calculator.web.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.calculator.services.BillingSlabService;
import org.egov.fsm.calculator.utils.BillingSlabUtil;
import org.egov.fsm.calculator.utils.ResponseInfoFactory;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlabRequest;
import org.egov.fsm.calculator.web.models.BillingSlabResponse;
import org.egov.fsm.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.fsm.calculator.web.models.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/v1/billingSlab")
@Slf4j
public class BillingSlabController {
	
	@Autowired
	private BillingSlabUtil billigSlabUtil;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private BillingSlabService billingSlabService;
	
	@PostMapping(value = "/_create")
	public ResponseEntity<BillingSlabResponse> create(@Valid @RequestBody BillingSlabRequest billingSlabRequest) {
		
		billigSlabUtil.defaultJsonPathConfig();
		BillingSlab billingSlab = billingSlabService.create(billingSlabRequest);
		List<BillingSlab> billingSlabList = new ArrayList<BillingSlab>();
		billingSlabList.add(billingSlab);
		BillingSlabResponse response = BillingSlabResponse.builder().billingSlab(billingSlabList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(billingSlabRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	@PostMapping(value = "/_update")
	public ResponseEntity<BillingSlabResponse> update(@Valid @RequestBody BillingSlabRequest billingSlabRequest) {
		
		billigSlabUtil.defaultJsonPathConfig();
		BillingSlab billingSlab = billingSlabService.update(billingSlabRequest);
		List<BillingSlab> billingSlabList = new ArrayList<BillingSlab>();
		billingSlabList.add(billingSlab);
		BillingSlabResponse response = BillingSlabResponse.builder().billingSlab(billingSlabList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(billingSlabRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_search")
	public ResponseEntity<BillingSlabResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute BillingSlabSearchCriteria criteria) {
		
		List<BillingSlab> billingSlabList  =  billingSlabService.search(criteria, requestInfoWrapper.getRequestInfo());
		
		BillingSlabResponse response = BillingSlabResponse.builder().billingSlab(billingSlabList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
