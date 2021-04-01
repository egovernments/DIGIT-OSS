package org.egov.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class UserTest {

	@Test
	public void test_equals_should_return_true_when_both_instances_have_same_field_values() {
		final User user1 = new User(1L, "foo@bar.com","");
		final User user2 = new User(1L, "foo@bar.com","");
		assertTrue(user1.equals(user2));
	}

	@Test
	public void test_hash_code_should_be_same_when_both_instances_have_same_field_values() {
		final User user1 = new User(1L, "foo@bar.com","");
		final User user2 = new User(1L, "foo@bar.com","");
		assertEquals(user1.hashCode(), user2.hashCode());
	}

	@Test
	public void test_equals_should_return_false_when_both_instances_have_different_field_values() {
		final User user1 = new User(1L, "foo1@bar.com","");
		final User user2 = new User(2L, "foo2@bar.com","");
		assertFalse(user1.equals(user2));
	}

	@Test
	public void test_hash_code_should_be_different_when_both_instances_have_different_field_values() {
		final User user1 = new User(1L, "foo1@bar.com","");
		final User user2 = new User(2L, "foo2@bar.com","");
		assertNotEquals(user1.hashCode(), user2.hashCode());
	}

}