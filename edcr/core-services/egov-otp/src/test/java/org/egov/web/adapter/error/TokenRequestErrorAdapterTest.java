package org.egov.web.adapter.error;

import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.TokenRequest;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class TokenRequestErrorAdapterTest {

    @Test
    public void test_should_add_error_field_when_identity_is_not_present() {
        final TokenRequestErrorAdapter errorAdapter = new TokenRequestErrorAdapter();
        final TokenRequest tokenRequest = new TokenRequest(null, "tenantId");

        final ErrorResponse errorResponse = errorAdapter.adapt(tokenRequest);

        assertNotNull(errorResponse);
        final List<ErrorField> errorFields = errorResponse.getError().getFields();
        assertNotNull(errorFields);
        assertEquals(1, errorFields.size());
        assertEquals("OTP.IDENTITY_MANDATORY", errorFields.get(0).getCode());
        assertEquals("otp.identity", errorFields.get(0).getField());
        assertEquals("Identity field is mandatory", errorFields.get(0).getMessage());
    }

    @Test
    public void test_should_add_error_field_when_tenant_is_not_present() {
        final TokenRequestErrorAdapter errorAdapter = new TokenRequestErrorAdapter();
        final TokenRequest tokenRequest = new TokenRequest("identity", null);

        final ErrorResponse errorResponse = errorAdapter.adapt(tokenRequest);

        assertNotNull(errorResponse);
        final List<ErrorField> errorFields = errorResponse.getError().getFields();
        assertNotNull(errorFields);
        assertEquals(1, errorFields.size());
        assertEquals("OTP.TENANT_ID_MANDATORY", errorFields.get(0).getCode());
        assertEquals("otp.tenantId", errorFields.get(0).getField());
        assertEquals("Tenant field is mandatory", errorFields.get(0).getMessage());
    }

}