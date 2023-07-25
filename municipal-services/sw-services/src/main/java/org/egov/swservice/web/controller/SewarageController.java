package org.egov.swservice.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.swservice.service.SewerageEncryptionService;
import org.egov.swservice.web.models.RequestInfoWrapper;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.SewerageConnectionResponse;
import org.egov.swservice.service.SewerageService;
import org.egov.swservice.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@RestController
@RequestMapping("/swc")
public class SewarageController {

	@Autowired
    SewerageService sewarageService;

	@Autowired
	SewerageEncryptionService sewerageEncryptionService;

	@Autowired
	private final ResponseInfoFactory responseInfoFactory;

	@RequestMapping(value = "/_create", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<SewerageConnectionResponse> createWaterConnection(
			@Valid @RequestBody SewerageConnectionRequest sewerageConnectionRequest) {
		sewerageConnectionRequest.setCreateCall(true);
		List<SewerageConnection> sewerageConnection = sewarageService.createSewerageConnection(sewerageConnectionRequest);
		SewerageConnectionResponse response = SewerageConnectionResponse.builder().sewerageConnections(sewerageConnection)
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(sewerageConnectionRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@RequestMapping(value = "/_search", method = RequestMethod.POST)
	public ResponseEntity<SewerageConnectionResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute SearchCriteria criteria) {
		List<SewerageConnection> sewerageConnectionList = sewarageService.search(criteria,
				requestInfoWrapper.getRequestInfo());
		Integer count = sewarageService.countAllSewerageApplications(criteria,	requestInfoWrapper.getRequestInfo());
		SewerageConnectionResponse response = SewerageConnectionResponse.builder()
				.sewerageConnections(sewerageConnectionList).totalCount(count)
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@RequestMapping(value = "/_update", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<SewerageConnectionResponse> updateSewerageConnection(
			@Valid @RequestBody SewerageConnectionRequest sewerageConnectionRequest) {
		List<SewerageConnection> sewerageConnection = sewarageService.updateSewerageConnection(sewerageConnectionRequest);
		SewerageConnectionResponse response = SewerageConnectionResponse.builder().sewerageConnections(sewerageConnection)
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(sewerageConnectionRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
	
	@RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
	public ResponseEntity<SewerageConnectionResponse> plainSearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute SearchCriteria criteria) {
		List<SewerageConnection> sewerageConnectionList = sewarageService.plainSearch(criteria,
				requestInfoWrapper.getRequestInfo());

		SewerageConnectionResponse response = SewerageConnectionResponse.builder()
				.sewerageConnections(sewerageConnectionList).totalCount(sewerageConnectionList.size())
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}


	/**
	 * Encrypts existing Sewerage records
	 *
	 * @param requestInfoWrapper RequestInfoWrapper
	 * @param criteria SearchCriteria
	 * @return list of updated encrypted data
	 */
	/* To be executed only once */
	@RequestMapping(value = "/_encryptOldData", method = RequestMethod.POST)
	public ResponseEntity<SewerageConnectionResponse> encryptOldData(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
																  @Valid @ModelAttribute SearchCriteria criteria){
		SewerageConnectionResponse sewerageConnectionResponse = new SewerageConnectionResponse();
		List<SewerageConnection> sewerageConnectionList = sewerageEncryptionService.updateOldData(criteria, requestInfoWrapper.getRequestInfo());

		sewerageConnectionResponse.setSewerageConnections(sewerageConnectionList);
		sewerageConnectionResponse.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		return new ResponseEntity<>(sewerageConnectionResponse, HttpStatus.OK);
	}

}
