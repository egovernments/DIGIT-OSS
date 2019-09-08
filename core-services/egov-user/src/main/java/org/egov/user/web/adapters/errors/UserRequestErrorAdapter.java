package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.User;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class UserRequestErrorAdapter implements ErrorAdapter<User> {

	private static final String INVALID_USER_OBJECT = "Invalid user object";

	private static final String TYPE_MISSING_CODE = "core-user.002";
	private static final String USER_TYPE = "User.type";
	private static final String TYPE_MISSING_ERROR = "Type is required";

	private static final String MOBILE_MISSING_CODE = "core-user.004";
	private static final String USER_MOBILE = "User.mobile";
	private static final String MOBILE_MISSING_ERROR = "Mobile number is required";

	private static final String NAME_MISSING_CODE = "core-user.005";
	private static final String USER_NAME = "User.name";
	private static final String NAME_MISSING_ERROR = "Name is required";

	private static final String USERNAME_MISSING_CODE = "core-user.005";
	private static final String USER_USERNAME = "User.username";
	private static final String USERNAME_MISSING_ERROR = "Username is required";

	private static final String TENANT_MISSING_CODE = "core-user.TENANT_MANDATORY";
	private static final String TENANT_FIELD = "tenantId";
	private static final String TENANT_MISSING_MESSAGE = "Tenant is required";
	
/*	private static final String PASSWORD_MISSING_CODE = "core-user.PASSWORD_MANDATORY";
	private static final String PASSWORD_FIELD = "password";
	private static final String PASSWORD_MISSING_MESSAGE = "Password is required";*/

	private static final String ROLES_MISSING_CODE = "core-user.ROLES_MANDATORY";
	private static final String ROLES_FIELD = "roles";
	private static final String ROLES_MISSING_MESSAGE = "Role(s) is required";

	private static final String OTP_REFERENCE_MISSING_CODE = "core-user.OTP_REFERENCE_MANDATORY";
	private static final String OTP_REFERENCE_FIELD = "user.OtpReference";
	private static final String OTP_REFERENCE_MANDATORY_MESSAGE = "OTP Reference is required";

	private static final String INVALID_PERMANENT_ADDRESS_CODE = "core-user.PERMANENT_ADDRESS_INVALID";
	private static final String PERMANENT_ADDRESS_FIELD = "user.permanentAddress";
	private static final String INVALID_PERMANENT_ADDRESS_MESSAGE =
			"City max length (300), Address max length (300), PinCode max length(10)";

	private static final String INVALID_CORRESPONDENCE_ADDRESS_CODE = "core-user.CORRESPONDENCE_ADDRESS_INVALID";
	private static final String CORRESPONDENCE_ADDRESS_FIELD = "user.correspondenceAddress";
	private static final String INVALID_CORRESPONDENCE_ADDRESS_MESSAGE =
			"City max length (300), Address max length (300), PinCode max length(10)";

	public ErrorResponse adapt(User user) {
		final Error error = getError(user);
		return new ErrorResponse(null, error);
	}

	private Error getError(User user) {
		List<ErrorField> errorFields = getErrorFields(user);
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(INVALID_USER_OBJECT)
				.fields(errorFields)
				.build();
	}

	private List<ErrorField> getErrorFields(User user) {
		List<ErrorField> errorFields = new ArrayList<>();
		addTypeMissingError(user, errorFields);
		addMobileNumberMissingError(user, errorFields);
		addUsernameMissingError(user, errorFields);
		addNameMissingError(user, errorFields);
		addTenantMissingError(user, errorFields);
		//addPasswordMissingError(user, errorFields);
		addRolesMissingError(user, errorFields);
		addOtpReferenceMissingError(user, errorFields);
		addCorrespondenceAddressError(user, errorFields);
		addPermanentAddressError(user, errorFields);
		return errorFields;
	}

	private void addPermanentAddressError(User user, List<ErrorField> errorFields) {
		if (user.isPermanentAddressInvalid()) {
			errorFields.add(ErrorField.builder()
					.code(INVALID_PERMANENT_ADDRESS_CODE)
					.field(PERMANENT_ADDRESS_FIELD)
					.message(INVALID_PERMANENT_ADDRESS_MESSAGE)
					.build());
		}
	}

	private void addCorrespondenceAddressError(User user, List<ErrorField> errorFields) {
		if (user.isCorrespondenceAddressInvalid()) {
			errorFields.add(ErrorField.builder()
					.code(INVALID_CORRESPONDENCE_ADDRESS_CODE)
					.field(CORRESPONDENCE_ADDRESS_FIELD)
					.message(INVALID_CORRESPONDENCE_ADDRESS_MESSAGE)
					.build());
		}
	}

	private void addOtpReferenceMissingError(User user, List<ErrorField> errorFields) {
		if (user.isOtpReferenceAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(OTP_REFERENCE_MISSING_CODE)
					.field(OTP_REFERENCE_FIELD)
					.message(OTP_REFERENCE_MANDATORY_MESSAGE)
					.build());
		}
	}

	private void addNameMissingError(User user, List<ErrorField> errorFields) {
		if (user.isNameAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(NAME_MISSING_CODE).field(USER_NAME).message(NAME_MISSING_ERROR).build());
		}
	}

	private void addRolesMissingError(User user, List<ErrorField> errorFields) {
		if (user.isRolesAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(ROLES_MISSING_CODE).field(ROLES_FIELD).message(ROLES_MISSING_MESSAGE).build());
		}
	}

	private void addTenantMissingError(User user, List<ErrorField> errorFields) {
		if (user.isTenantIdAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(TENANT_MISSING_CODE).field(TENANT_FIELD).message(TENANT_MISSING_MESSAGE).build());
		}
	}
	
/*	private void addPasswordMissingError(User user, List<ErrorField> errorFields) {
		if (user.isPasswordAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(PASSWORD_MISSING_CODE).field(PASSWORD_FIELD).message(PASSWORD_MISSING_MESSAGE).build());
		}
	}*/

	private void addUsernameMissingError(User user, List<ErrorField> errorFields) {
		if (user.isUsernameAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(USERNAME_MISSING_CODE).field(USER_USERNAME).message(USERNAME_MISSING_ERROR).build());
		}
	}

	private void addTypeMissingError(User user, List<ErrorField> errorFields) {
		if (user.isTypeAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(TYPE_MISSING_CODE).field(USER_TYPE).message(TYPE_MISSING_ERROR).build());
		}
	}

	private void addMobileNumberMissingError(User user, List<ErrorField> errorFields) {
		if (user.isMobileNumberAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(MOBILE_MISSING_CODE).field(USER_MOBILE).message(MOBILE_MISSING_ERROR).build());
		}
	}
}


