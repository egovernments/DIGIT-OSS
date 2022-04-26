package org.egov.domain.model;

import org.egov.domain.exception.InvalidTokenValidateRequestException;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class ValidateRequestTest {

    private static final String VALIDATE_REQUEST_IDENTITY = "identity";
    private static final String VALIDATE_REQUEST_TENANT = "tenant";

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_tenant_id_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId(null)
                .identity(VALIDATE_REQUEST_IDENTITY)
                .build();

        assertTrue(validateRequest.isTenantIdAbsent());
        validateRequest.validate();
    }

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_identity_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId(VALIDATE_REQUEST_TENANT)
                .identity(null)
                .build();

        assertTrue(validateRequest.isIdentityAbsent());
        validateRequest.validate();
    }

    @Test(expected = InvalidTokenValidateRequestException.class)
    public void test_should_throw_validation_exception_when_otp_is_not_present() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(null)
                .tenantId(VALIDATE_REQUEST_TENANT)
                .identity(VALIDATE_REQUEST_IDENTITY)
                .build();

        assertTrue(validateRequest.isOtpAbsent());
        validateRequest.validate();
    }

    @Test
    public void test_should_not_throw_validation_exception_when_request_has_mandatory_parameters() {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("otp")
                .tenantId(VALIDATE_REQUEST_TENANT)
                .identity(VALIDATE_REQUEST_IDENTITY)
                .build();

        validateRequest.validate();
    }
}