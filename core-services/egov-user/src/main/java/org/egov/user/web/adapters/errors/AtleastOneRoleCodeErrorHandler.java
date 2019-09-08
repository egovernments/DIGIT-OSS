package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class AtleastOneRoleCodeErrorHandler {

	private static final String ATLEAST_ONE_ROLE_CODE = "CORE.USER.ATLEAST ONE ROLE IS REQUIRED.";
	private static final String ATLEAST_ONE_ROLE_MESSAGE = "Roles is Required.";
	private static final String ROLE_FIELD = "roles";

	public ErrorResponse adapt() {
		final Error error = getError();
		return new ErrorResponse(null, error);
	}

	private Error getError() {
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(ATLEAST_ONE_ROLE_MESSAGE)
				.fields(getUserNameFieldError())
				.build();
	}

	private List<ErrorField> getUserNameFieldError() {
		return Collections.singletonList(
				ErrorField.builder()
						.field(ROLE_FIELD)
						.code(ATLEAST_ONE_ROLE_CODE)
						.message(ATLEAST_ONE_ROLE_MESSAGE)
						.build()
		);
	}
}
