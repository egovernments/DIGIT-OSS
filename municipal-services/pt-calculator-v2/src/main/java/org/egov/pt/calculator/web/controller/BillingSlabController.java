package org.egov.pt.calculator.web.controller;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.service.BillingSlabService;
import org.egov.pt.calculator.service.MutationBillingSlabService;
import org.egov.pt.calculator.validator.BillingSlabValidator;
import org.egov.pt.calculator.validator.MutationBillingSlabValidator;
import org.egov.pt.calculator.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/billingslab")
@Slf4j
public class BillingSlabController {
	
	
	@Autowired
	private BillingSlabService service;

	@Autowired
	private MutationBillingSlabService mutationService;
	
	@Autowired
	private BillingSlabValidator billingSlabValidator;

	@Autowired
	private MutationBillingSlabValidator mutationbillingSlabValidator;
	

	/**
	 * endpoint to create billing-slabs
	 * 
	 * @param billingSlabReq
	 * @author vishal
	 */
	@PostMapping("_create")
	@ResponseBody
	private ResponseEntity<?> create(@RequestBody @Valid BillingSlabReq billingSlabReq) {

		long startTime = System.currentTimeMillis();
		billingSlabValidator.validateCreate(billingSlabReq);
		BillingSlabRes billingSlabRes = service.createBillingSlab(billingSlabReq);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.CREATED);
	}
	
	/**
	 * enpoint to update billing-slabs
	 * 
	 * @param billingSlabReq
	 * @author vishal
	 */
	@PostMapping("_update")
	@ResponseBody
	private ResponseEntity<?> update(@RequestBody @Valid BillingSlabReq billingSlabReq) {

		long startTime = System.currentTimeMillis();
		billingSlabValidator.validateUpdate(billingSlabReq);
		BillingSlabRes billingSlabRes = service.updateBillingSlab(billingSlabReq);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.CREATED);
	}
	
	/**
	 * enpoint to search billing-slabs
	 * 
	 * @param requestInfo
	 * @param billingSlabSearcCriteria
	 * @author vishal
	 */
	@PostMapping("_search")
	@ResponseBody
	private ResponseEntity<?> search(@RequestBody @Valid RequestInfo requestInfo, 
					@ModelAttribute @Valid BillingSlabSearchCriteria billingSlabSearcCriteria) {
		long startTime = System.currentTimeMillis();
		BillingSlabRes billingSlabRes = service.searchBillingSlabs(requestInfo, billingSlabSearcCriteria);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.OK);
	}

	/**
	 * endpoint to create mutation billing-slabs
	 *
	 * @param mutationbillingSlabReq
	 */
	@PostMapping("/mutation/_create")
	@ResponseBody
	private ResponseEntity<?> mutationCreate(@RequestBody @Valid MutationBillingSlabReq mutationbillingSlabReq) {

		long startTime = System.currentTimeMillis();
		mutationbillingSlabValidator.validateCreate(mutationbillingSlabReq);
		MutationBillingSlabRes billingSlabRes = mutationService.createBillingSlab(mutationbillingSlabReq);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.CREATED);
	}

	/**
	 * enpoint to update mutation billing-slabs
	 *
	 * @param billingSlabReq
	 */
	@PostMapping("/mutation/_update")
	@ResponseBody
	private ResponseEntity<?> updateMutation(@RequestBody @Valid MutationBillingSlabReq billingSlabReq) {

		long startTime = System.currentTimeMillis();
		mutationbillingSlabValidator.validateUpdate(billingSlabReq);
		MutationBillingSlabRes billingSlabRes = mutationService.updateBillingSlab(billingSlabReq);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.CREATED);
	}

	/**
	 * enpoint to search mutation billing-slabs
	 *
	 * @param requestInfo
	 * @param billingSlabSearcCriteria
	 */
	@PostMapping("/mutation/_search")
	@ResponseBody
	private ResponseEntity<?> searchMutation(@RequestBody @Valid RequestInfo requestInfo,
									 @ModelAttribute @Valid MutationBillingSlabSearchCriteria billingSlabSearcCriteria) {
		long startTime = System.currentTimeMillis();
		MutationBillingSlabRes billingSlabRes = mutationService.searchBillingSlabs(requestInfo, billingSlabSearcCriteria);
		long endTime = System.currentTimeMillis();
		log.debug(" the time taken for create in ms: {}", endTime - startTime);
		return new ResponseEntity<>(billingSlabRes, HttpStatus.OK);
	}

}
