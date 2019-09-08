package org.egov.user.web.contract;

import org.egov.user.persistence.dto.Otp;
import org.egov.user.persistence.dto.OtpResponse;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class OtpResponseTest {

	@Test
	public void test_validation_successful_is_false_when_otp_response_is_null() {
		final OtpResponse otpResponse = new OtpResponse(null, null);

		assertFalse(otpResponse.isValidationComplete("mobileNumber"));
	}

	@Test
	public void test_validation_successful_is_false_when_success_flag_is_false() {
		final Otp otp = Otp.builder().validationSuccessful(false).build();
		final OtpResponse otpResponse = new OtpResponse(otp, null);

		assertFalse(otpResponse.isValidationComplete("mobileNumber"));
	}

	@Test
	public void test_validation_successful_is_false_when_identity_differs_from_mobile_number() {
		final Otp otp = Otp.builder().validationSuccessful(true).identity("someOtherMobileNumber").build();
		final OtpResponse otpResponse = new OtpResponse(otp, null);

		assertFalse(otpResponse.isValidationComplete("mobileNumber"));
	}

	@Test
	public void test_validation_successful_is_true_when_identity_is_same_as_mobile_number_and_flag_is_successful() {
		final Otp otp = Otp.builder().validationSuccessful(true).identity("mobileNumber").build();
		final OtpResponse otpResponse = new OtpResponse(otp, null);

		assertTrue(otpResponse.isValidationComplete("mobileNumber"));
	}

}