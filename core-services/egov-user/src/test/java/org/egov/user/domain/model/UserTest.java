package org.egov.user.domain.model;

import org.egov.user.domain.exception.InvalidUserCreateException;
import org.egov.user.domain.exception.InvalidUserUpdateException;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserTest {

	@Test(expected = InvalidUserCreateException.class)
	public void testUserWithEmptyNameIsInvalid() throws Exception {
		User user = User.builder()
				.mobileNumber("8899776655")
				.username("foolan_devi")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.build();

		assertTrue(user.isNameAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void testUserWithEmptyUserNameIsInvalid() throws Exception {
		User user = User.builder()
				.mobileNumber("8899776655")
				.name("foolan")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.build();

		assertTrue(user.isUsernameAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void testUserWithEmptyMobileIsInvalid() throws Exception {
		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.mobileValidationMandatory(true)
				.build();

		assertTrue(user.isMobileNumberAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void testUserWithEmptyTypeIsInvalid() throws Exception {
		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.mobileNumber("9988776655")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.build();

		assertTrue(user.isTypeAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_exception_when_tenant_id_is_not_present() {
		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.mobileNumber("9988776655")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.tenantId(null)
				.build();

		assertTrue(user.isTenantIdAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_exception_when_roles_is_not_present() {
		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.mobileNumber("9988776655")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.tenantId("default")
				.roles(null)
				.build();

		assertTrue(user.isRolesAbsent());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_exception_when_role_code_is_not_present() {
		final Role role1 = Role.builder().code("roleCode1").build();
		final Role role2 = Role.builder().code(null).build();

		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.mobileNumber("9988776655")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.tenantId("default")
				.roles(new HashSet<>(Arrays.asList(role1, role2)))
				.build();

		assertTrue(user.isRolesAbsent());
		user.validateNewUser();
	}

	@Test
	public void test_should_return_true_when_user_id_is_not_present() {
		User user = User.builder()
				.id(null)
				.build();

		assertTrue(user.isIdAbsent());
	}

	@Test
	public void test_should_return_false_when_user_id_is_present() {
		User user = User.builder()
				.id(123L)
				.build();

		assertFalse(user.isIdAbsent());
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_validation_exception_when_otp_reference_is_not_present_and_mandatory_flag_is_enabled() {
		User user = User.builder()
				.otpReference(null)
				.otpValidationMandatory(true)
				.build();

		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_validation_exception_when_permanent_address_is_not_valid() {
		final Address permanentAddress = mock(Address.class);
		when(permanentAddress.isInvalid()).thenReturn(true);
		User user = User.builder()
				.permanentAddress(permanentAddress)
				.build();

		assertTrue(user.isPermanentAddressInvalid());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_throw_validation_exception_when_correspondence_address_is_not_valid() {
		final Address correspondence = mock(Address.class);
		when(correspondence.isInvalid()).thenReturn(true);
		User user = User.builder()
				.correspondenceAddress(correspondence)
				.build();

		assertTrue(user.isCorrespondenceAddressInvalid());
		user.validateNewUser();
	}

	@Test(expected = InvalidUserUpdateException.class)
	public void test_should_throw_validation_exception_for_update_when_permanent_address_is_not_valid() {
		final Address permanentAddress = mock(Address.class);
		when(permanentAddress.isInvalid()).thenReturn(true);
		User user = User.builder()
				.permanentAddress(permanentAddress)
				.build();

		assertTrue(user.isPermanentAddressInvalid());

		user.validateUserModification();
	}

	@Test(expected = InvalidUserUpdateException.class)
	public void test_should_throw_validation_exception_for_update_when_correspondence_address_is_not_valid() {
		final Address correspondence = mock(Address.class);
		when(correspondence.isInvalid()).thenReturn(true);
		User user = User.builder()
				.correspondenceAddress(correspondence)
				.build();

		assertTrue(user.isCorrespondenceAddressInvalid());

		user.validateUserModification();
	}

	@Test(expected = InvalidUserUpdateException.class)
	public void test_should_throw_validation_exception_for_update_when_tenant_id_is_absent() {
		User user = User.builder()
				.tenantId(null)
				.build();

		assertTrue(user.isTenantIdAbsent());

		user.validateUserModification();
	}

	@Test
	public void test_should_return_true_when_otp_reference_is_not_present_and_mandatory_flag_is_enabled() {
		User user = User.builder()
				.otpReference(null)
				.otpValidationMandatory(true)
				.build();

		assertTrue(user.isOtpReferenceAbsent());
	}

	@Test
	public void test_should_return_false_when_otp_reference_is_not_present_and_mandatory_flag_is_false() {
		User user = User.builder()
				.otpReference(null)
				.otpValidationMandatory(false)
				.build();

		assertFalse(user.isOtpReferenceAbsent());
	}

	@Test
	public void test_should_return_false_when_otp_reference_is_present() {
		User user = User.builder()
				.otpReference("otpReference")
				.build();

		assertFalse(user.isOtpReferenceAbsent());
	}

	@Test
	public void test_should_not_throw_exception_on_user_create_with_all_mandatory_fields() {
		final Role role1 = Role.builder().code("roleCode1").build();
		User user = User.builder()
				.username("foolan_devi")
				.name("foolan")
				.mobileNumber("9988776655")
				.password("password")
				.active(Boolean.TRUE)
				.gender(Gender.FEMALE)
				.type(UserType.CITIZEN)
				.tenantId("default")
				.roles(Collections.singleton(role1))
				.build();

		user.validateNewUser();

		assertFalse(user.isTypeAbsent());
		assertFalse(user.isActiveIndicatorAbsent());
		assertFalse(user.isNameAbsent());
		assertFalse(user.isMobileNumberAbsent());
		assertFalse(user.isUsernameAbsent());
		assertFalse(user.isTenantIdAbsent());
		assertFalse(user.isRolesAbsent());

	}

    @Test
	public void test_should_return_false_when_logged_in_user_is_same_as_user_being_updated() {
		User user = User.builder()
				.id(1L)
				.loggedInUserId(1L)
				.build();

		assertFalse(user.isLoggedInUserDifferentFromUpdatedUser());
	}

	@Test
	public void test_should_return_true_when_logged_in_user_is_different_from_user_being_updated() {
		User user = User.builder()
				.id(1L)
				.loggedInUserId(2L)
				.build();

		assertTrue(user.isLoggedInUserDifferentFromUpdatedUser());
	}

	@Test
	public void test_should_override_to_citizen_role() {
		User user = User.builder()
				.id(1L)
				.type(UserType.CITIZEN)
				.roles(Collections.singleton(Role.builder().code("ADMIN").build()))
				.build();

		user.setRoleToCitizen();

		assertEquals(UserType.CITIZEN, user.getType());
		final Set<Role> roles = user.getRoles();
		assertEquals(1, roles.size());
		assertEquals("CITIZEN", roles.iterator().next().getCode());
	}

	@Test
	public void test_should_nullify_fields() {
		Role role1 = Role.builder().code("roleCode1").build();
		Role role2 = Role.builder().code("roleCode2").build();
		User user = User.builder()
				.username("userName")
				.mobileNumber("mobileNumber")
				.password("password")
				.passwordExpiryDate(new Date())
				.roles(new HashSet<>(Arrays.asList(role1, role2)))
				.build();

		user.nullifySensitiveFields();

		assertNull(user.getUsername());
		assertNull(user.getMobileNumber());
		assertNull(user.getPassword());
		assertNull(user.getPasswordExpiryDate());
		assertNull(user.getRoles());
	}

	@Test
	public void test_should_map_from_user_to_otp_validation_request() {
		final User user = User.builder()
				.tenantId("tenantId")
				.otpReference("otpReference")
				.mobileNumber("mobileNumber")
				.build();

		final OtpValidationRequest otpValidationRequest = user.getOtpValidationRequest();

		assertNotNull(otpValidationRequest);
		assertEquals("tenantId", otpValidationRequest.getTenantId());
		assertEquals("mobileNumber", otpValidationRequest.getMobileNumber());
		assertEquals("otpReference", otpValidationRequest.getOtpReference());
	}

}