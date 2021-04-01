package org.egov.web.error;

import java.util.ArrayList;
import java.util.List;

import org.egov.web.contract.Error;
import org.egov.web.contract.ErrorField;
import org.egov.web.contract.ErrorResponse;
import org.springframework.http.HttpStatus;

public class UserMobileNumberNotFoundErrorAdapter implements ErrorAdapter<Void> {

	private static final String UNKNOWN_MOBILE_NUMBER_CODE = "OTP.MOBILE_NUMBER";
	private static final String UNKNOWN_MOBILE_NUMBER_MESSAGE = "MobileNumber Not Found For This User.";
	private static final String UNKNOWN_MOBILE_NUMBER_FIELD = "otp.mobileNumber";
	private static final String MESSAGE = "OTP request for password reset failed";

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


