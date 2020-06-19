package org.egov.domain.model;

import org.egov.domain.exception.InvalidTokenRequestException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class TokenRequestTest {

    @Test
    public void test_should_not_throw_validation_exception_when_mandatory_fields_are_present() {
        final TokenRequest token = new TokenRequest("identity", "tenant");
        token.validate();
    }

    @Test(expected = InvalidTokenRequestException.class)
    public void test_should_throw_validation_exception_when_identity_not_present() {
        final TokenRequest token = new TokenRequest(null, "tenant");

        assertTrue(token.isIdentityAbsent());
        token.validate();
    }

    @Test(expected = InvalidTokenRequestException.class)
    public void test_should_throw_validation_exception_when_tenant_not_present() {
        final TokenRequest token = new TokenRequest("identity", null);

        assertTrue(token.isTenantIdAbsent());
        token.validate();
    }

    @Test
    public void test_should_generate_5_digit_token() {
        final TokenRequest token = new TokenRequest("identity", "tenant");

        assertNotNull(token.generateToken());
        assertEquals(5, token.generateToken().length());
    }

}