package org.egov.user.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class OtpValidationRequestTest {

    private static final String TENANT_ID = "tenantId";
    private static final String MOBILE_NUMBER = "mobileNumber";
    private static final String OPT_REFERENCE = "otpReference";

    @Test
    public void test_should_return_true_when_both_instances_have_same_field_values() {
        final OtpValidationRequest request1 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();
        final OtpValidationRequest request2 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();

        assertTrue(request1.equals(request2));
    }

    @Test
    public void test_hash_code_should_be_same_when_both_instances_have_same_field_values() {
        final OtpValidationRequest request1 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();
        final OtpValidationRequest request2 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();

        assertEquals(request1.hashCode(), request2.hashCode());
    }

    @Test
    public void test_should_return_false_when_both_instances_have_different_field_values() {
        final OtpValidationRequest request1 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();
        final OtpValidationRequest request2 = OtpValidationRequest.builder()
                .tenantId("tenantId2")
                .mobileNumber("mobileNumber2")
                .otpReference("otpReference2")
                .build();

        assertFalse(request1.equals(request2));
    }

    @Test
    public void test_hash_code_should_be_different_when_both_instances_have_different_field_values() {
        final OtpValidationRequest request1 = OtpValidationRequest.builder()
                .tenantId(TENANT_ID)
                .mobileNumber(MOBILE_NUMBER)
                .otpReference(OPT_REFERENCE)
                .build();
        final OtpValidationRequest request2 = OtpValidationRequest.builder()
                .tenantId("tenantId2")
                .mobileNumber("mobileNumber2")
                .otpReference("otpReference2")
                .build();

        assertNotEquals(request1.hashCode(), request2.hashCode());
    }

}