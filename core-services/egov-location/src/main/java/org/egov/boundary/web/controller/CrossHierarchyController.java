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

import org.egov.boundary.domain.service.BoundaryService;
import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.CrossHierarchyService;
import org.egov.boundary.exception.CustomException;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.CrossHierarchy;
import org.egov.boundary.web.contract.CrossHierarchyRequest;
import org.egov.boundary.web.contract.CrossHierarchyResponse;
import org.egov.boundary.web.contract.CrossHierarchySearchRequest;
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
@RequestMapping("/crosshierarchys")
public class CrossHierarchyController {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(CrossHierarchyController.class);
	
	@Autowired
	private CrossHierarchyService crossHierarchyService;

	@Autowired
	private BoundaryService boundaryService;

	@Autowired
	private BoundaryTypeService boundaryTypeService;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody @Valid CrossHierarchyRequest crossHierarchyRequest,
			BindingResult errors) {

		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		final ErrorResponse errorResponses = validateCrossHierarchyRequest(crossHierarchyRequest);
		if (errorResponses.getError() != null && errorResponses.getError().getErrorFields().size() > 0)
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		CrossHierarchyResponse crossHierarchyResponse = new CrossHierarchyResponse();
		if (crossHierarchyRequest.getCrossHierarchy() != null
				&& crossHierarchyRequest.getCrossHierarchy().getTenantId() != null
				&& !crossHierarchyRequest.getCrossHierarchy().getTenantId().isEmpty()) {
			RequestInfo requestInfo = crossHierarchyRequest.getRequestInfo();
			CrossHierarchy crossHierarchy =null;
			try {
				crossHierarchy = crossHierarchyService.create(crossHierarchyRequest.getCrossHierarchy());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(crossHierarchyRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			crossHierarchyResponse.getCrossHierarchys().add(crossHierarchy);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			crossHierarchyResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<>(crossHierarchyResponse, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{code}")
	@ResponseBody
	public ResponseEntity<?> update(@RequestBody @Valid CrossHierarchyRequest crossHierarchyRequest,
			BindingResult errors, @PathVariable @Size(max = 100) String code,
			@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId) {
		if (errors.hasErrors()) {
			ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		CrossHierarchyResponse crossHierarchyResponse = new CrossHierarchyResponse();
		if (tenantId != null && !tenantId.isEmpty()) {
			RequestInfo requestInfo = crossHierarchyRequest.getRequestInfo();
			crossHierarchyRequest.getCrossHierarchy().setCode(code);
			crossHierarchyRequest.getCrossHierarchy().setTenantId(tenantId);
			CrossHierarchy crossHierarchy =null;
			try {
				crossHierarchy = crossHierarchyService.update(crossHierarchyRequest.getCrossHierarchy());
			} catch (CustomException e) {
				LOGGER.error("Exception Message: " + e);
				Error error = new Error();
				final ResponseInfo responseInfo = responseInfoFactory
						.createResponseInfoFromRequestInfo(crossHierarchyRequest.getRequestInfo(), false);
				error.setCode(Integer.valueOf(e.getCode().toString()));
				error.setMessage(e.getCustomMessage());
				error.setDescription(e.getDescription());
				ErrorResponse errorResponse = new ErrorResponse();
				errorResponse.setError(error);
				errorResponse.setResponseInfo(responseInfo);
				return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
			}
			crossHierarchyResponse.getCrossHierarchys().add(crossHierarchy);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			responseInfo.setApiId(requestInfo.getApiId());
			crossHierarchyResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<CrossHierarchyResponse>(crossHierarchyResponse, HttpStatus.CREATED);
	}

	@GetMapping
	@ResponseBody
	public ResponseEntity<?> search(@ModelAttribute @Valid CrossHierarchySearchRequest crossHierarchyRequest) {

		CrossHierarchyResponse crossHierarchyResponse = new CrossHierarchyResponse();
		if (crossHierarchyRequest.getCrossHierarchy() != null
				&& crossHierarchyRequest.getCrossHierarchy().getTenantId() != null
				&& !crossHierarchyRequest.getCrossHierarchy().getTenantId().isEmpty()) {
			List<CrossHierarchy> allCrossHierarchys = crossHierarchyService
					.getAllCrossHierarchys(crossHierarchyRequest);
			crossHierarchyResponse.getCrossHierarchys().addAll(allCrossHierarchys);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			// responseInfo.setApi_id(body.getRequestInfo().getApi_id());
			crossHierarchyResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<CrossHierarchyResponse>(crossHierarchyResponse, HttpStatus.OK);
	}

	@PostMapping(value = "/_search")
	@ResponseBody
	public ResponseEntity<?> searchCrossHierarch(
			@RequestBody @Valid CrossHierarchySearchRequest crossHierarchyRequest) {

		CrossHierarchyResponse crossHierarchyResponse = new CrossHierarchyResponse();
		if (crossHierarchyRequest.getCrossHierarchy() != null
				&& crossHierarchyRequest.getCrossHierarchy().getTenantId() != null
				&& !crossHierarchyRequest.getCrossHierarchy().getTenantId().isEmpty()) {
			List<CrossHierarchy> allCrossHierarchys = crossHierarchyService
					.getAllCrossHierarchys(crossHierarchyRequest);
			crossHierarchyResponse.getCrossHierarchys().addAll(allCrossHierarchys);
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.OK.toString());
			// responseInfo.setApi_id(body.getRequestInfo().getApi_id());
			crossHierarchyResponse.setResponseInfo(responseInfo);
		}
		return new ResponseEntity<CrossHierarchyResponse>(crossHierarchyResponse, HttpStatus.OK);
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

	private ErrorResponse validateCrossHierarchyRequest(final CrossHierarchyRequest crossHierarchyRequest) {
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(crossHierarchyRequest);
		errorResponse.setError(error);
		return errorResponse;
	}

	private Error getError(final CrossHierarchyRequest crossHierarchyRequest) {
		final List<ErrorField> errorFields = getErrorFields(crossHierarchyRequest);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(BoundaryConstants.INVALID_HIERARCHYtype_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final CrossHierarchyRequest crossHierarchyRequest) {
		final List<ErrorField> errorFields = new ArrayList<>();
		addTenantIdValidationError(crossHierarchyRequest, errorFields);
		addCrossHierarchyParentValidationError(crossHierarchyRequest, errorFields);
		addCrossHierarchyChildValidationError(crossHierarchyRequest, errorFields);
		addCrossHierarchyParentTypeValidationError(crossHierarchyRequest, errorFields);
		addCrossHierarchyChildTypeValidationError(crossHierarchyRequest, errorFields);
		return errorFields;
	}

	private List<ErrorField> addTenantIdValidationError(final CrossHierarchyRequest crossHierarchyRequest,
			final List<ErrorField> errorFields) {
		if (crossHierarchyRequest.getCrossHierarchy().getTenantId() == null
				|| crossHierarchyRequest.getCrossHierarchy().getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(BoundaryConstants.TENANTID_MANDATORY_CODE)
					.message(BoundaryConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
		return errorFields;
	}

	private List<ErrorField> addCrossHierarchyParentValidationError(final CrossHierarchyRequest crossHierarchyRequest,
			final List<ErrorField> errorFields) {
		if (crossHierarchyRequest.getCrossHierarchy().getParent() == null) {
			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.CROSSHIERARCHY_PARENT_MANDATORY_CODE)
					.message(BoundaryConstants.CROSSHIERARCHY_PARENT_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.CROSSHIERARCHY_PARENT_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (crossHierarchyRequest.getCrossHierarchy().getParent() != null
				&& crossHierarchyRequest.getCrossHierarchy().getParent().getId() == null) {
			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.CROSSHIERARCHY_PARENTID_MANDATORY_CODE)
					.message(BoundaryConstants.CROSSHIERARCHY_PARENTID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.CROSSHIERARCHY_PARENTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (crossHierarchyRequest.getCrossHierarchy().getParent() != null
				&& crossHierarchyRequest.getCrossHierarchy().getParent().getId() != null) {
			if (!(boundaryService.findByTenantIdAndId(crossHierarchyRequest.getCrossHierarchy().getParent().getId(),
					crossHierarchyRequest.getCrossHierarchy().getTenantId()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.CROSSHIERARCHY_PARENTID_INVALID_CODE)
						.message(BoundaryConstants.CROSSHIERARCHY_PARENTID_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.CROSSHIERARCHY_PARENTID_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addCrossHierarchyChildValidationError(final CrossHierarchyRequest crossHierarchyRequest,
			final List<ErrorField> errorFields) {
		if (crossHierarchyRequest.getCrossHierarchy().getChild() == null) {
			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.CROSSHIERARCHY_CHILD_MANDATORY_CODE)
					.message(BoundaryConstants.CROSSHIERARCHY_CHILD_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.CROSSHIERARCHY_CHILD_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (crossHierarchyRequest.getCrossHierarchy().getChild() != null
				&& crossHierarchyRequest.getCrossHierarchy().getChild().getId() == null) {
			final ErrorField errorField = ErrorField.builder()
					.code(BoundaryConstants.CROSSHIERARCHY_CHILDID_MANDATORY_CODE)
					.message(BoundaryConstants.CROSSHIERARCHY_CHILDID_MANADATORY_ERROR_MESSAGE)
					.field(BoundaryConstants.CROSSHIERARCHY_CHILDID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (crossHierarchyRequest.getCrossHierarchy().getChild() != null
				&& crossHierarchyRequest.getCrossHierarchy().getChild().getId() != null) {
			if (!(boundaryService.findByTenantIdAndId(crossHierarchyRequest.getCrossHierarchy().getChild().getId(),
					crossHierarchyRequest.getCrossHierarchy().getTenantId()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.CROSSHIERARCHY_CHILDID_INVALID_CODE)
						.message(BoundaryConstants.CROSSHIERARCHY_CHILDID_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.CROSSHIERARCHY_CHILDID_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addCrossHierarchyParentTypeValidationError(
			final CrossHierarchyRequest crossHierarchyRequest, final List<ErrorField> errorFields) {
		if (crossHierarchyRequest.getCrossHierarchy().getParentType() != null
				&& crossHierarchyRequest.getCrossHierarchy().getParentType().getId() != null) {
			if (!(boundaryTypeService.findByIdAndTenantId(
					Long.valueOf(crossHierarchyRequest.getCrossHierarchy().getParentType().getId()),
					crossHierarchyRequest.getCrossHierarchy().getTenantId()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.CROSSHIERARCHY_PARENTTYPEID_INVALID_CODE)
						.message(BoundaryConstants.CROSSHIERARCHY_PARENTTYPEID_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.CROSSHIERARCHY_PARENTTYPEID_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}

	private List<ErrorField> addCrossHierarchyChildTypeValidationError(
			final CrossHierarchyRequest crossHierarchyRequest, final List<ErrorField> errorFields) {
		if (crossHierarchyRequest.getCrossHierarchy().getChildType() != null
				&& crossHierarchyRequest.getCrossHierarchy().getChildType().getId() != null) {
			if (!(boundaryTypeService.findByIdAndTenantId(
					Long.valueOf(crossHierarchyRequest.getCrossHierarchy().getChildType().getId()),
					crossHierarchyRequest.getCrossHierarchy().getTenantId()) != null)) {
				final ErrorField errorField = ErrorField.builder()
						.code(BoundaryConstants.CROSSHIERARCHY_CHILDTYPEID_INVALID_CODE)
						.message(BoundaryConstants.CROSSHIERARCHY_CHILDTYPEID_INVALID_ERROR_MESSAGE)
						.field(BoundaryConstants.CROSSHIERARCHY_CHILDTYPEID_INVALID_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
		return errorFields;
	}
}