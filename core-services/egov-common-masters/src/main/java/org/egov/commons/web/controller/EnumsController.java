/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.commons.web.controller;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.enums.BloodGroup;
import org.egov.commons.model.enums.Gender;
import org.egov.commons.model.enums.MaritalStatus;
import org.egov.commons.model.enums.Relationship;
import org.egov.commons.web.contract.*;
import org.egov.commons.web.contract.factory.ResponseInfoFactory;
import org.egov.commons.web.validator.RequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
public class EnumsController {

	private static final Logger LOGGER = LoggerFactory.getLogger(EnumsController.class);

	@Autowired
	private RequestValidator requestValidator;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	/**
	 * Maps Post Requests for _search & returns ResponseEntity of either
	 * BloodGroupResponse type or ErrorResponse type
	 * 
	 * @param requestInfoWrapper
	 * @param bindingResult
	 * @return ResponseEntity<?>
	 */
	@PostMapping("/bloodgroups/_search")
	@ResponseBody
	public ResponseEntity<?> searchBloodGroup(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
			BindingResult bindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		ResponseEntity<?> errorResponseEntity = requestValidator.validateSearchRequest(requestInfo, null,
				bindingResult);

		if (errorResponseEntity != null)
			return errorResponseEntity;

		// Call service
		List<Map<String, String>> bloodGroups = BloodGroup.getBloodGroups();
		LOGGER.debug("BloodGroups : " + bloodGroups);

		return getSuccessResponseForSearchBloodGroup(bloodGroups, requestInfo);
	}

	/**
	 * Maps Post Requests for _search & returns ResponseEntity of either
	 * MaritalStatusResponse type or ErrorResponse type
	 *
	 * @param requestInfoWrapper
	 * @param bindingResult
	 * @return ResponseEntity<?>
	 */
	@PostMapping("/maritalstatuses/_search")
	@ResponseBody
	public ResponseEntity<?> searchMaritalStatus(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
												 BindingResult bindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		ResponseEntity<?> errorResponseEntity = requestValidator.validateSearchRequest(requestInfo, null,
				bindingResult);

		if (errorResponseEntity != null)
			return errorResponseEntity;

		// Call service
		List<String> maritalStatuses = MaritalStatus.getAllObjectValues();

		LOGGER.debug("maritalStatuses : " + maritalStatuses);

		return getSuccessResponseForSearchMaritalStatus(maritalStatuses, requestInfo);
	}

	/**
	 * Maps Post Requests for _search & returns ResponseEntity of either
	 * MaritalStatusResponse type or ErrorResponse type
	 *
	 * @param requestInfoWrapper
	 * @param bindingResult
	 * @return ResponseEntity<?>
	 */
	@PostMapping("/relationships/_search")
	@ResponseBody
	public ResponseEntity<?> searchRelationship(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
												 BindingResult bindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		ResponseEntity<?> errorResponseEntity = requestValidator.validateSearchRequest(requestInfo, null,
				bindingResult);

		if (errorResponseEntity != null)
			return errorResponseEntity;

		// Call service
		List<String> relationships = Relationship.getAllObjectValues();

		LOGGER.debug("relationships : " + relationships);

		return getSuccessResponseForSearchRelationships(relationships, requestInfo);
	}

	/**
	 * Maps Post Requests for _search & returns ResponseEntity of either
	 * MaritalStatusResponse type or ErrorResponse type
	 *
	 * @param requestInfoWrapper
	 * @param bindingResult
	 * @return ResponseEntity<?>
	 */
	@PostMapping("/genders/_search")
	@ResponseBody
	public ResponseEntity<?> searchGenders(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
												 BindingResult bindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		ResponseEntity<?> errorResponseEntity = requestValidator.validateSearchRequest(requestInfo, null,
				bindingResult);

		if (errorResponseEntity != null)
			return errorResponseEntity;

		// Call service
		List<String> genders = Gender.getAllObjectValues();

		LOGGER.debug("genders : " + genders);

		return getSuccessResponseForSearchGenders(genders, requestInfo);
	}

	/**
	 * Populate BloodGroupResponse object & returns ResponseEntity of type
	 * BloodGroupResponse containing ResponseInfo & List of BloodGroup
	 *
	 * @param bloodGroups
	 * @param requestInfo
	 * @return ResponseEntity<?>
	 */
	private ResponseEntity<?> getSuccessResponseForSearchBloodGroup(List<Map<String, String>> bloodGroups,
			RequestInfo requestInfo) {
		BloodGroupResponse bloodGroupResponse = new BloodGroupResponse();
		bloodGroupResponse.setBloodGroup(bloodGroups);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		bloodGroupResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<BloodGroupResponse>(bloodGroupResponse, HttpStatus.OK);
	}

	/**
	 * Populate MaritalStatusResponse object & returns ResponseEntity of type
	 * MaritalStatusResponse containing ResponseInfo & List of MaritalStatus
	 *
	 * @param maritalStatuses
	 * @param requestInfo
	 * @return ResponseEntity<?>
	 */
	private ResponseEntity<?> getSuccessResponseForSearchMaritalStatus(List<String> maritalStatuses,
			RequestInfo requestInfo) {
		MaritalStatusResponse maritalStatusResponse = new MaritalStatusResponse();
		maritalStatusResponse.setMaritalStatus(maritalStatuses);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		maritalStatusResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<MaritalStatusResponse>(maritalStatusResponse, HttpStatus.OK);
	}

	/**
	 * Populate MaritalStatusResponse object & returns ResponseEntity of type
	 * MaritalStatusResponse containing ResponseInfo & List of MaritalStatus
	 *
	 * @param genders
	 * @param requestInfo
	 * @return ResponseEntity<?>
	 */
	private ResponseEntity<?> getSuccessResponseForSearchGenders(List<String> genders,
			RequestInfo requestInfo) {
		GenderResponse genderResponse = new GenderResponse();
		genderResponse.setGender(genders);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		genderResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<GenderResponse>(genderResponse, HttpStatus.OK);
	}

	/**
	 * Populate MaritalStatusResponse object & returns ResponseEntity of type
	 * MaritalStatusResponse containing ResponseInfo & List of MaritalStatus
	 *
	 * @param relationships
	 * @param requestInfo
	 * @return ResponseEntity<?>
	 */
	private ResponseEntity<?> getSuccessResponseForSearchRelationships(List<String> relationships,
			RequestInfo requestInfo) {
		RelationshipResponse relationshipResponse = new RelationshipResponse();
		relationshipResponse.setRelationship(relationships);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		relationshipResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<RelationshipResponse>(relationshipResponse, HttpStatus.OK);
	}
}