package org.egov.fsm.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.service.FSMService;
import org.egov.fsm.service.UserService;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.util.ResponseInfoFactory;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMAudit;
import org.egov.fsm.web.model.FSMAuditResponse;
import org.egov.fsm.web.model.FSMAuditSearchCriteria;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMResponse;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Home redirection to swagger api documentation 
 */
@RestController
@RequestMapping("/v1")
public class FSMController {
	@Autowired
	private FSMService fsmService;

	@Autowired
	private FSMUtil fsmUtil;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Autowired
	private UserService userService;

	@PostMapping(value = "/_create")
	public ResponseEntity<FSMResponse> create(@Valid @RequestBody FSMRequest fsmRequest) {
		
		fsmUtil.defaultJsonPathConfig();
		FSM fsm = fsmService.create(fsmRequest);
		List<FSM> fsmList = new ArrayList<FSM>();
		fsmList.add(fsm);
		FSMResponse response = FSMResponse.builder().fsm(fsmList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(fsmRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_update")
	public ResponseEntity<FSMResponse> update(@Valid @RequestBody FSMRequest fsmRequest) {
		
		fsmUtil.defaultJsonPathConfig();
		FSM fsm = fsmService.update(fsmRequest);
		List<FSM> fsmList = new ArrayList<FSM>();
		fsmList.add(fsm);
		FSMResponse response = FSMResponse.builder().fsm(fsmList)				
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(fsmRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_search")
	public ResponseEntity<FSMResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute FSMSearchCriteria criteria) {
		
		FSMResponse response= fsmService.FSMsearch(criteria, requestInfoWrapper.getRequestInfo());
		
		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "/_audit")
	public ResponseEntity<FSMAuditResponse> audit(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute FSMAuditSearchCriteria criteria) {
		
		List<FSMAudit> fsmAuditList = fsmService.auditSearch(criteria, requestInfoWrapper.getRequestInfo());
		FSMAuditResponse response = FSMAuditResponse.builder().fsmAuditList(fsmAuditList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
		
	}
	
}
