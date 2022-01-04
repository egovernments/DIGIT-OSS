package org.egov.access.web.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.model.Role;
import org.egov.access.domain.service.RoleService;
import org.egov.access.util.AccessControlConstants;
import org.egov.access.web.contract.factory.ResponseInfoFactory;
import org.egov.access.web.contract.role.RoleContract;
import org.egov.access.web.contract.role.RoleRequest;
import org.egov.access.web.contract.role.RoleResponse;
import org.egov.access.web.errorhandlers.Error;
import org.egov.access.web.errorhandlers.ErrorResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/v1/roles")
public class RoleController {

	private static final Logger logger = LoggerFactory.getLogger(RoleController.class);

	private static final String[] taskAction = { "create", "update" };

	private RoleService roleService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	public RoleController(RoleService roleService) {
		this.roleService = roleService;
	}

		@PostMapping(value = "_search")
	public RoleResponse getMDMSRoles(@RequestParam(value = "code", required = false) @Size(max = 50) String code, @RequestParam(value = "tenantId", required = false) @Size(max = 50) String tenantId,
									 @RequestBody @Valid final RoleRequest roleRequest) throws UnsupportedEncodingException, JSONException {

		RoleSearchCriteria roleSearchCriteria = RoleSearchCriteria.builder().codes(new ArrayList<String>()).tenantId(tenantId).build();
		
		System.out.println("Tenant id from the controller: "+tenantId);

		if (code != null && !code.isEmpty()) {

			roleSearchCriteria = RoleSearchCriteria.builder()
					.codes(Arrays.stream(code.split(",")).map(String::trim).collect(Collectors.toList())).tenantId(tenantId).build();
		}

		
		List<Role> roles = roleService.getRolesfromMDMS(roleSearchCriteria);
		return getSuccessResponse(roles);

	}

	private RoleResponse getSuccessResponse(final List<Role> roles) {
		final ResponseInfo responseInfo = ResponseInfo.builder().status(HttpStatus.OK.toString()).build();
		List<RoleContract> roleContracts = new RoleContract().getRoles(roles);
		return new RoleResponse(responseInfo, roleContracts);
	}

	@PostMapping(value = "_create")
	public ResponseEntity<?> createRole(@RequestBody @Valid final RoleRequest roleRequest, final BindingResult errors) {

		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		logger.info("Create Role Type Request::" + roleRequest);

		final List<ErrorResponse> errorResponses = validatRoleRequest(roleRequest, taskAction[0]);

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<Role> roles = roleService.createRole(roleRequest);

		return getSuccessResponse(roles, roleRequest.getRequestInfo());
	}

	@PostMapping(value = "_update")
	public ResponseEntity<?> updateRole(@RequestBody @Valid final RoleRequest roleRequest, final BindingResult errors) {

		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		logger.info("Update Role Request::" + roleRequest);

		final List<ErrorResponse> errorResponses = validatRoleRequest(roleRequest, taskAction[1]);

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<Role> roles = roleService.updateRole(roleRequest);
		return getSuccessResponse(roles, roleRequest.getRequestInfo());
	}

	private ResponseEntity<?> getSuccessResponse(final List<Role> roleList, final RequestInfo requestInfo) {
		final RoleResponse roleRes = new RoleResponse();
		final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		roleRes.setResponseInfo(responseInfo);
		roleRes.setRoles(new RoleContract().getRoles(roleList));
		return new ResponseEntity<>(roleRes, HttpStatus.OK);
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

	private List<ErrorResponse> validatRoleRequest(final RoleRequest roleRequest, String action) {

		final List<ErrorResponse> errorResponses = new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(roleRequest, action);
		errorResponse.setError(error);
		if (!errorResponse.getErrorFields().isEmpty())
			errorResponses.add(errorResponse);
		return errorResponses;
	}

	private Error getError(final RoleRequest roleRequest, String action) {
		final List<ErrorField> errorFields = getErrorFields(roleRequest, action);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(AccessControlConstants.INVALID_ROLE_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final RoleRequest roleRequest, String action) {
		final List<ErrorField> errorFields = new ArrayList<>();

		addRolesLengthValidationErrors(roleRequest, errorFields);
		if (roleRequest.getRoles() != null && roleRequest.getRoles().size() > 0) {

			addRoleameValidationErrors(roleRequest, errorFields);
			if (action.equals(taskAction[0])) {
				checkRoleNameExistValidationErrors(roleRequest, errorFields);
			} else if (action.equals(taskAction[1])) {

				checkRoleNameDoesNotExitValidationErrors(roleRequest, errorFields);
			}

		}

		return errorFields;
	}

	private void addRoleameValidationErrors(final RoleRequest roleRequest, final List<ErrorField> errorFields) {

		for (int i = 0; i < roleRequest.getRoles().size(); i++) {
			if (roleRequest.getRoles().get(i).getName() == null || roleRequest.getRoles().get(i).getName().isEmpty()) {
				final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_NAME_MANDATORY_CODE)
						.message(AccessControlConstants.ROLE_NAME_MANADATORY_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ROLE_NAME_MANADATORY_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void checkRoleNameExistValidationErrors(final RoleRequest roleRequest, final List<ErrorField> errorFields) {

		for (int i = 0; i < roleRequest.getRoles().size(); i++) {
			if (roleService.checkRoleNameDuplicationValidationErrors(roleRequest.getRoles().get(i).getName())) {
				final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_NAME_DUPLICATE_CODE)
						.message(
								AccessControlConstants.ROLE_NAME_DUPLICATE_ERROR_MESSAGE + " in " + (i + 1) + " Object")
						.field(AccessControlConstants.ROLE_NAME_DUPLICATEFIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void checkRoleNameDoesNotExitValidationErrors(final RoleRequest roleRequest,
			final List<ErrorField> errorFields) {

		for (int i = 0; i < roleRequest.getRoles().size(); i++) {
			if (!roleService.checkRoleNameDuplicationValidationErrors(roleRequest.getRoles().get(i).getName())) {
				final ErrorField errorField = ErrorField.builder()
						.code(AccessControlConstants.ROLE_NAME_DOES_NOT_EXIT_CODE)
						.message(AccessControlConstants.ROLE_NAME_DOES_NOT_EXIT_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ROLE_NAME_DOES_NOT_EXIT_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void addRolesLengthValidationErrors(final RoleRequest roleRequest, final List<ErrorField> errorFields) {

		if (!(roleRequest.getRoles() != null && roleRequest.getRoles().size() > 0)) {

			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_LENGHTH_MANDATORY_CODE)
					.message(AccessControlConstants.ROLE_LENGTH_MANADATORY_FIELD_NAME)
					.field(AccessControlConstants.ROLE_LENGTH_MANADATORY_ERROR_MESSAGE).build();
			errorFields.add(errorField);
		}

	}

}
