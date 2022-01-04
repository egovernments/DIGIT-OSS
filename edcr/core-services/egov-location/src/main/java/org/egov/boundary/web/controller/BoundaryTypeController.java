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

import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.exception.CustomException;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.BoundaryTypeRequest;
import org.egov.boundary.web.contract.BoundaryTypeResponse;
import org.egov.boundary.web.contract.BoundaryTypeSearchRequest;
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
@RequestMapping("/boundarytypes")
public class BoundaryTypeController {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(BoundaryController.class);
	
	@Autowired
	private BoundaryTypeService boundaryTypeService;

	@Autowired
	private HierarchyTypeService hierarchyTypeService;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	private static final String[] taskAction = { "create", "update" };

	@PostMapping()
	public ResponseEntity<?> create(@RequestBody @Valid BoundaryTypeRequest boundaryTypeRequest, BindingResult errors) {
		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		final ErrorResponse errorResponses = validateBoundaryTypeRequest(boundaryTypeRequest, taskAction[0]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		BoundaryTypeResponse boundaryTypeResponse = new BoundaryTypeResponse();
		if (boundaryTypeRequest.getBoundaryType() != null && boundaryTypeRequest.getBoundaryType().getTenantId() != null
				&& !boundaryTypeRequest.getBoundaryType().getTenantId().isEmpty()) {
			RequestInfo requestInfo = boundaryTypeRequest.getRequestInfo();
			BoundaryType contractBoundaryType = null;
			try {
				contractBoundaryType = boundaryTypeService
						.createBoundaryType(boundaryTypeRequest.getBoundaryType());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(boundaryTypeRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			boundaryTypeResponse.getBoundaryTypes().add(contractBoundaryType);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			boundaryTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{code}")
	@ResponseBody
	public ResponseEntity<?> update(@RequestBody @Valid BoundaryTypeRequest boundaryTypeRequest, BindingResult errors,
			@PathVariable String code, @RequestParam(value = "tenantId", required = true) String tenantId) {

		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		boundaryTypeRequest.getBoundaryType().setCode(code);
		boundaryTypeRequest.getBoundaryType().setTenantId(tenantId);
		final ErrorResponse errorResponses = validateBoundaryTypeRequest(boundaryTypeRequest, taskAction[1]);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		BoundaryTypeResponse boundaryTypeResponse = new BoundaryTypeResponse();
		if (tenantId != null && !tenantId.isEmpty()) {
			RequestInfo requestInfo = boundaryTypeRequest.getRequestInfo();
			BoundaryType contractBoundaryType =null;
			try {
				contractBoundaryType = boundaryTypeService
						.updateBoundaryType(boundaryTypeRequest.getBoundaryType());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(boundaryTypeRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			boundaryTypeResponse.getBoundaryTypes().add(contractBoundaryType);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			boundaryTypeResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.OK);
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<?> search(@Valid @RequestParam(value = "boundaryType", required = false) Long boundaryType,
			@RequestParam(value = "tenantId", required = false) @Size(max = 256) String tenantId,@ModelAttribute @Valid BoundaryTypeRequest boundaryTypeRequest,BindingResult errors) {
		
		if (errors.hasErrors()) {
			LOGGER.info("BoundaryTypeRequest binding error: " + boundaryTypeRequest);
		}
		LOGGER.info("BoundaryTypeRequest: " + boundaryTypeRequest);

		if (tenantId != null && boundaryType != null) {
			BoundaryType boundaryTypeObj = new BoundaryType();
			boundaryTypeObj.setTenantId(tenantId);
			boundaryTypeObj.setId(boundaryType.toString());
			boundaryTypeRequest.setBoundaryType(boundaryTypeObj);
		} else if (tenantId != null) {
			BoundaryType boundaryTypeObj = new BoundaryType();
			boundaryTypeObj.setTenantId(tenantId);
			boundaryTypeRequest.setBoundaryType(boundaryTypeObj);
		}
		
		BoundaryTypeResponse boundaryTypeResponse = new BoundaryTypeResponse();
		ResponseInfo responseInfo = new ResponseInfo();
		if (boundaryTypeRequest.getBoundaryType() != null && boundaryTypeRequest.getBoundaryType().getTenantId() != null
				&& !boundaryTypeRequest.getBoundaryType().getTenantId().isEmpty()) {
			List<BoundaryType> allBoundaryTypes = boundaryTypeService.getAllBoundaryTypes(boundaryTypeRequest);
			boundaryTypeResponse.getBoundaryTypes().addAll(allBoundaryTypes);
			responseInfo.setStatus(HttpStatus.OK.toString());
			// responseInfo.setApi_id(body.getRequestInfo().getApi_id());
			boundaryTypeResponse.setResponseInfo(responseInfo);
			return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.OK);
		}
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		boundaryTypeResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.BAD_REQUEST);
	}

	@PostMapping(value = "/_search")
	@ResponseBody
	public ResponseEntity<?> searchBoundaryType(
			@RequestBody @Valid BoundaryTypeSearchRequest boundaryTypeSearchRequest) {

		BoundaryTypeResponse boundaryTypeResponse = new BoundaryTypeResponse();
		ResponseInfo responseInfo = new ResponseInfo();
		if (boundaryTypeSearchRequest.getBoundaryType() != null
				&& boundaryTypeSearchRequest.getBoundaryType().getTenantId() != null
				&& !boundaryTypeSearchRequest.getBoundaryType().getTenantId().isEmpty()) {
			List<BoundaryType> allBoundaryTypes = boundaryTypeService.getAllBoundaryTypes(boundaryTypeSearchRequest);
			boundaryTypeResponse.getBoundaryTypes().addAll(allBoundaryTypes);
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			// responseInfo.setApi_id(body.getRequestInfo().getApi_id());
			boundaryTypeResponse.setResponseInfo(responseInfo);
			return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.OK);
		}
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		boundaryTypeResponse.setResponseInfo(responseInfo);
		return new ResponseEntity<BoundaryTypeResponse>(boundaryTypeResponse, HttpStatus.BAD_REQUEST);
	}

	@PostMapping(value = "/getByHierarchyType")
	@ResponseBody
	public ResponseEntity<?> getBoundaryTypesByHierarchyTypeName(
			@RequestParam(value = "hierarchyTypeName", required = true) @Size(max = 128) final String hierarchyTypeName,
			@RequestParam(value = "tenantId", required = true) @Size(max = 256) final String tenantId) {
		BoundaryTypeResponse boundaryTypeResponse = new BoundaryTypeResponse();
		if (hierarchyTypeName != null && !hierarchyTypeName.isEmpty()) {
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			boundaryTypeResponse.setResponseInfo(responseInfo);
			List<BoundaryType> boundaryTypes = boundaryTypeService
					.getAllBoundarTypesByHierarchyTypeIdAndTenantName(hierarchyTypeName, tenantId);
			boundaryTypeResponse.setBoundaryTypes(boundaryTypes);
			return new ResponseEntity<>(boundaryTypeResponse, HttpStatus.OK);
		} else
			return new ResponseEntity<>(boundaryTypeResponse, HttpStatus.BAD_REQUEST);

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

	private ErrorResponse validateBoundaryTypeRequest(final BoundaryTypeRequest boundaryTypeRequest, String action) {
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(boundaryTypeRequest, action);
		errorResponse.setError(error);
		return errorResponse;
	}

	private Error getError(final BoundaryTypeRequest boundaryTypeRequest, String action) {
		final List<ErrorField> errorFields = getErrorFields(boundaryTypeRequest, action);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_BOUNDARYRequest_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final BoundaryTypeRequest boundaryTypeRequest, String action) {
		final List<ErrorField> errorFields = new ArrayList<>();
		addTenantIdValidationError(boundaryTypeRequest, errorFields);
		addBoundaryTypeNameValidationError(boundaryTypeRequest, errorFields);
		addBoundaryTypeHierarchyValidationError(boundaryTypeRequest, errorFields);
		addBoundaryTypeHierarchyTypeValidationError(boundaryTypeRequest, errorFields);
		addBoundaryTypeParentValidationError(boundaryTypeRequest, errorFields);
		addBoundaryTypeCodeUniqueValidationError(boundaryTypeRequest, errorFields, action);

		return errorFields;
	}

	private List<ErrorField> addTenantIdValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields) {
		if (boundaryTypeRequest.getBoundaryType().getTenantId() == null
				|| boundaryTypeRequest.getBoundaryType().getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.TENANTID_MANDATORY_CODE)
					.message(BoundaryConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeNameValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields) {
		if (boundaryTypeRequest.getBoundaryType().getName() == null
				|| boundaryTypeRequest.getBoundaryType().getName().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARYTYPE_NAME_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARYTYPE_NAME_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARYTYPE_NAME_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeHierarchyValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields) {
		if (boundaryTypeRequest.getBoundaryType().getHierarchy() == null
				|| boundaryTypeRequest.getBoundaryType().getHierarchy() == 0) {
			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.BOUNDARYTYPE_HIERARCHY_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARYTYPE_HIERARCHY_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARYTYPE_HIERARCHY_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeHierarchyTypeValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields) {

		if (boundaryTypeRequest.getBoundaryType().getHierarchyType() == null) {

			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (boundaryTypeRequest.getBoundaryType().getHierarchyType() != null
				&& boundaryTypeRequest.getBoundaryType().getHierarchyType().getCode() == null) {

			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (boundaryTypeRequest.getBoundaryType().getHierarchyType() != null
				&& boundaryTypeRequest.getBoundaryType().getHierarchyType().getCode() != null) {

			if (!(hierarchyTypeService.findByCodeAndTenantId(
					boundaryTypeRequest.getBoundaryType().getHierarchyType().getCode(),
					boundaryTypeRequest.getBoundaryType().getTenantId()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_CODE)
						.message(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARYTYPE_HIERARCHYTYPECODE_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeParentValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields) {

		if (boundaryTypeRequest.getBoundaryType().getParent() != null
				&& boundaryTypeRequest.getBoundaryType().getParent().getCode() != null) {
			if (!(boundaryTypeService.findByTenantIdAndCode(boundaryTypeRequest.getBoundaryType().getTenantId(),
					boundaryTypeRequest.getBoundaryType().getParent().getCode()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARYTYPE_PARENT_INVALID_CODE)
						.message(BoundaryConstants.BOUNDARYTYPE_PARENT_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARYTYPE_PARENT_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addBoundaryTypeCodeUniqueValidationError(final BoundaryTypeRequest boundaryTypeRequest,
			final List<ErrorField> errorFields, String action) {
		if (boundaryTypeRequest.getBoundaryType() != null && (boundaryTypeRequest.getBoundaryType().getCode() == null
				|| boundaryTypeRequest.getBoundaryType().getCode().isEmpty())) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.BOUNDARYTYPE_CODE_MANDATORY_CODE)
					.message(BoundaryConstants.BOUNDARYTYPE_CODE_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.BOUNDARYTYPE_CODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);

		} else if (boundaryTypeRequest.getBoundaryType().getTenantId() != null
				&& boundaryTypeRequest.getBoundaryType().getCode() != null) {
			if (boundaryTypeService.findByTenantIdAndCode(boundaryTypeRequest.getBoundaryType().getTenantId(),
					boundaryTypeRequest.getBoundaryType().getCode()) != null && action.equals("create")) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.BOUNDARYTYPE_CODE_TENANT_UNIQUE_CODE)
						.message(BoundaryConstants.BOUNDARYTYPE_CODE_TENANT_UNIQUE_ERROR_MESSAGE)
						.field(BoundaryConstants.BOUNDARYTYPE_CODE_TENANT_UNIQUE_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}

		return errorFields;
	}

}