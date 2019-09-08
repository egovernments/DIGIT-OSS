package org.egov.user.web.adapters.errors;

import java.util.Collections;
import java.util.List;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

public class UserInvalidUpdatePasswordRequest implements ErrorAdapter<Void> {

	private static final String INVALIDTOKEN_NAME_CODE = "InvalidPasswordRequest";
	private static final String INVALIDTOKEN_FIELD = "InvalidPasswordRequest";

	public ErrorResponse adapt(Void model) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		String error = "Since We configured login otp enabled is true,So we can't update the password.";
		return Error.builder().code(HttpStatus.BAD_REQUEST.value()).message(error).fields(getUserNameFieldError(error))
				.build();
	}

	private List<ErrorField> getUserNameFieldError(String error) {
		return Collections.singletonList(
				ErrorField.builder().field(INVALIDTOKEN_FIELD).code(INVALIDTOKEN_NAME_CODE).message(error).build());
	}
}
