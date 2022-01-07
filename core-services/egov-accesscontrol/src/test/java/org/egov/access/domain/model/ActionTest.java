package org.egov.access.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class ActionTest {

	private static final String CREATE_COMPLAINT="Create Complaint";

	private static final String PATH="/createcomplaint";
	@Test
	public void testShouldCheckEqualAndHashCodeForObjects() {
		Action action1 = Action.builder().id(1L).name(CREATE_COMPLAINT).url(PATH)
				.displayName(CREATE_COMPLAINT).serviceCode("test").build();
		Action action2 = Action.builder().id(1L).name(CREATE_COMPLAINT).url(PATH)
				.displayName(CREATE_COMPLAINT).serviceCode("test").build();

		assertTrue(action1.equals(action2));
		assertEquals(action1.hashCode(), action2.hashCode());
	}

	@Test
	public void testShouldCheckNotEqualAndHashCodeForObjects() {
		Action action1 = Action.builder().id(1L).name(CREATE_COMPLAINT).url(PATH)
				.displayName(CREATE_COMPLAINT).serviceCode("test").build();
		Action action2 = Action.builder().id(2L).name("Update Complaint").url("/updatecomplaint")
				.displayName("Update Complaint").serviceCode("test").build();

		assertFalse(action1.equals(action2));
		assertNotEquals(action1.hashCode(), action2.hashCode());
	}
}
