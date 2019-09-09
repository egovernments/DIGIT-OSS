package org.egov.web.error;

import java.util.ArrayList;
import java.util.List;

import org.egov.web.contract.Error;
import org.egov.web.contract.ErrorField;
import org.egov.web.contract.ErrorResponse;
import org.springframework.http.HttpStatus;

public class UserNotExistErrorAdapter implements ErrorAdapter<Void> {

	private static final String UNKNOWN_MOBILE_NUMBER_CODE = "OTP.UNKNOWN_USER";
	private static final String UNKNOWN_MOBILE_NUMBER_MESSAGE = "User not Found With this UserName";
	private static final String UNKNOWN_MOBILE_NUMBER_FIELD = "otp.mobileNumber";
	private static final String MESSAGE = "OTP request for login failed";

	@Override
	public ErrorResponse adapt(Void model) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		List<ErrorField> errorFields = getErrorFields();
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(MESSAGE)
				.fields(errorFields)
				.build();
	}

	private List<ErrorField> getErrorFields() {
		List<ErrorField> errorFields = new ArrayList<>();
		final ErrorField latitudeErrorField = ErrorField.builder()
				.code(UNKNOWN_MOBILE_NUMBER_CODE)
				.message(UNKNOWN_MOBILE_NUMBER_MESSAGE)
				.field(UNKNOWN_MOBILE_NUMBER_FIELD)
				.build();
		errorFields.add(latitudeErrorField);
		return errorFields;
	}
}
