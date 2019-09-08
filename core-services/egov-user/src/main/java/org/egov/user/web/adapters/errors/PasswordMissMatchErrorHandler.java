package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class PasswordMissMatchErrorHandler implements ErrorAdapter<Void> {

	private static final String PASSWORD_MISMATCH_CODE = "USER.PASSWORD_MISMATCH";
	private static final String PASSWORD_MISMATCH_FIELD = "existingPassword";
	private static final String PASSWORD_MISMATCH_MESSAGE = "Password does not match for existing user.";
	private static final String PASSWORD_UPDATE_FAILED_MESSAGE = "Password update failed.";

	@Override
	public ErrorResponse adapt(Void model) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(PASSWORD_UPDATE_FAILED_MESSAGE)
				.fields(getErrorField())
				.build();
	}

	private List<ErrorField> getErrorField() {
		return Collections.singletonList(
				ErrorField.builder()
						.message(PASSWORD_MISMATCH_MESSAGE)
						.code(PASSWORD_MISMATCH_CODE)
						.field(PASSWORD_MISMATCH_FIELD)
						.build()
		);
	}


}

