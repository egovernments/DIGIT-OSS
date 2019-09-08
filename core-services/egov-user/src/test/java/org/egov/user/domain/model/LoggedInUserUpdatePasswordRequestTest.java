package org.egov.user.domain.model;

import org.egov.user.domain.exception.InvalidLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.model.enums.UserType;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class LoggedInUserUpdatePasswordRequestTest {

	@Test
	public void test_equals_should_return_true_when_both_instances_have_same_field_values() {
		final LoggedInUserUpdatePasswordRequest updatePassword1 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();
		final LoggedInUserUpdatePasswordRequest updatePassword2 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();

		assertEquals(updatePassword1, updatePassword2);
	}

	@Test
	public void test_hashcode_should_be_same_when_both_instances_have_same_field_values() {
		final LoggedInUserUpdatePasswordRequest updatePassword1 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();
		final LoggedInUserUpdatePasswordRequest updatePassword2 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();

		assertEquals(updatePassword1.hashCode(), updatePassword2.hashCode());
	}

	@Test
	public void test_equals_should_return_false_when_both_instances_have_different_field_values() {
		final LoggedInUserUpdatePasswordRequest updatePassword1 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("oldPassword1")
				.newPassword("newPassword1")
				.build();
		final LoggedInUserUpdatePasswordRequest updatePassword2 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();

		assertNotEquals(updatePassword1, updatePassword2);
	}

	@Test
	public void test_hashcode_should_differ_when_both_instances_have_different_field_values() {
		final LoggedInUserUpdatePasswordRequest updatePassword1 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish424")
				.existingPassword("oldPassword1")
				.newPassword("newPassword1")
				.build();
		final LoggedInUserUpdatePasswordRequest updatePassword2 = LoggedInUserUpdatePasswordRequest.builder()
				.userName("greenfish425")
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.build();

		assertNotEquals(updatePassword1.hashCode(), updatePassword2.hashCode());
	}

	@Test
	public void test_validate_should_not_throw_exception_when_all_mandatory_fields_are_present() {
		final LoggedInUserUpdatePasswordRequest updatePassword = LoggedInUserUpdatePasswordRequest.builder()
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.userName("greenfish424")
				.tenantId("ap.public")
				.type(UserType.CITIZEN)
				.build();

		updatePassword.validate();
	}

	@Test(expected = InvalidLoggedInUserUpdatePasswordRequestException.class)
	public void test_validate_should_throw_exception_when_user_id_is_not_present() {
		final LoggedInUserUpdatePasswordRequest updatePassword = LoggedInUserUpdatePasswordRequest.builder()
				.existingPassword("existingPassword")
				.newPassword("newPassword")
				.userName(null)
				.build();

		updatePassword.validate();
	}

	@Test(expected = InvalidLoggedInUserUpdatePasswordRequestException.class)
	public void test_validate_should_throw_exception_when_old_password_is_not_present() {
		final LoggedInUserUpdatePasswordRequest updatePassword = LoggedInUserUpdatePasswordRequest.builder()
				.existingPassword(null)
				.newPassword("newPassword")
				.userName("xya")
				.build();

		updatePassword.validate();
	}

	@Test(expected = InvalidLoggedInUserUpdatePasswordRequestException.class)
	public void test_validate_should_throw_exception_when_new_password_is_not_present() {
		final LoggedInUserUpdatePasswordRequest updatePassword = LoggedInUserUpdatePasswordRequest.builder()
				.existingPassword("existingPassword")
				.newPassword(null)
				.userName("xyz")
				.build();

		updatePassword.validate();
	}

}