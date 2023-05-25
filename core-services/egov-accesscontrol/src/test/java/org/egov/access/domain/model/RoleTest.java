package org.egov.access.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class RoleTest {

	@Test
	public void testShouldCheckEqualAndHashCodeForObjects() {
		Role role1 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();
		Role role2 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();

		assertTrue(role1.equals(role2));
		assertEquals(role1.hashCode(), role2.hashCode());
	}

	@Test
	public void testShouldCheckNotEqualAndHashCodeForObjects() {
		Role role1 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();
		Role role2 = Role.builder().id(1L).name("Another Employee").code("EMP").description("Employee of an org")
				.build();

		assertFalse(role1.equals(role2));
		assertNotEquals(role1.hashCode(), role2.hashCode());
	}
}
