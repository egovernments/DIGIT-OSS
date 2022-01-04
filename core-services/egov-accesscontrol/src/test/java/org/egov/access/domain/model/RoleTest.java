package org.egov.access.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class RoleTest {

	private static final String NAME_EMPLOYEE = "Employee";
	private static final String DESCRIPTION_EMPLOYEE_OF_ORG = "Employee of an org";

	@Test
	public void testShouldCheckEqualAndHashCodeForObjects() {
		Role role1 = Role.builder().id(1L).name(NAME_EMPLOYEE).code("EMP").description(DESCRIPTION_EMPLOYEE_OF_ORG).build();
		Role role2 = Role.builder().id(1L).name(NAME_EMPLOYEE).code("EMP").description(DESCRIPTION_EMPLOYEE_OF_ORG).build();

		assertTrue(role1.equals(role2));
		assertEquals(role1.hashCode(), role2.hashCode());
	}

	@Test
	public void testShouldCheckNotEqualAndHashCodeForObjects() {
		Role role1 = Role.builder().id(1L).name(NAME_EMPLOYEE).code("EMP").description(DESCRIPTION_EMPLOYEE_OF_ORG).build();
		Role role2 = Role.builder().id(1L).name("Another Employee").code("EMP").description(DESCRIPTION_EMPLOYEE_OF_ORG)
				.build();

		assertFalse(role1.equals(role2));
		assertNotEquals(role1.hashCode(), role2.hashCode());
	}
}
