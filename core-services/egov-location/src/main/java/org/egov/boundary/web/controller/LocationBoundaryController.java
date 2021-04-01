/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.web.controller;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.egov.boundary.domain.model.BoundarySearchRequest;
import org.egov.boundary.domain.service.BoundaryService;
import org.egov.boundary.web.contract.BoundaryMdmsResponse;
import org.egov.boundary.web.contract.MdmsTenantBoundary;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location/v11")
public class LocationBoundaryController {

	public static final Logger LOGGER = LoggerFactory.getLogger(LocationBoundaryController.class);

	@Autowired
	private BoundaryService boundaryService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping(value = "/boundarys/_search")
	@ResponseBody
	public ResponseEntity<?> boundarySearch(@RequestParam(value = "tenantId", required = true) String tenantId,
			@RequestParam(value = "hierarchyTypeCode", required = false) final String hierarchyType,
			@RequestParam(value = "codes", required = false) final List<String> codes,
			@RequestParam(value = "boundaryType", required = false) final String boundaryType,
			@RequestBody @Valid RequestInfo requestInfo) {
		Long startTime;
		Long endTime;
		startTime = new Date().getTime();
		BoundaryMdmsResponse boundaryResponse = new BoundaryMdmsResponse();
		ResponseInfo responseInfo = getResponseInfo(requestInfo);
		boundaryResponse.setResponseInfo(responseInfo);
		List<MdmsTenantBoundary> allBoundarys = null;

		BoundarySearchRequest boundarySearchRequest = BoundarySearchRequest.builder().tenantId(tenantId)
				.hierarchyTypeName(hierarchyType).boundaryTypeName(boundaryType).codes(codes).build();
		allBoundarys = boundaryService.getBoundariesByTenantAndHierarchyType(boundarySearchRequest, requestInfo);
		responseInfo.setStatus(HttpStatus.OK.toString());
		boundaryResponse.setResponseInfo(responseInfo);
		ResponseEntity<?>  response= getBoundarySearchSuccessResponse(boundaryResponse, allBoundarys);
		endTime = new Date().getTime();
		LOGGER.info("ToTAL Time Taken In Controller To fetch Boundaries = " +(endTime - startTime)+"ms");
		return response;

	}

	private ResponseEntity<?> getBoundarySearchSuccessResponse(BoundaryMdmsResponse boundaryResponse,
			List<MdmsTenantBoundary> allBoundarys) {
		boundaryResponse.setBoundarys(allBoundarys);
		return new ResponseEntity<BoundaryMdmsResponse>(boundaryResponse, HttpStatus.OK);
	}

	public ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		return responseInfo;
	}
}