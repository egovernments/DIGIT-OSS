package org.egov.demand.web.controller;

import javax.validation.Valid;

import org.egov.common.contract.response.ErrorResponse;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.factory.ResponseFactory;
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

@RestController
@RequestMapping("bill")
@Deprecated
public class BillController {
	
	@Autowired
	private ResponseFactory responseFactory;
	
	@PostMapping("_search")
	@ResponseBody
	public ResponseEntity<?> search(@RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid final BillSearchCriteria billCriteria,
			final BindingResult bindingResult) {
		
			final ErrorResponse errorResponse = responseFactory.getErrorResponse( requestInfoWrapper.getRequestInfo());
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		
	}

	
	@PostMapping("_generate")
	@ResponseBody
	public ResponseEntity<?> genrateBill(@RequestBody RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid GenerateBillCriteria generateBillCriteria) {


		final ErrorResponse errorResponse = responseFactory.getErrorResponse(requestInfoWrapper.getRequestInfo());
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@PostMapping("_fetchbill")
	@ResponseBody
	public ResponseEntity<?> fetchBill(@RequestBody RequestInfoWrapper requestInfoWrapper, 
			@ModelAttribute @Valid GenerateBillCriteria generateBillCriteria){
		
		final ErrorResponse errorResponse = responseFactory.getErrorResponse(requestInfoWrapper.getRequestInfo());
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}
	
	@Deprecated
	@PostMapping("_create")
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody BillRequest billRequest, BindingResult bindingResult){

		final ErrorResponse errorResponse = responseFactory.getErrorResponse(billRequest.getRequestInfo());
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

	}
}
