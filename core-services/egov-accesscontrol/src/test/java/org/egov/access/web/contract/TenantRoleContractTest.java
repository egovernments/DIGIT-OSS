package org.egov.access.web.contract;

import org.egov.access.web.contract.role.RoleContract;
import org.egov.access.web.contract.validateaction.TenantRoleContract;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class TenantRoleContractTest {

	@Test
	public void testThatTenantRoleContainsInfoAboutTenantAndRoles() {
		RoleContract role1 = RoleContract.builder().name("Employee").description("Employee of an org").build();
		RoleContract role2 = RoleContract.builder().name("Employee").description("Employee of an org").build();
		List<RoleContract> roles = new ArrayList<>(Arrays.asList(role1, role2));
		TenantRoleContract tenantRole = TenantRoleContract.builder().tenantId("ap.public").roles(roles).build();

		assertEquals("ap.public", tenantRole.getTenantId());
		for (RoleContract role : roles) {
			assert (tenantRole.getRoles().contains(role));
		}
	}
}
