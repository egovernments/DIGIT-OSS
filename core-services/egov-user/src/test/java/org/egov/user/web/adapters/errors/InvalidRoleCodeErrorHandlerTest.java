package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class InvalidRoleCodeErrorHandlerTest {

	@Test
	public void test_should_return_error_for_invalid_role_code() {
		final ErrorResponse errorResponse = new InvalidRoleCodeErrorHandler().adapt("roleCode1");

		assertNotNull(errorResponse);
		final Error error = errorResponse.getError();
		assertEquals("Role code is invalid", error.getMessage());
		assertEquals(400, error.getCode());
		final List<ErrorField> errorFields = error.getFields();
		assertEquals(1, errorFields.size());
		assertEquals("USER.ROLE_CODE_IS_INVALID", errorFields.get(0).getCode());
		assertEquals("roles", errorFields.get(0).getField());
		assertEquals("Role code is invalid", errorFields.get(0).getMessage());
	}

}