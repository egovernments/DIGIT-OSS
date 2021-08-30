package org.egov.demand.web.controller;

import javax.validation.Valid;

import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
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

	@PostMapping("_search")
	@ResponseBody
	public ResponseEntity<?> search(@RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid final TaxHeadMasterCriteria taxHeadMasterCriteria,
			final BindingResult bindingResult) {
		
		log.info("taxHeadMasterCriteria::" + taxHeadMasterCriteria + "requestInfoWrapper::" + requestInfoWrapper);

		final TaxHeadMasterResponse taxHeadMasterResponse = taxHeadMasterService.getTaxHeads(taxHeadMasterCriteria,
				requestInfoWrapper.getRequestInfo());
		return new ResponseEntity<>(taxHeadMasterResponse, HttpStatus.OK);
	}
	
}