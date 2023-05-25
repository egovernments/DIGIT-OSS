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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.egov.boundary.domain.model.BoundarySearchRequest;
import org.egov.boundary.domain.service.BoundaryService;
import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.CrossHierarchyService;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.exception.CustomException;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.Boundary;
import org.egov.boundary.web.contract.BoundaryRequest;
import org.egov.boundary.web.contract.BoundaryResponse;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.HierarchyType;
import org.egov.boundary.web.contract.RequestInfoWrapper;
import org.egov.boundary.web.contract.ShapeFile;
import org.egov.boundary.web.contract.ShapeFileResponse;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.boundary.web.errorhandlers.Error;
import org.egov.boundary.web.errorhandlers.ErrorResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Validated
@RestController
@RequestMapping("/boundarys")
@Slf4j
public class BoundaryController {

	public static final Logger LOGGER = LoggerFactory.getLogger(BoundaryController.class);

	@Autowired
	private BoundaryService boundaryService;

	@Autowired
	private BoundaryTypeService boundaryTypeService;

	@Autowired
	private HierarchyTypeService hierarchyTypeService;

	@Autowired
	private CrossHierarchyService crossHierarchyService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	private static final String[] taskAction = { "create", "update" };

	@PostMapping
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody @Valid BoundaryRequest boundaryRequest, BindingResult errors) {
		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		RequestInfo requestInfo = boundaryRequest.getRequestInfo();
		final ErrorResponse errorResponses = validateBoundaryRequest(boundaryRequest, taskAction[0]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
		Boundary boundary = null;
		try {
			boundary = mapToContractBoundary(boundaryService.createBoundary(boundaryRequest.getBoundary()));
		} catch (CustomException e) {
			LOGGER.error("Exception Message: " + e);
			Error error = new Error();
			final ResponseInfo responseInfo = responseInfoFactory
					.createResponseInfoFromRequestInfo(boundaryRequest.getRequestInfo(), false);
			error.setCode(Integer.valueOf(e.getCode().toString()));
			error.setMessage(e.getCustomMessage());
			error.setDescription(e.getDescription());
			ErrorResponse errorResponse = new ErrorResponse();
			errorResponse.setError(error);
			errorResponse.setResponseInfo(responseInfo);
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		}
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getTenantId() != null
				&& !boundaryRequest.getBoundary().getTenantId().isEmpty()) {
			boundaryResponse.getBoundarys().add(boundary);
			final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{code}")
	@ResponseBody
	public ResponseEntity<?> update(@RequestBody @Valid BoundaryRequest boundaryRequest, BindingResult errors,
			@PathVariable @Size(max = 22) String code, @RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId) {

		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		boundaryRequest.getBoundary().setTenantId(tenantId);
		boundaryRequest.getBoundary().setCode(code);
		final ErrorResponse errorResponses = validateBoundaryRequest(boundaryRequest, taskAction[1]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		BoundaryResponse boundaryResponse = new BoundaryResponse();
		if (tenantId != null && !tenantId.isEmpty()) {
			RequestInfo requestInfo = boundaryRequest.getRequestInfo();
			Boundary contractBoundary = null;
			try {
				contractBoundary = mapToContractBoundary(boundaryService.updateBoundary(boundaryRequest.getBoundary()));
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(boundaryRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			boundaryResponse.getBoundarys().add(contractBoundary);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			boundaryResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.CREATED);
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<?> search(@Valid @RequestParam(value = "boundary", required = false) Long boundary,
			@RequestParam(value = "tenantId", required = false) @Size(max = 256) String tenantId,
			@ModelAttribute BoundaryRequest boundaryRequest, BindingResult errors) {
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		ResponseInfo responseInfo = new ResponseInfo();

		if (errors.hasErrors()) {
			log.info("BoundaryRequest binding error: " + boundaryRequest);
		}

		log.info("BoundaryRequest: " + boundaryRequest);

		if (tenantId != null && boundary != null) {
			org.egov.boundary.domain.model.Boundary boundaryObj = org.egov.boundary.domain.model.Boundary.builder()
					.build();
			boundaryObj.setTenantId(tenantId);
			boundaryObj.setId(boundary);
			boundaryRequest.setBoundary(boundaryObj);
		} else if (tenantId != null) {
			org.egov.boundary.domain.model.Boundary boundaryObj = org.egov.boundary.domain.model.Boundary.builder()
					.build();
			if(boundaryRequest.getBoundary().getLatitude()!=null && boundaryRequest.getBoundary().getLongitude()!=null){
				boundaryObj.setLatitude(boundaryRequest.getBoundary().getLatitude());
				boundaryObj.setLongitude(boundaryRequest.getBoundary().getLongitude());
			}
			boundaryObj.setTenantId(tenantId);
			boundaryRequest.setBoundary(boundaryObj);
		}

		if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getTenantId() != null
				&& !boundaryRequest.getBoundary().getTenantId().isEmpty()) {
			List<org.egov.boundary.domain.model.Boundary> boundaryList = boundaryService
					.getAllBoundary(boundaryRequest);
			List<Boundary> allBoundarys = new ArrayList<Boundary>();
			if (boundaryList != null && !boundaryList.isEmpty() && boundaryList.get(0) != null) {
				allBoundarys = mapToContractBoundaryList(boundaryList);
			}
			boundaryResponse.getBoundarys().addAll(allBoundarys);
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.OK);
		}
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		boundaryResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.BAD_REQUEST);
	}

	@GetMapping("/getLocationByLocationName")
	@ResponseBody
	public ResponseEntity<?> getLocation(@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId,
			@RequestParam("locationName") @Size(max = 512) final String locationName) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			if (tenantId != null && !tenantId.isEmpty()) {
				list = boundaryService.getBoundaryDataByTenantIdAndNameLike(tenantId, locationName);
			}
			return new ResponseEntity<List<Map<String, Object>>>(list, HttpStatus.OK);
		} catch (final Exception e) {
			log.error("Error while fetching location: " + e.getMessage());
			return new ResponseEntity<String>("error in request", HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/childLocationsByBoundaryId")
	@ResponseBody
	public ResponseEntity<?> getChildLocationsByBoundaryId(
			@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId,
			@RequestParam(value = "boundaryId", required = true) final String boundaryId) {
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		if (tenantId != null && !tenantId.isEmpty() && boundaryId != null && !boundaryId.isEmpty()) {
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
			List<Boundary> boundaries = getChildBoundaryByBoundaryIdAndTenantId(boundaryId, tenantId);
			boundaryResponse.setBoundarys(boundaries);
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.OK);
		} else
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.BAD_REQUEST);
	}

	@PostMapping(value = "/getByBoundaryType")
	@ResponseBody
	public ResponseEntity<?> getBoundaryByBoundaryTypeId(
			@RequestParam(value = "boundaryTypeId", required = true) final String boundaryTypeId,
			@RequestParam(value = "tenantId", required = true) @Size(max = 256) final String tenantId) {
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		if (boundaryTypeId != null && !boundaryTypeId.isEmpty()) {
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
			List<Boundary> boundaries = mapToContractBoundaryList(boundaryService
					.getAllBoundariesByBoundaryTypeIdAndTenantId(Long.valueOf(boundaryTypeId), tenantId));
			boundaryResponse.setBoundarys(boundaries);
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.OK);
		} else
			return new ResponseEntity<>(boundaryResponse, HttpStatus.BAD_REQUEST);
	}

	private List<Boundary> getChildBoundaryByBoundaryIdAndTenantId(String boundaryId, String tenantId) {
		List<org.egov.boundary.domain.model.Boundary> boundaryList = crossHierarchyService
				.getActiveChildBoundariesByBoundaryIdAndTenantId(Long.valueOf(boundaryId), tenantId);
		List<Boundary> boundaries = new ArrayList<Boundary>();
		if (boundaryList != null && !boundaryList.isEmpty()) {
			boundaries = mapToContractBoundaryList(boundaryList);
		}
		return boundaries;
	}

	private List<Boundary> mapToContractBoundaryList(List<org.egov.boundary.domain.model.Boundary> boundaryEntity) {
		return boundaryEntity.stream().map(Boundary::new).collect(Collectors.toList());
	}

	private Boundary mapToContractBoundary(org.egov.boundary.domain.model.Boundary boundaryEntity) {
		Boundary boundary = new Boundary();
		if (boundaryEntity != null) {
			boundary = new Boundary(boundaryEntity);
		}
		return boundary;
	}

	@PostMapping(value = "/boundariesByBndryTypeNameAndHierarchyTypeName")
	@ResponseBody
	public ResponseEntity<?> getBoundariesByBndryTypeNameAndHierarchyTypeName(
			@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId,
			@RequestParam(value = "boundaryTypeName", required = true) @Size(max = 64) final String boundaryTypeName,
			@RequestParam(value = "hierarchyTypeName", required = true) @Size(max = 128) final String hierarchyTypeName) {
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		if (tenantId != null && !tenantId.isEmpty() && boundaryTypeName != null && !boundaryTypeName.isEmpty()
				&& hierarchyTypeName != null && !hierarchyTypeName.isEmpty()) {
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
			List<org.egov.boundary.domain.model.Boundary> boundaryList = boundaryService
					.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId(boundaryTypeName, hierarchyTypeName,
							tenantId);
			boundaryResponse.setBoundarys(boundaryList.stream().map(Boundary::new).collect(Collectors.toList()));
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.OK);
		} else
			return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/isshapefileexist")
	@ResponseBody
	public ResponseEntity<?> isShapeFileExist(@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId,
			@RequestBody @Valid final RequestInfoWrapper requestInfoWrapper) {
		final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		boolean exist = false;
		try {
			if (tenantId != null && !tenantId.isEmpty()) {
				exist = boundaryService.checkTenantShapeFileExistOrNot(tenantId);
				return getSuccessResponse(requestInfo, exist);
			}
			return getFailureResponse(requestInfo);

		} catch (final Exception e) {
			LOGGER.error("Error while checking for shape file: " + e.getMessage());
			return new ResponseEntity<String>("error in request", HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/getshapefile")
	@ResponseBody
	public ResponseEntity<Resource> fetchShapeFileForTenant(@RequestParam(value = "tenantid", required = true, defaultValue = "default") @Size(max = 256) final String tenantId) throws IOException {

		Resource resource = boundaryService.fetchShapeFile(tenantId);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.header(HttpHeaders.CONTENT_TYPE, "text/plain").body(resource);
	}

	@PostMapping(value = "/_search")
	@ResponseBody
	public ResponseEntity<?> boundarySearch(@RequestParam(value = "tenantId", required = true) @Size(max = 256)String tenantId,
			@RequestParam(value = "boundaryIds", required = false) final List<Long> boundaryIds,
			@RequestParam(value = "boundaryNum", required = false) final List<Long> boundaryNum,
			@RequestParam(value = "boundaryType", required = false) @Size(max = 64) final String boundaryType,
			@RequestParam(value = "hierarchyType", required = false) @Size(max = 128)final String hierarchyType,
			@RequestParam(value = "codes", required = false) final List<String> codes) {
		BoundaryResponse boundaryResponse = new BoundaryResponse();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.OK.toString());
		boundaryResponse.setResponseInfo(responseInfo);
		List<Boundary> allBoundarys = null;
		List<Long> boundaryTypeIds = null;
		List<Long> hierarchyTypeIds = null;
		if (tenantId != null && !tenantId.isEmpty() && boundaryType != null && !boundaryType.isEmpty()) {
			boundaryTypeIds = getBoundaryTypeList(tenantId, boundaryType);
			if (!(boundaryTypeIds != null && !boundaryTypeIds.isEmpty())) {
				ErrorResponse errorResponses = addBoundaryTypeValidationError(boundaryResponse);
				return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
			}
		}
		if (tenantId != null && !tenantId.isEmpty() && hierarchyType != null && !hierarchyType.isEmpty()) {
			hierarchyTypeIds = getHierarchyTypeList(tenantId, hierarchyType);
			if (!(hierarchyTypeIds != null && !hierarchyTypeIds.isEmpty())) {
				ErrorResponse errorResponses = addHierarchyTypeValidationError(boundaryResponse);
				return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
			}
		}
		if (tenantId != null && !tenantId.isEmpty()) {
			BoundarySearchRequest boundarySearchRequest = BoundarySearchRequest.builder().tenantId(tenantId)
					.boundaryIds(boundaryIds).boundaryNumbers(boundaryNum).boundaryTypeIds(boundaryTypeIds)
					.hierarchyTypeName(hierarchyType).hierarchyTypeIds(hierarchyTypeIds).codes(codes).build();
			allBoundarys = mapToContractBoundaryList(
					boundaryService.getAllBoundariesByIdsAndTypeAndNumberAndCodeAndTenant(boundarySearchRequest));
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryResponse.setResponseInfo(responseInfo);
			return getBoundarySearchSuccessResponse(boundaryResponse, allBoundarys);
		}

		return new ResponseEntity<>(boundaryResponse, HttpStatus.BAD_REQUEST);
	}

	private ErrorResponse populateErrors(BindingResult errors) {
		ErrorResponse errRes = new ErrorResponse();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		responseInfo.setApiId("");
		errRes.setResponseInfo(responseInfo);
		Error error = new Error();
		error.setCode(1);
		error.setDescription("Error while binding request");
		if (errors.hasFieldErrors()) {
			for (final FieldError fieldError : errors.getFieldErrors())
				error.getFields().put(fieldError.getField(), fieldError.getRejectedValue());
		}
		errRes.setError(error);
		return errRes;
	}

	private ResponseEntity<?> getFailureResponse(final RequestInfo requestInfo) {
		final org.egov.common.contract.response.ErrorResponse errorResponse = new org.egov.common.contract.response.ErrorResponse();
		final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);
		errorResponse.setResponseInfo(responseInfo);
		final List<ErrorField> errorFields = new ArrayList<>();
		final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.TENANTID_MANDATORY_CODE)
				.message(BoundaryConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
				.field(BoundaryConstants.TENANTID_MANADATORY_FIELD_NAME).build();
		errorFields.add(errorField);
		org.egov.common.contract.response.Error error = new org.egov.common.contract.response.Error();
		error.setFields(errorFields);
		errorResponse.setError(error);
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

	}

	private ResponseEntity<?> getSuccessResponse(final RequestInfo requestInfo, final boolean fileExist) {
		ShapeFileResponse shapeFileExist = new ShapeFileResponse();
		final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		shapeFileExist.setResponseInfo(responseInfo);
		ShapeFile shapeFile = new ShapeFile();
		shapeFile.setFileExist(fileExist);
		shapeFileExist.setShapeFile(shapeFile);
		return new ResponseEntity<ShapeFileResponse>(shapeFileExist, HttpStatus.OK);
	}

	private ResponseEntity<?> getBoundarySearchSuccessResponse(BoundaryResponse boundaryResponse,
			List<Boundary> allBoundarys) {
		boundaryResponse.setBoundarys(allBoundarys);
		return new ResponseEntity<BoundaryResponse>(boundaryResponse, HttpStatus.OK);
	}

	private ErrorResponse addBoundaryTypeValidationError(BoundaryResponse boundaryResponse) {
		boundaryResponse.getResponseInfo().setStatus(HttpStatus.BAD_REQUEST.toString());
		final ErrorResponse errorResponse = new ErrorResponse();
		final List<ErrorField> errorFields = new ArrayList<>();
		final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_TYPE_INVALID_CODE)
				.message(BoundaryConstants.BOUNDARY_TYPE_INVALID_ERROR_MESSAGE)
				.field(BoundaryConstants.BOUNDARY_TYPE_INVALID_FIELD_NAME).build();
		final Error error = Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_BOUNDARY_REQUEST_MESSAGE).errorFields(errorFields).build();
		errorResponse.setError(error);
		errorFields.add(errorField);
		return errorResponse;
	}

	private ErrorResponse addHierarchyTypeValidationError(BoundaryResponse boundaryResponse) {
		boundaryResponse.getResponseInfo().setStatus(HttpStatus.BAD_REQUEST.toString());
		final ErrorResponse errorResponse = new ErrorResponse();
		final List<ErrorField> errorFields = new ArrayList<>();
		final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.HIERARCHY_TYPE_INVALID_CODE)
				.message(BoundaryConstants.HIERARCHY_TYPE_INVALID_ERROR_MESSAGE)
				.field(BoundaryConstants.HIERARCHY_TYPE_INVALID_FIELD_NAME).build();
		final Error error = Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_BOUNDARY_REQUEST_MESSAGE).errorFields(errorFields).build();
		errorResponse.setError(error);
		errorFields.add(errorField);
		return errorResponse;
	}

	private List<Long> getBoundaryTypeList(String tenantId, String boundaryType) {
		List<BoundaryType> boundaryTypeList = boundaryTypeService.getAllBoundarytypesByNameAndTenant(boundaryType,
				tenantId);
		List<String> list = null;
		List<Long> boundaryTypesList = null;
		if (boundaryTypeList != null && !boundaryTypeList.isEmpty())
			list = boundaryTypeList.stream().map(BoundaryType::getId).collect(Collectors.toList());
		if (list != null && !list.isEmpty())
			boundaryTypesList = list.stream().map(Long::parseLong).collect(Collectors.toList());

		return boundaryTypesList;
	}

	private List<Long> getHierarchyTypeList(String tenantId, String hierarchyType) {
		List<Long> list = new ArrayList<Long>();
		HierarchyType hierarhcy = hierarchyTypeService.getHierarchyTypeByNameAndTenantId(hierarchyType, tenantId);
		if (hierarhcy != null)
			list.add(Long.valueOf(hierarhcy.getId()));
		return list;
	}

	private ErrorResponse validateBoundaryRequest(final BoundaryRequest boundaryRequest, String action) {
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(boundaryRequest, action);
		errorResponse.setError(error);
		return errorResponse;
	}

	private Error getError(final BoundaryRequest boundaryRequest, String action) {
		final List<ErrorField> errorFields = getErrorFields(boundaryRequest, action);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_BOUNDARY_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final BoundaryRequest boundaryRequest, String action) {
		final List<ErrorField> errorFields = new ArrayList<>();
		addTenantIdValidationError(boundaryRequest, errorFields);
		addBoundaryNameNotNullValidationError(boundaryRequest, errorFields);
		addBoundaryCodeNotNullValidationError(boundaryRequest, errorFields, action);
		addBoundaryTypeNotNullValidationError(boundaryRequest, errorFields);
		addBoundaryNumberNotNullValidationError(boundaryRequest, errorFields);
		addBoundaryInvalidTypeIdValidationError(boundaryRequest, errorFields);
		addBoundaryParentInvalidError(boundaryRequest, errorFields);
		return errorFields;
	}

	private List<ErrorField> addTenantIdValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary().getTenantId() == null
				|| boundaryRequest.getBoundary().getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.TENANTID_MANDATORY_CODE)
					.message(BoundaryConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryNameNotNullValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary().getName() == null || boundaryRequest.getBoundary().getName().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_NAME_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARY_NAME_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARY_NAME_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryCodeNotNullValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields, String action) {

		if (boundaryRequest.getBoundary().getCode() == null || boundaryRequest.getBoundary().getCode().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_CODE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARY_CODE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARY_CODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (boundaryRequest.getBoundary().getCode() != null && !boundaryRequest.getBoundary().getCode().isEmpty()
				&& action.equals("create")) {
			if (boundaryService.findByTenantIdAndCode(boundaryRequest.getBoundary().getTenantId(),
					boundaryRequest.getBoundary().getCode()) != null) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARY_CODE_TENANT_UNIQUE_CODE)
						.message(BoundaryConstants.BOUNDARY_CODE_TENANT_UNIQUE_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARY_CODE_TENANT_UNIQUE_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}

		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeNotNullValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary().getBoundaryType() == null) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_TYPE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARY_TYPE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARY_TYPE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryNumberNotNullValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getBoundaryNum() == null) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_NUMBER__MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARY_NUMBER_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARY_NUMBER_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryInvalidTypeIdValidationError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getBoundaryType() != null
				&& boundaryRequest.getBoundary().getBoundaryType().getCode() != null) {

			if (boundaryTypeService.findByTenantIdAndCode(boundaryRequest.getBoundary().getTenantId(),
					boundaryRequest.getBoundary().getBoundaryType().getCode()) == null) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARY_TYPE_CODE_INVALID_CODE)
						.message(BoundaryConstants.BOUNDARY_TYPE_CODE_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARY_TYPE_CODE_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}

		} else if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getBoundaryType() != null
				&& boundaryRequest.getBoundary().getBoundaryType().getCode() == null) {

			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARY_TYPE_CODE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARY_TYPE_CODE_MANDATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARY_TYPE_CODE_MANDATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryParentInvalidError(final BoundaryRequest boundaryRequest,
			final List<ErrorField> errorFields) {
		if (boundaryRequest.getBoundary() != null && boundaryRequest.getBoundary().getParent() != null
				&& boundaryRequest.getBoundary().getParent().getCode() != null) {

			if (!(boundaryService.findByTenantIdAndCode(boundaryRequest.getBoundary().getTenantId(),
					boundaryRequest.getBoundary().getParent().getCode()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARY_PARENTYPE_CODE_INVALID_CODE)
						.message(BoundaryConstants.BOUNDARY_PARENTYPE_CODE_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARY_PARENTYPE_CODE_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}
}