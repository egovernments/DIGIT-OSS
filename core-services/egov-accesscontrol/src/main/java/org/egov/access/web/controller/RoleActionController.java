package org.egov.access.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.access.domain.model.RoleAction;
import org.egov.access.domain.service.RoleActionService;
import org.egov.access.util.AccessControlConstants;
import org.egov.access.web.contract.action.RoleActionsRequest;
import org.egov.access.web.contract.action.RoleActionsResponse;
import org.egov.access.web.contract.factory.ResponseInfoFactory;
import org.egov.access.web.errorhandlers.Error;
import org.egov.access.web.errorhandlers.ErrorResponse;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/role-actions")
public class RoleActionController {

	private static final Logger logger = LoggerFactory.getLogger(RoleActionController.class);

	@Autowired
	private RoleActionService roleActionService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@PostMapping(value = "_create")
	public ResponseEntity<?> createRoleActions(@RequestBody @Valid final RoleActionsRequest roleActionRequest,
			final BindingResult errors) {

		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		logger.info("Create Role Actions Type Request::" + roleActionRequest);

		final List<ErrorResponse> errorResponses = validateRoleActionsRequest(roleActionRequest);

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<RoleAction> roleActions = roleActionService.createRoleActions(roleActionRequest);

		return getSuccessResponse(roleActions, roleActionRequest.getRequestInfo());
	}

	private ResponseEntity<?> getSuccessResponse(final List<RoleAction> roleActions, final RequestInfo requestInfo) {
		final RoleActionsResponse roleActionResponse = new RoleActionsResponse();
		final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		roleActionResponse.setResponseInfo(responseInfo);
		roleActionResponse.setRoleActions(roleActions);
		return new ResponseEntity<>(roleActionResponse, HttpStatus.OK);
	}

	private List<ErrorResponse> validateRoleActionsRequest(final RoleActionsRequest roleActionRequest) {

		final List<ErrorResponse> errorResponses = new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(roleActionRequest);
		errorResponse.setError(error);
		if (!errorResponse.getErrorFields().isEmpty())
			errorResponses.add(errorResponse);
		return errorResponses;
	}

	private Error getError(final RoleActionsRequest roleActionRequest) {
		final List<ErrorField> errorFields = getErrorFields(roleActionRequest);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(AccessControlConstants.INVALID_ROLE_ACTION_REQUEST_MESSAGE).errorFields(errorFields).build();
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

	private List<ErrorField> getErrorFields(final RoleActionsRequest roleActionRequest) {
		final List<ErrorField> errorFields = new ArrayList<>();
		addTeanantIdValidationErrors(roleActionRequest, errorFields);
		addRoleCodeAndNameValidationErrors(roleActionRequest, errorFields);
		addActionsLengthValidationErrors(roleActionRequest, errorFields);
		addActionNamesValidationErrors(roleActionRequest, errorFields);
		addRolesLengthValidationErrors(roleActionRequest, errorFields);
		addUniqueValidationForTenantAndRoleAndAction(roleActionRequest, errorFields);
		return errorFields;
	}

	private void addTeanantIdValidationErrors(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (roleActionRequest.getTenantId() == null || roleActionRequest.getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.TENANTID_MANDATORY_CODE)
					.message(AccessControlConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
	}

	private void addRoleCodeAndNameValidationErrors(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (!(roleActionRequest.getRole() != null && roleActionRequest.getRole().getCode() != null
				&& roleActionRequest.getRole().getCode() != "")) {
			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_CODE_MANDATORY_CODE)
					.message(AccessControlConstants.ROLE_CODE_MANADATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.ROLE_CODE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}
	}

	private void addActionsLengthValidationErrors(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (!(roleActionRequest.getActions() != null && roleActionRequest.getActions().size() > 0)) {

			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ACTIONS_NAME_MANDATORY_CODE)
					.message(AccessControlConstants.ACTIONS_NAME_MANDATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.ACTIONS_NAME_MANDATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}

	}

	private void addRolesLengthValidationErrors(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (!(roleActionRequest.getRole() != null)) {

			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_MANDATORY_CODE)
					.message(AccessControlConstants.ROLE_MANADATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.ROLE_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}

	}

	private void addActionNamesValidationErrors(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (roleActionRequest.getActions() != null && roleActionRequest.getActions().size() > 0
				&& !roleActionService.checkActionNamesAreExistOrNot(roleActionRequest)) {

			final ErrorField errorField = ErrorField.builder()
					.code(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_CODE)
					.message(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_ERROR_MESSAGE)
					.field(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_FIELD_NAME).build();
			errorFields.add(errorField);
		}
	}

	private void addUniqueValidationForTenantAndRoleAndAction(final RoleActionsRequest roleActionRequest,
			final List<ErrorField> errorFields) {

		if (!roleActionService.addUniqueValidationForTenantAndRoleAndAction(roleActionRequest)) {

			final ErrorField errorField = ErrorField.builder()
					.code(AccessControlConstants.ROLE_ACTIONS_UNIQUE_VALIDATION_CODE)
					.message(AccessControlConstants.ROLE_ACTIONS_UNIQUE_VALIDATION_ERROR_MESSAGE)
					.field(AccessControlConstants.ROLE_ACTIONS_UNIQUE_VALIDATION_FIELD_NAME).build();
			errorFields.add(errorField);

		}

	}

}
