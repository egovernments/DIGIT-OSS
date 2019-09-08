package org.egov.demand.web.controller;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.TaxHeadMasterValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/taxheads")
public class TaxHeadMasterController {

	@Autowired
	private TaxHeadMasterService taxHeadMasterService;

	@Autowired
	private TaxHeadMasterValidator taxHeadMasterValidator;

	@Autowired
	private ResponseFactory responseFactory;

	@PostMapping("_search")
	@ResponseBody
	public ResponseEntity<?> search(@RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid final TaxHeadMasterCriteria taxHeadMasterCriteria,
			final BindingResult bindingResult) {
		
		log.info("taxHeadMasterCriteria::" + taxHeadMasterCriteria + "requestInfoWrapper::" + requestInfoWrapper);
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		if (bindingResult.hasErrors()) {
			final ErrorResponse errorResponse = responseFactory.getErrorResponse(bindingResult, requestInfo);
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		}
		final TaxHeadMasterResponse taxHeadMasterResponse = taxHeadMasterService.getTaxHeads(taxHeadMasterCriteria,
				requestInfoWrapper.getRequestInfo());
		return new ResponseEntity<>(taxHeadMasterResponse, HttpStatus.OK);
	}

	@PostMapping("_create")
	@ResponseBody
	@Deprecated
	public ResponseEntity<?> create(@RequestBody @Valid final TaxHeadMasterRequest taxHeadMasterRequest,
			final BindingResult bindingResult) {
		RequestInfo requestInfo = taxHeadMasterRequest.getRequestInfo();
		System.out.println("inside controller tax head master create");
		log.info("create tax Head Master:" + taxHeadMasterRequest);
		if (bindingResult.hasErrors()) {
			final ErrorResponse errorResponse = responseFactory.getErrorResponse(bindingResult, requestInfo);
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		}
		taxHeadMasterValidator.validate(taxHeadMasterRequest,bindingResult);
		if (bindingResult.hasErrors()) {
			return new ResponseEntity<>(responseFactory.getErrorResponse(bindingResult, requestInfo), HttpStatus.BAD_REQUEST);
		}
		final TaxHeadMasterResponse taxHeadMasterRponse = taxHeadMasterService.createAsync(taxHeadMasterRequest);
		return new ResponseEntity<>(taxHeadMasterRponse, HttpStatus.CREATED);
	}

	@PostMapping("_update")
	@ResponseBody
	@Deprecated
	public ResponseEntity<?> update(@RequestBody @Valid final TaxHeadMasterRequest taxHeadMasterRequest,
			final BindingResult bindingResult) {
		RequestInfo requestInfo = taxHeadMasterRequest.getRequestInfo();
		log.info("update tax Head Master:" + taxHeadMasterRequest);
		if (bindingResult.hasErrors()) {
			final ErrorResponse errorResponse = responseFactory.getErrorResponse(bindingResult, requestInfo);
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		}
		final TaxHeadMasterResponse taxHeadMasterRponse = taxHeadMasterService.updateAsync(taxHeadMasterRequest);
		return new ResponseEntity<>(taxHeadMasterRponse, HttpStatus.OK);
	}
}