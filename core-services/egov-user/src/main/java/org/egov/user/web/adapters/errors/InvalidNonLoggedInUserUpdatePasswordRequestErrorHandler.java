package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.NonLoggedInUserUpdatePasswordRequest;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class InvalidNonLoggedInUserUpdatePasswordRequestErrorHandler
		implements ErrorAdapter<NonLoggedInUserUpdatePasswordRequest> {

	private static final String MOBILE_NUMBER_MANDATORY_CODE = "USER.MOBILE_NUMBER_MANDATORY";
	private static final String MOBILE_NUMBER_MANDATORY_FIELD = "mobileNumber";
	private static final String MOBILE_NUMBER_MANDATORY_MESSAGE = "Mobile number is mandatory";

	private static final String OTP_REFERENCE_MANDATORY_CODE = "USER.OTP_REFERENCE_MANDATORY";
	private static final String OTP_REFERENCE_MANDATORY_FIELD = "otpReference";
	private static final String OTP_REFERENCE_MANDATORY_MESSAGE = "OTP reference is mandatory";

	private static final String TENANT_MANDATORY_CODE = "USER.TENANT_ID_MANDATORY";
	private static final String TENANT_MANDATORY_FIELD = "tenantId";
	private static final String TENANT_MANDATORY_MESSAGE = "Tenant id is mandatory";

	private static final String NEW_PASSWORD_MANDATORY_CODE = "USER.NEW_PASSWORD_MANDATORY";
	private static final String NEW_PASSWORD_MANDATORY_FIELD = "newPassword";
	private static final String NEW_PASSWORD_MANDATORY_MESSAGE = "New password is mandatory";

	private static final String PASSWORD_UPDATE_FAILED_MESSAGE = "Password update failed.";

	@Override
	public ErrorResponse adapt(NonLoggedInUserUpdatePasswordRequest model) {
		return new ErrorResponse(null, getError(model));
	}

	private Error getError(NonLoggedInUserUpdatePasswordRequest model) {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(PASSWORD_UPDATE_FAILED_MESSAGE)
				.fields(getErrorFields(model))
				.build();
	}

	private List<ErrorField> getErrorFields(NonLoggedInUserUpdatePasswordRequest model) {
		final ArrayList<ErrorField> errorFields = new ArrayList<>();
		addMobileNumberMandatoryError(model, errorFields);
		addOtpReferenceMandatoryError(model, errorFields);
		addTenantIdMandatoryError(model, errorFields);
		addNewPasswordMandatoryError(model, errorFields);
		return errorFields;
	}

	private void addNewPasswordMandatoryError(NonLoggedInUserUpdatePasswordRequest model,
											  ArrayList<ErrorField> errorFields) {
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

	private void addTenantIdMandatoryError(NonLoggedInUserUpdatePasswordRequest model,
												   ArrayList<ErrorField> errorFields) {
		if(!model.isTenantIdAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(TENANT_MANDATORY_CODE)
				.field(TENANT_MANDATORY_FIELD)
				.message(TENANT_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addOtpReferenceMandatoryError(NonLoggedInUserUpdatePasswordRequest model,
										 ArrayList<ErrorField> errorFields) {
		if(!model.isOtpReferenceAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(OTP_REFERENCE_MANDATORY_CODE)
				.field(OTP_REFERENCE_MANDATORY_FIELD)
				.message(OTP_REFERENCE_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

	private void addMobileNumberMandatoryError(NonLoggedInUserUpdatePasswordRequest model,
											   ArrayList<ErrorField> errorFields) {
		if(!model.isUsernameAbsent()) {
			return;
		}
		final ErrorField errorField = ErrorField.builder()
				.code(MOBILE_NUMBER_MANDATORY_CODE)
				.field(MOBILE_NUMBER_MANDATORY_FIELD)
				.message(MOBILE_NUMBER_MANDATORY_MESSAGE)
				.build();
		errorFields.add(errorField);
	}

}
