package org.egov.persistence.contract;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class OtpResponseTest {

    @Test
    public void test_should_return_false_when_otp_number_is_present() {
        final Otp otp = Otp.builder().otp("otpNumber").build();
        final OtpResponse otpResponse = new OtpResponse(null, otp);

        assertFalse(otpResponse.isOtpNumberAbsent());
    }

    @Test
    public void test_should_return_true_when_otp_number_is_not_present() {
        final Otp otp = Otp.builder().otp(null).build();
        final OtpResponse otpResponse = new OtpResponse(null, otp);

        assertTrue(otpResponse.isOtpNumberAbsent());
    }

    @Test
    public void test_should_return_true_when_otp_object_is_not_present() {
        final Otp otp = Otp.builder().otp(null).build();
        final OtpResponse otpResponse = new OtpResponse(null, otp);

        assertTrue(otpResponse.isOtpNumberAbsent());
    }

}