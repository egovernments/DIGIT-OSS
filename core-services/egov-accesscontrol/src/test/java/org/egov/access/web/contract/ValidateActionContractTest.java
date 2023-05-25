package org.egov.access.web.contract;

import org.egov.access.web.contract.role.RoleContract;
import org.egov.access.web.contract.validateaction.TenantRoleContract;
import org.egov.access.web.contract.validateaction.ValidateActionContract;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;

public class ValidateActionContractTest {

	@Test
	public void testThatValidateActionContractContainsInfoAboutTenantRoleAndActionUrl() {
		RoleContract role = RoleContract.builder().name("role name").build();
		TenantRoleContract tenantRole = TenantRoleContract.builder().tenantId("ap.public").roles(Arrays.asList(role))
				.build();
		ValidateActionContract validateAction = ValidateActionContract.builder().tenantRole(tenantRole).actionUrl("url")
				.build();

		assertEquals(tenantRole, validateAction.getTenantRole());
		assertEquals("url", validateAction.getActionUrl());

	}
}
