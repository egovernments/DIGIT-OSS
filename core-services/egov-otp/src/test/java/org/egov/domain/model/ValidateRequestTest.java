package org.egov.domain.model;

import org.egov.domain.exception.InvalidTokenValidateRequestException;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class ValidateRequestTest {

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_tenant_id_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId(null)
                .identity("identity")
                .build();

        assertTrue(validateRequest.isTenantIdAbsent());
        validateRequest.validate();
    }

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_identity_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId("tenant")
                .identity(null)
                .build();

        assertTrue(validateRequest.isIdentityAbsent());
        validateRequest.validate();
    }

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_otp_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(null)
                .tenantId("tenant")
                .identity("identity")
                .build();

        assertTrue(validateRequest.isOtpAbsent());
        validateRequest.validate();
    }

    @Test
    public void test_should_not_throw_validation_exception_when_request_has_mandatory_parameters() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId("tenant")
                .identity("identity")
                .build();

        validateRequest.validate();
    }
}