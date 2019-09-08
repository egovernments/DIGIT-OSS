package org.egov.web.contract;

import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.ValidateRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OtpValidateRequestTest {

    @Test
    public void test_should_create_domain_from_contract() {
        final RequestInfo requestInfo = RequestInfo.builder().build();
        final Otp otp = new Otp("otp", null, "identity", "tenant", false);
        final OtpValidateRequest validateRequest =
                new OtpValidateRequest(requestInfo, otp);

        final ValidateRequest domain = validateRequest.toDomainValidateRequest();

        assertNotNull(domain);
        assertEquals("otp", domain.getOtp());
        assertEquals("identity", domain.getIdentity());
        assertEquals("tenant", domain.getTenantId());
    }
}