package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class UserNameNotValidErrorHandler implements ErrorAdapter<Void> {

    private static final String INVALID_USER_NAME_CODE = "USER.USER_NAME";
    private static final String INVALID_USER_NAME_MESSAGE = "User Name Should be Mobile Number";
    private static final String INVALID_USER_NAME_FIELD = "User.userName";

	@Override
	public ErrorResponse adapt(Void model) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(INVALID_USER_NAME_MESSAGE)
				.fields(getErrorField())
				.build();
	}

	private List<ErrorField> getErrorField() {
		return Collections.singletonList(
				ErrorField.builder()
						.message(INVALID_USER_NAME_MESSAGE)
						.code(INVALID_USER_NAME_CODE)
						.field(INVALID_USER_NAME_FIELD)
						.build()
		);
	}


}
