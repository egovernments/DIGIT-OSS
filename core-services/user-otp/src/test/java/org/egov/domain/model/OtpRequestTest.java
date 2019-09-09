package org.egov.domain.model;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import org.egov.domain.exception.InvalidOtpRequestException;
import org.junit.Test;

public class OtpRequestTest {

	@Test(expected = InvalidOtpRequestException.class)
	public void test_should_throw_validation_exception_when_tenant_id_is_not_present() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId(null).mobileNumber("mobile number").build();

		assertTrue(otpRequest.isTenantIdAbsent());
		otpRequest.validate();
	}

	@Test(expected = InvalidOtpRequestException.class)
	public void test_should_throw_validation_exception_when_mobile_number_is_not_present() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber(null).build();

		assertTrue(otpRequest.isMobileNumberAbsent());
		otpRequest.validate();
	}

	@Test(expected = InvalidOtpRequestException.class)
	public void test_should_throw_validation_exception_when_type_is_not_present() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber("mobileNumber").type(null)
				.build();

		assertTrue(otpRequest.isInvalidType());
		otpRequest.validate();
	}

	@Test
	public void test_validate_should_not_throw_exception_for_a_valid_request() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber("1234567890")
				.type(OtpRequestType.REGISTER).build();

		otpRequest.validate();
	}

	@Test
	public void test_should_not_throw_exception_for_a_valid_request() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber("1234567890")
				.type(OtpRequestType.LOGIN).build();

		otpRequest.validate();
	}

	@Test
	public void test_should_returntrue_when_requesttype_login() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber("mobileNumber")
				.type(OtpRequestType.LOGIN).build();

		assertTrue(otpRequest.isLoginRequestType());
		assertFalse(otpRequest.isRegistrationRequestType());
	}

	@Test(expected = InvalidOtpRequestException.class)
	public void test_should_throw_validation_exception_when_mobilenumber_is_not_valid() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenantId").mobileNumber("mobileNumber").type(null)
				.build();

		assertTrue(otpRequest.isInvalidType());
		otpRequest.validate();
	}

}