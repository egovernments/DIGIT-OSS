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
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.Department;
import org.egov.commons.service.DepartmentService;
import org.egov.commons.util.CollectionConstants;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.egov.commons.web.contract.DepartmentRequest;
import org.egov.commons.web.contract.DepartmentResponse;
import org.egov.commons.web.contract.RequestInfoWrapper;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.errorhandlers.Error;
import org.egov.commons.web.errorhandlers.ErrorResponse;
import org.egov.commons.web.errorhandlers.RequestErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

	private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);

	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private RequestErrorHandler errHandler;


	@Autowired
	private ResponseInfoFact responseInfoFactory;

	@PostMapping("_search")
	@ResponseBody
	public ResponseEntity<?> searchExisting(@ModelAttribute @Valid DepartmentGetRequest departmentGetRequest,
									BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
									BindingResult requestBodyBindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		// validate input params
		if (requestBodyBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		}

		// Call service
		List<Department> departmentsList = null;
		try {
			departmentsList = departmentService.getDepartmentsFromMDMS(requestInfoWrapper.getRequestInfo(), departmentGetRequest);
		} catch (Exception exception) {
			logger.error("Error while processing request " + departmentGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}

		return getSuccessResponse(departmentsList, requestInfo);
	}

	@PostMapping("/v1/_search")
	@ResponseBody
	public ResponseEntity<?> searchNew(@ModelAttribute @Valid DepartmentGetRequest departmentGetRequest,
									BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
									BindingResult requestBodyBindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		// validate input params
		if (modelAttributeBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);
		}

		// validate input params
		if (requestBodyBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		}

		// Call service
		List<Department> departmentsList = null;
		try {
			departmentsList = departmentService.getDepartments(departmentGetRequest);
		} catch (Exception exception) {
			logger.error("Error while processing request " + departmentGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}

		return getSuccessResponse(departmentsList, requestInfo);
	}

	/**
	 * Populate Response object and returns departments List
	 * 
	 * @param departmentsList
	 * @return
	 */
	private ResponseEntity<?> getSuccessResponse(List<Department> departmentsList, RequestInfo requestInfo) {
		DepartmentResponse departmentRes = new DepartmentResponse();
		departmentRes.setDepartment(departmentsList);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		departmentRes.setResponseInfo(responseInfo);
		return new ResponseEntity<DepartmentResponse>(departmentRes, HttpStatus.OK);

	}

	@PostMapping(value = "/v1/_create")
	public ResponseEntity<?> createDepartment(@RequestBody DepartmentRequest departmentRequest,
											  final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("departmentRequest::" + departmentRequest);
		final List<ErrorResponse> errorResponses = validateDepartmentRequest(departmentRequest, false);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);
		DepartmentRequest deptReq = departmentService.createDepartmentAsync(departmentRequest);

		return getSuccessResponse(Collections.singletonList(deptReq.getDepartment()), departmentRequest.getRequestInfo());
	}

	@PostMapping(value = "/v1/_update")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> updateDepartment(@RequestBody DepartmentRequest departmentRequest, final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("departmentRequest::" + departmentRequest);
		final List<ErrorResponse> errorResponses = validateDepartmentRequest(departmentRequest, true);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);
		DepartmentRequest deptReq = departmentService.updateDepartmentAsync(departmentRequest);
		return getSuccessResponse(Collections.singletonList(deptReq.getDepartment()), departmentRequest.getRequestInfo());
	}

	private ErrorResponse populateErrors(final BindingResult errors) {
		final ErrorResponse errRes = new ErrorResponse();

		final Error error = new Error();
		error.setCode(1);
		error.setDescription("Error while binding request");
		if (errors.hasFieldErrors())
			for (final FieldError fieldError : errors.getFieldErrors())
				error.getFields().put(fieldError.getField(), fieldError.getRejectedValue());
		errRes.setError(error);
		return errRes;
	}

	private List<ErrorResponse> validateDepartmentRequest(final DepartmentRequest departmentRequest, Boolean isUpdate) {
		final List<ErrorResponse> errorResponses = new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(departmentRequest, isUpdate);
		errorResponse.setError(error);
		if (!errorResponse.getErrorFields().isEmpty())
			errorResponses.add(errorResponse);
		return errorResponses;
	}

	private Error getError(final DepartmentRequest departmentRequest, Boolean isUpdate) {
		final List<ErrorField> errorFields = getErrorFields(departmentRequest, isUpdate);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(CollectionConstants.INVALID_DETAILS_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final DepartmentRequest departmentRequest, Boolean isUpdate) {
		final List<ErrorField> errorFields = new ArrayList<>();

		addTenantIdValidationErrors(departmentRequest, errorFields);
		addNameValidationErrors(departmentRequest, errorFields, isUpdate);
		addCodeValidationErrors(departmentRequest, errorFields, isUpdate);
		return errorFields;
	}


	private void addTenantIdValidationErrors(final DepartmentRequest departmentRequest,
											 final List<ErrorField> errorFields) {
		final Department department = departmentRequest.getDepartment();
		if (department.getTenantId() == null || department.getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.TENANT_MANDATORY_CODE)
					.message(CollectionConstants.TENANT_MANADATORY_ERROR_MESSAGE)
					.field(CollectionConstants.TENANT_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else
			return;

	}

	private void addNameValidationErrors(final DepartmentRequest departmentRequest,
										 final List<ErrorField> errorFields, Boolean isUpdate) {
		final Department department = departmentRequest.getDepartment();
		if (department.getName() == null || department.getName().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DEPARTMENT_NAME_MANDATORY_CODE)
					.message(CollectionConstants.DEPARTMENT_NAME_MANADATORY_ERROR_MESSAGE)
					.field(CollectionConstants.DEPARTMENT_NAME_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (!departmentService.getDepartmentByNameAndTenantId(department.getName(),
				department.getTenantId(), department.getId(), isUpdate)) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DEPARTMENT_NAME_UNIQUE_CODE)
					.message(CollectionConstants.DEPARTMENT_NAME_UNIQUE_ERROR_MESSAGE)
					.field(CollectionConstants.DEPARTMENT_NAME_UNIQUE_FIELD_NAME).build();
			errorFields.add(errorField);
		} else
			return;

	}

	private void addCodeValidationErrors(final DepartmentRequest departmentRequest,
										 final List<ErrorField> errorFields, Boolean isUpdate)

	{
		final Department department = departmentRequest.getDepartment();
		if (department.getCode() == null || department.getCode().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DEPARTMENT_CODE_MANDATORY_CODE)
					.message(CollectionConstants.DEPARTMEN_CODE_MANADATORY_ERROR_MESSAGE)
					.field(CollectionConstants.DEPARTMENT_CODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (!departmentService.getDepartmentByCodeAndTenantId(department.getCode(),
				department.getTenantId(), department.getId(), isUpdate)) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DEPARTMENT_CODE_UNIQUE_CODE)
					.message(CollectionConstants.DEPAREMENT_CODE_UNIQUE_ERROR_MESSAGE)
					.field(CollectionConstants.DEPARTMENT_CODE_UNIQUE_FIELD_NAME).build();
			errorFields.add(errorField);
		} else
			return;
	}

}
