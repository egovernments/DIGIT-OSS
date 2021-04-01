package org.egov.web.contract;

import org.egov.domain.model.OtpRequestType;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class OtpRequestTest {

    @Test
    public void test_should_map_from_contract_to_domain() {
        final Otp otp = new Otp("mobileNumber", "tenantId", "register", "CITIZEN");
        final OtpRequest request = new OtpRequest(null, otp);

        final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

        assertNotNull(domainOtpRequest);
        assertEquals("mobileNumber", domainOtpRequest.getMobileNumber());
        assertEquals("tenantId", domainOtpRequest.getTenantId());
        assertEquals(OtpRequestType.REGISTER, domainOtpRequest.getType());
    }

	@Test
	public void test_should_set_request_type_to_register_when_type_not_explicitly_specified() {
		final Otp otp = new Otp("mobileNumber", "tenantId", null, "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertEquals(OtpRequestType.REGISTER, domainOtpRequest.getType());
	}

	@Test
	public void test_should_set_request_type_to_null_when_type_is_unknown() {
		final Otp otp = new Otp("mobileNumber", "tenantId", "unknown", "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertNull(domainOtpRequest.getType());
	}

	@Test
	public void test_should_set_request_type_to_register_when_type_is_register() {
		final Otp otp = new Otp("mobileNumber", "tenantId", "regisTER", "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertEquals(OtpRequestType.REGISTER, domainOtpRequest.getType());
	}

	@Test
	public void test_should_set_request_type_to_password_reset_when_type_is_passwordreset() {
		final Otp otp = new Otp("mobileNumber", "tenantId", "passwordRESET", "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertEquals(OtpRequestType.PASSWORD_RESET, domainOtpRequest.getType());
	}
	
	@Test
	public void test_should_set_request_type_login_when_type_is_login() {
		final Otp otp = new Otp("mobileNumber", "tenantId", "LOGIN", "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertEquals(OtpRequestType.LOGIN, domainOtpRequest.getType());
	}
	
	@Test
	public void test_should_set_request_type_to_login_when_type_is_login() {
		final Otp otp = new Otp("mobileNumber", "tenantId", "login", "CITIZEN");
		final OtpRequest request = new OtpRequest(null, otp);

		final org.egov.domain.model.OtpRequest domainOtpRequest = request.toDomain();

		assertEquals(OtpRequestType.LOGIN, domainOtpRequest.getType());
	}
}