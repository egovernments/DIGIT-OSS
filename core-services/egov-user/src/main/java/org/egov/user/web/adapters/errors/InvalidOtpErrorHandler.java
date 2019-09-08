package org.egov.user.web.adapters.errors;

import java.util.Collections;
import java.util.List;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

public class InvalidOtpErrorHandler implements ErrorAdapter<String> {

	private static final String INVALIDTOKEN_NAME_CODE = "USER.InvalidToken";
	private static final String INVALIDTOKEN_FIELD = "User.OtpReference";

	public ErrorResponse adapt(String user) {
		final Error error = getError(user);
		return new ErrorResponse(null, error);
	}

	private Error getError(String error) {
		return Error.builder().code(HttpStatus.BAD_REQUEST.value()).message(error).fields(getUserNameFieldError(error))
				.build();
	}

	private List<ErrorField> getUserNameFieldError(String error) {
		return Collections.singletonList(
				ErrorField.builder().field(INVALIDTOKEN_FIELD).code(INVALIDTOKEN_NAME_CODE).message(error).build());
	}
}