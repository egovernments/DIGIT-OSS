package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class UserProfileUpdateDeniedErrorHandlerTest {

	@Test
	public void test_should_return_error_response() {
		final UserProfileUpdateDeniedErrorHandler errorHandler = new UserProfileUpdateDeniedErrorHandler();

		final ErrorResponse errorResponse = errorHandler.adapt(null);

		assertNotNull(errorResponse);
		final Error error = errorResponse.getError();
		assertEquals(400, error.getCode());
		assertEquals("Update of user is denied.", error.getMessage());
		final List<ErrorField> errorFields = error.getFields();
		assertEquals(1, errorFields.size());
		assertEquals("USER.USER_UPDATE_DENIED", errorFields.get(0).getCode());
		assertEquals("Update of user is denied.", errorFields.get(0).getMessage());
		assertEquals("id", errorFields.get(0).getField());
	}

}