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

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.exception.CustomException;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.HierarchyType;
import org.egov.boundary.web.contract.HierarchyTypeRequest;
import org.egov.boundary.web.contract.HierarchyTypeResponse;
import org.egov.boundary.web.contract.HierarchyTypeSearchRequest;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.boundary.web.errorhandlers.Error;
import org.egov.boundary.web.errorhandlers.ErrorResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

@Validated
@RestController
@RequestMapping("/hierarchytypes")
public class HierarchyTypeController {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(HierarchyTypeController.class);
	
	@Autowired
	private HierarchyTypeService hierarchyTypeService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	private static final String[] taskAction = { "create", "update" };

	@PostMapping
	@ResponseBody
	public ResponseEntity<?> create(@Valid @RequestBody HierarchyTypeRequest hierarchyTypeRequest,
			BindingResult errors) {

		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		final ErrorResponse errorResponses = validateHierarchyTypeRequest(hierarchyTypeRequest, taskAction[0]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
		HierarchyTypeResponse hierarchyTypeResponse = new HierarchyTypeResponse();
		if (hierarchyTypeRequest.getHierarchyType() != null
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {
			RequestInfo requestInfo = hierarchyTypeRequest.getRequestInfo();
			HierarchyType hierarchyType = null;
			try {
				hierarchyType = hierarchyTypeService
						.createHierarchyType(hierarchyTypeRequest.getHierarchyType());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(hierarchyTypeRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			hierarchyTypeResponse.getHierarchyTypes().add(hierarchyType);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			hierarchyTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<HierarchyTypeResponse>(hierarchyTypeResponse, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{code}")
	@ResponseBody
	public ResponseEntity<?> update(@Valid @RequestBody HierarchyTypeRequest hierarchyTypeRequest, BindingResult errors,
			@PathVariable @Size(max = 50) String code, @RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId) {

		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		hierarchyTypeRequest.getHierarchyType().setCode(code);
		hierarchyTypeRequest.getHierarchyType().setTenantId(tenantId);
		final ErrorResponse errorResponses = validateHierarchyTypeRequest(hierarchyTypeRequest, taskAction[1]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
		HierarchyTypeResponse hierarchyTypeResponse = new HierarchyTypeResponse();
		if (tenantId != null && !tenantId.isEmpty()) {
			RequestInfo requestInfo = hierarchyTypeRequest.getRequestInfo();
			HierarchyType hierarchyType = null;
			try {
				hierarchyType = hierarchyTypeService
						.updateHierarchyType(hierarchyTypeRequest.getHierarchyType());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(hierarchyTypeRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			hierarchyTypeResponse.getHierarchyTypes().add(hierarchyType);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			hierarchyTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<HierarchyTypeResponse>(hierarchyTypeResponse, HttpStatus.OK);
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<?> search(@Valid @RequestParam(value = "hierarchyType", required = false) Long hierarchyType,
			@RequestParam(value = "tenantId", required = false) @Size(max = 256) String tenantId,@ModelAttribute HierarchyTypeRequest hierarchyTypeRequest,BindingResult errors) {

		if (errors.hasErrors()) {
			LOGGER.info("HierarchyTypeRequest binding error: " + hierarchyTypeRequest);
		}
		LOGGER.info("BoundaryRequest: " + hierarchyTypeRequest);
		if (tenantId != null && hierarchyType != null) {
			HierarchyType hierarchyTypeObj = new HierarchyType();
			hierarchyTypeObj.setTenantId(tenantId);
			hierarchyTypeObj.setId(hierarchyType);
			hierarchyTypeRequest.setHierarchyType(hierarchyTypeObj);
		} else if (tenantId != null) {
			HierarchyType hierarchyTypeObj = new HierarchyType();
			hierarchyTypeObj.setTenantId(tenantId);
			hierarchyTypeRequest.setHierarchyType(hierarchyTypeObj);
		}
		HierarchyTypeResponse hierarchyTypeResponse = new HierarchyTypeResponse();
		if (hierarchyTypeRequest.getHierarchyType() != null
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {
			List<HierarchyType> allHierarchyTypes = hierarchyTypeService.getAllHierarchyTypes(hierarchyTypeRequest);
			hierarchyTypeResponse.getHierarchyTypes().addAll(allHierarchyTypes);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			hierarchyTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<>(hierarchyTypeResponse, HttpStatus.OK);
	}

	@PostMapping(value = "/_search")
	@ResponseBody
	public ResponseEntity<?> searchHierachyTypes(@RequestBody @Valid HierarchyTypeSearchRequest hierarchyTypeRequest) {
		HierarchyTypeResponse hierarchyTypeResponse = new HierarchyTypeResponse();
		if (hierarchyTypeRequest.getHierarchyType() != null
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {
			List<HierarchyType> allHierarchyTypes = hierarchyTypeService.getAllHierarchyTypes(hierarchyTypeRequest);
			hierarchyTypeResponse.getHierarchyTypes().addAll(allHierarchyTypes);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			hierarchyTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<>(hierarchyTypeResponse, HttpStatus.OK);
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

	private ErrorResponse validateHierarchyTypeRequest(final HierarchyTypeRequest hierarchyTypeRequest, String action) {
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(hierarchyTypeRequest, action);
		errorResponse.setError(error);
		return errorResponse;
	}

	private Error getError(final HierarchyTypeRequest hierarchyTypeRequest, String action) {
		final List<ErrorField> errorFields = getErrorFields(hierarchyTypeRequest, action);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_HIERARCHYtype_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final HierarchyTypeRequest hierarchyTypeRequest, String action) {
		final List<ErrorField> errorFields = new ArrayList<>();
		addTenantIdValidationError(hierarchyTypeRequest, errorFields);
		addHierarchyTypeNameValidationError(hierarchyTypeRequest, errorFields);
		addHierarchyTypeCodeValidationError(hierarchyTypeRequest, errorFields, action);
		addHierarchyTypeNameAndCodeUniqueValidationError(hierarchyTypeRequest, errorFields);
		return errorFields;
	}

	private List<ErrorField> addTenantIdValidationError(final HierarchyTypeRequest hierarchyTypeRequest,
			final List<ErrorField> errorFields) {
		if (hierarchyTypeRequest.getHierarchyType().getTenantId() == null
				|| hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.TENANTID_MANDATORY_CODE)
					.message(BoundaryConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addHierarchyTypeNameValidationError(final HierarchyTypeRequest hierarchyTypeRequest,
			final List<ErrorField> errorFields) {
		if (hierarchyTypeRequest.getHierarchyType().getName() == null
				|| hierarchyTypeRequest.getHierarchyType().getName().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.HIERARCHYTYPE_NAME_MANDATORY_CODE)
					.message(BoundaryConstants.HIERARCHYTYPE_NAME_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.HIERARCHYTYPE_NAME_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addHierarchyTypeCodeValidationError(final HierarchyTypeRequest hierarchyTypeRequest,
			final List<ErrorField> errorFields, String action) {
		if (hierarchyTypeRequest.getHierarchyType().getCode() == null
				|| hierarchyTypeRequest.getHierarchyType().getCode().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.HIERARCHYTYPE_CODE_MANDATORY_CODE)
					.message(BoundaryConstants.HIERARCHYTYPE_CODE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.HIERARCHYTYPE_CODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (hierarchyTypeRequest.getHierarchyType().getCode() != null
				&& !hierarchyTypeRequest.getHierarchyType().getCode().isEmpty()
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null && action.equals("create")) {
			if (hierarchyTypeService.findByCodeAndTenantId(hierarchyTypeRequest.getHierarchyType().getCode(),
					hierarchyTypeRequest.getHierarchyType().getTenantId()) != null) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.HIERARCHYTYPE_CODE_TENANT_UNIQUE_CODE)
						.message(BoundaryConstants.HIERARCHYTYPE_CODE_TENANT_UNIQUE_ERROR_MESSAGE)
						.field(BoundaryConstants.HIERARCHYTYPE_CODE_TENANT_UNIQUE_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addHierarchyTypeNameAndCodeUniqueValidationError(
			final HierarchyTypeRequest hierarchyTypeRequest, final List<ErrorField> errorFields) {
		if (hierarchyTypeRequest.getHierarchyType() != null && hierarchyTypeRequest.getHierarchyType().getName() != null
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeRequest.getHierarchyType().getName().isEmpty()
				&& !hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {

			if (hierarchyTypeService.getHierarchyTypeByNameAndTenantId(
					hierarchyTypeRequest.getHierarchyType().getName(),
					hierarchyTypeRequest.getHierarchyType().getTenantId()) != null) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.HIERARCHYTYPE_NAME_TENANT_UNIQUE_CODE)
						.message(BoundaryConstants.HIERARCHYTYPE_NAME_TENANT_UNIQUE_ERROR_MESSAGE)
						.field(BoundaryConstants.HIERARCHYTYPE_NAME_TENANT_UNIQUE_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

}