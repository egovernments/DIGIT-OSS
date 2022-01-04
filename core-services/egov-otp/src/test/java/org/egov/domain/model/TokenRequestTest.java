package org.egov.domain.model;

import org.egov.domain.exception.InvalidTokenRequestException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class TokenRequestTest {

    private static final String TOKEN_REQUEST_IDENTITY = "identity";
    private static final String TOKEN_REQUEST_TENANT = "tenant";

    @Test
    public void test_should_not_throw_validation_exception_when_mandatory_fields_are_present() {
        final TokenRequest token = new TokenRequest(TOKEN_REQUEST_IDENTITY, TOKEN_REQUEST_TENANT);
        token.validate();
    }

    @Test(expected = InvalidTokenRequestException.class)
    public void test_should_throw_validation_exception_when_identity_not_present() {
        final TokenRequest token = new TokenRequest(null, TOKEN_REQUEST_TENANT);

        assertTrue(token.isIdentityAbsent());
        token.validate();
    }

    @Test(expected = InvalidTokenRequestException.class)
    public void test_should_throw_validation_exception_when_tenant_not_present() {
        final TokenRequest token = new TokenRequest(TOKEN_REQUEST_IDENTITY, null);

        assertTrue(token.isTenantIdAbsent());
        token.validate();
    }

    @Test
    public void test_should_generate_5_digit_token() {
        final TokenRequest token = new TokenRequest(TOKEN_REQUEST_IDENTITY, TOKEN_REQUEST_TENANT);

        assertNotNull(token.generateToken());
        assertEquals(5, token.generateToken().length());
    }

}