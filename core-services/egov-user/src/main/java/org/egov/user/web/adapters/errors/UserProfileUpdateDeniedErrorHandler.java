package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class UserProfileUpdateDeniedErrorHandler implements ErrorAdapter<Void> {

	private static final String MESSAGE = "Update of user is denied.";
	private static final String CODE = "USER.USER_UPDATE_DENIED";
	private static final String USER_ID_FIELD = "id";

	public ErrorResponse adapt(Void value) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(MESSAGE)
				.fields(getErrorField())
				.build();
	}

	private List<ErrorField> getErrorField() {
		return Collections.singletonList(
				ErrorField.builder()
						.message(MESSAGE)
						.code(CODE)
						.field(USER_ID_FIELD)
						.build()
		);
	}
}
