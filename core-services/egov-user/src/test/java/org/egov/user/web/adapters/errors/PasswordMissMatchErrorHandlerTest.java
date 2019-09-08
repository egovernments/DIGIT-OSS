package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class PasswordMissMatchErrorHandlerTest {

	@Test
	public void test_should_return_error_response() {
		final ErrorResponse errorResponse = new PasswordMissMatchErrorHandler().adapt(null);

		assertNotNull(errorResponse);
		final Error error = errorResponse.getError();
		assertEquals("Password update failed.", error.getMessage());
		assertEquals(400, error.getCode());
		final List<ErrorField> fields = error.getFields();
		assertEquals(1, fields.size());
		assertEquals("existingPassword", fields.get(0).getField());
		assertEquals("Password does not match for existing user.", fields.get(0).getMessage());
		assertEquals("USER.PASSWORD_MISMATCH", fields.get(0).getCode());
	}

}