package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.LoggedInUserUpdatePasswordRequest;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class InvalidLoggedInUserUpdatePasswordRequestErrorHandler implements
		ErrorAdapter<LoggedInUserUpdatePasswordRequest> {

	private static final String USER_ID_MANDATORY_CODE = "USER.AUTH_TOKEN_MANDATORY";
	private static final String USER_ID_MANDATORY_FIELD = "RequestInfo.authToken";
	private static final String USER_ID_MANDATORY_MESSAGE = "Auth token is mandatory";

	private static final String EXISTING_PASSWORD_MANDATORY_CODE = "USER.EXISTING_PASSWORD_MANDATORY";
	private static final String EXISTING_PASSWORD_MANDATORY_FIELD = "existingPassword";
	private static final String EXISTING_PASSWORD_MANDATORY_MESSAGE = "Existing password is mandatory";

	private static final String NEW_PASSWORD_MANDATORY_CODE = "USER.NEW_PASSWORD_MANDATORY";
	private static final String NEW_PASSWORD_MANDATORY_FIELD = "newPassword";
	private static final String NEW_PASSWORD_MANDATORY_MESSAGE = "New password is mandatory";

	private static final String TENANT_ID_MANDATORY_CODE = "USER.TENANT_ID_MANDATORY";
	private static final String TENANT_ID_MANDATORY_FIELD = "tenantId";
	private static final String TENANT_ID_MANDATORY_MESSAGE = "Tenant Id is mandatory";

	private static final String USER_TYPE_MANDATORY_CODE = "USER.TYPE_MANDATORY";
	private static final String USER_TYPE_MANDATORY_FIELD = "userType";
	private static final String USER_TYPE_MANDATORY_MESSAGE = "User Type is mandatory";

	private static final String PASSWORD_UPDATE_FAILED_MESSAGE = "Password update failed.";

	@Override
	public ErrorResponse adapt(LoggedInUserUpdatePasswordRequest model) {
		return new ErrorResponse(null, getError(model));
	}

	private Error getError(LoggedInUserUpdatePasswordRequest model) {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(PASSWORD_UPDATE_FAILED_MESSAGE)
				.fields(getErrorFields(model))
				.build();
	}

	private List<ErrorField> getErrorFields(LoggedInUserUpdatePasswordRequest model) {
		final ArrayList<ErrorField> errorFields = new ArrayList<>();
		addUserIdMandatoryError(model, errorFields);
		addExistingPasswordMandatoryError(model, errorFields);
		addNewPasswordMandatoryError(model, errorFields);
		addTenantIdMandatoryError(model, errorFields);
		addUserTypeMandatoryError(model, errorFields);
		return errorFields;
	}

	private void addNewPasswordMandatoryError(LoggedInUserUpdatePasswordRequest model, ArrayList<ErrorField> errorFields) {
		if(!model.isNewPasswordAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(NEW_PASSWORD_MANDATORY_CODE)
				.field(NEW_PASSWORD_MANDATORY_FIELD)
				.message(NEW_PASSWORD_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addExistingPasswordMandatoryError(LoggedInUserUpdatePasswordRequest model, ArrayList<ErrorField> errorFields) {
		if(!model.isExistingPasswordAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(EXISTING_PASSWORD_MANDATORY_CODE)
				.field(EXISTING_PASSWORD_MANDATORY_FIELD)
				.message(EXISTING_PASSWORD_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addUserIdMandatoryError(LoggedInUserUpdatePasswordRequest model, ArrayList<ErrorField> errorFields) {
		if(!model.isUsernameAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(USER_ID_MANDATORY_CODE)
				.field(USER_ID_MANDATORY_FIELD)
				.message(USER_ID_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addTenantIdMandatoryError(LoggedInUserUpdatePasswordRequest model, ArrayList<ErrorField> errorFields) {
		if(!model.isTenantAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(TENANT_ID_MANDATORY_CODE)
				.field(TENANT_ID_MANDATORY_FIELD)
				.message(TENANT_ID_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addUserTypeMandatoryError(LoggedInUserUpdatePasswordRequest model, ArrayList<ErrorField> errorFields) {
		if(!model.isUserTypeAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(USER_TYPE_MANDATORY_CODE)
				.field(USER_TYPE_MANDATORY_FIELD)
				.message(USER_TYPE_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

}
