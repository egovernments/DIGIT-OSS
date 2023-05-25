package org.egov.web.error;

import org.egov.web.contract.Error;
import org.egov.web.contract.ErrorField;
import org.egov.web.contract.ErrorResponse;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class UserNotFoundErrorAdapterTest {

	@Test
	public void test_should_return_error_response() {
		final UserNotFoundErrorAdapter adapter = new UserNotFoundErrorAdapter();

		final ErrorResponse errorResponse = adapter.adapt(null);

		assertNotNull(errorResponse);
		final Error error = errorResponse.getError();
		assertEquals("OTP request for password reset failed", error.getMessage());
		assertEquals(400, error.getCode());
		final List<ErrorField> fields = error.getFields();
		assertEquals(1, fields.size());
		assertEquals("OTP.UNKNOWN_MOBILE_NUMBER", fields.get(0).getCode());
		assertEquals("otp.mobileNumber", fields.get(0).getField());
		assertEquals("Mobile number is unknown.", fields.get(0).getMessage());
	}

}