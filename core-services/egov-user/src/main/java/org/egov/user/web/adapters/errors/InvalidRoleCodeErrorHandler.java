package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class InvalidRoleCodeErrorHandler implements ErrorAdapter<String> {

	private static final String INVALID_ROLE_CODE = "USER.ROLE_CODE_IS_INVALID";
	private static final String INVALID_ROLE_MESSAGE = "Role code is invalid";
	private static final String ROLE_FIELD = "roles";

	public ErrorResponse adapt(String roleCode) {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(INVALID_ROLE_MESSAGE)
				.fields(getUserNameFieldError())
				.build();
	}

	private List<ErrorField> getUserNameFieldError() {
		return Collections.singletonList(
				ErrorField.builder()
						.field(ROLE_FIELD)
						.code(INVALID_ROLE_CODE)
						.message(INVALID_ROLE_MESSAGE)
						.build()
		);
	}
}
