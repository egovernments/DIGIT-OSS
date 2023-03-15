package org.egov.fsm.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.service.FSMService;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.util.ResponseInfoFactory;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMAudit;
import org.egov.fsm.web.model.FSMAuditResponse;
import org.egov.fsm.web.model.FSMAuditSearchCriteria;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMResponse;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.PeriodicApplicationRequest;
import org.egov.fsm.web.model.PeriodicApplicationResponse;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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


	@PostMapping(value = "/_create")
	public ResponseEntity<FSMResponse> create(@Valid @RequestBody FSMRequest fsmRequest) {

		fsmUtil.defaultJsonPathConfig();
		FSM fsm = fsmService.create(fsmRequest);
		List<FSM> fsmList = new ArrayList<>();
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
		List<FSM> fsmList = new ArrayList<>();
		fsmList.add(fsm);
		FSMResponse response = FSMResponse.builder().fsm(fsmList)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(fsmRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(value = "/_search")
	public ResponseEntity<FSMResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute FSMSearchCriteria criteria) {

		FSMResponse response = fsmService.fsmSearch(criteria, requestInfoWrapper.getRequestInfo());

		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	

	@PostMapping(value = "/_audit")
	public ResponseEntity<FSMAuditResponse> audit(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute FSMAuditSearchCriteria criteria) {

		List<FSMAudit> fsmAuditList = fsmService.auditSearch(criteria);
		FSMAuditResponse response = FSMAuditResponse.builder().fsmAuditList(fsmAuditList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PostMapping(value = "/_plainsearch")
	public ResponseEntity<FSMResponse> plainsearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute FSMSearchCriteria criteria) {
		List<FSM> fsmList = fsmService.searchFSMPlainSearch(criteria, requestInfoWrapper.getRequestInfo());
		FSMResponse response = FSMResponse.builder().fsm(fsmList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(value = "/_getapplicationsforperiodic")
	public ResponseEntity<PeriodicApplicationResponse> getFSMApplicationsForPeriodicServices(
			@Valid @RequestBody RequestInfoWrapper requestInfoWrapper, @RequestParam String tenantId) {

		List<String> applicationList = fsmService.getFSMApplicationsForPeriodicServices(tenantId,
				requestInfoWrapper.getRequestInfo());

		PeriodicApplicationResponse response = PeriodicApplicationResponse.builder().applicationNoList(applicationList)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(),
						true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(value = "/_schedular")
	public void schedulePeriodicApplications(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper) {

		fsmService.scheduleperiodicapplications(requestInfoWrapper.getRequestInfo());

	}

	@PostMapping(value = "/_createperiodicapplications")
	public ResponseEntity<PeriodicApplicationResponse> createPeriodicApplications(
			@RequestBody PeriodicApplicationRequest periodicApplicationRequest) {

		List<String> applicationnoList = fsmService.createperiodicapplications(periodicApplicationRequest);

		PeriodicApplicationResponse response = PeriodicApplicationResponse.builder()
				.applicationNoList(applicationnoList).responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(periodicApplicationRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

}
