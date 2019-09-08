package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserUpdateErrorAdapterTest {

	@Mock
	private User user;

	private UserUpdateErrorAdapter errorAdapter;

	@Before
	public void before() {
		errorAdapter = new UserUpdateErrorAdapter();
	}

	@Test
	public void test_should_set_error_when_roles_missing() {
		when(user.isTenantIdAbsent()).thenReturn(true);

		final ErrorResponse errorResponse = errorAdapter.adapt(user);

		assertNotNull(errorResponse);
		final List<ErrorField> errorFields = errorResponse.getError().getFields();
		assertEquals(1, errorFields.size());
		assertEquals("core-user.TENANT_MANDATORY", errorFields.get(0).getCode());
		assertEquals("tenantId", errorFields.get(0).getField());
		assertEquals("Tenant is required", errorFields.get(0).getMessage());
	}

	@Test
	public void test_should_not_set_errors_when_model_is_valid() {
		final ErrorResponse errorResponse = errorAdapter.adapt(user);

		assertNotNull(errorResponse);
		final List<ErrorField> errorFields = errorResponse.getError().getFields();
		assertEquals(0, errorFields.size());
	}

}