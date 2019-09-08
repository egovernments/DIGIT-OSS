package org.egov.user.domain.model;

import org.egov.user.domain.exception.InvalidNonLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.model.enums.UserType;
import org.junit.Test;

import static org.junit.Assert.*;

public class NonLoggedInUserUpdatePasswordRequestTest {

	@Test
	public void test_should_not_throw_exception_when_all_mandatory_fields_are_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenant")
				.newPassword("newPassword")
				.userName("userName")
				.tenantId("ap.public")
				.type(UserType.CITIZEN)
				.otpReference("otpReference")
				.build();

		request.validate();

		assertFalse(request.isTenantIdAbsent());
		assertFalse(request.isUsernameAbsent());
		assertFalse(request.isNewPasswordAbsent());
		assertFalse(request.isOtpReferenceAbsent());
	}

	@Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
	public void test_should_throw_exception_when_tenant_id_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId(null)
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		request.validate();
	}

	@Test
	public void test_should_return_true_when_tenant_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId(null)
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		assertTrue(request.isTenantIdAbsent());
	}

	@Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
	public void test_should_throw_exception_when_new_password_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword(null)
				.userName("userName")
				.otpReference("otpReference")
				.build();

		request.validate();
	}

	@Test
	public void test_should_return_true_when_new_password_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword(null)
				.userName("userName")
				.otpReference("otpReference")
				.build();

		assertTrue(request.isNewPasswordAbsent());
	}

	@Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
	public void test_should_throw_exception_when_mobile_number_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName(null)
				.otpReference("otpReference")
				.build();

		request.validate();
	}

	@Test
	public void test_should_return_true_when_mobile_number_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName(null)
				.otpReference("otpReference")
				.build();

		assertTrue(request.isUsernameAbsent());
	}

	@Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
	public void test_should_throw_exception_when_otp_reference_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference(null)
				.build();

		request.validate();
	}

	@Test
	public void test_should_return_true_when_otp_reference_is_not_present() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference(null)
				.build();

		assertTrue(request.isOtpReferenceAbsent());
	}

	@Test
	public void test_equality_should_return_true_when_both_instances_have_same_field_values() {
		final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		assertTrue(request1.equals(request2));
	}

	@Test
	public void test_hash_code_should_be_same_when_both_instances_have_same_field_values() {
		final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId")
				.newPassword("newPassword")
				.userName("userName")
				.otpReference("otpReference")
				.build();

		assertEquals(request1.hashCode(), request2.hashCode());
	}

	@Test
	public void test_equality_should_return_false_when_both_instances_have_different_field_values() {
		final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId1")
				.newPassword("newPassword1")
				.userName("userName1")
				.otpReference("otpReference1")
				.build();

		final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId2")
				.newPassword("newPassword2")
				.userName("userName2")
				.otpReference("otpReference2")
				.build();

		assertFalse(request1.equals(request2));
	}

	@Test
	public void test_hash_code_should_be_different_when_both_instances_have_different_field_values() {
		final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId1")
				.newPassword("newPassword1")
				.userName("userName1")
				.otpReference("otpReference1")
				.build();

		final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenantId2")
				.newPassword("newPassword2")
				.userName("userName2")
				.otpReference("otpReference2")
				.build();

		assertNotEquals(request1.hashCode(), request2.hashCode());
	}

}