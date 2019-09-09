package org.egov.domain.service;

import org.egov.domain.exception.UserAlreadyExistInSystemException;
import org.egov.domain.exception.UserMobileNumberNotFoundException;
import org.egov.domain.exception.UserNotExistingInSystemException;
import org.egov.domain.model.OtpRequest;
import org.egov.domain.model.OtpRequestType;
import org.egov.domain.model.User;
import org.egov.persistence.repository.OtpEmailRepository;
import org.egov.persistence.repository.OtpRepository;
import org.egov.persistence.repository.OtpSMSRepository;
import org.egov.persistence.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class OtpServiceTest {
	@Mock
	private OtpRepository otpRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private OtpSMSRepository otpSMSRepository;

	@Mock
	private OtpEmailRepository otpEmailRepository;

	@InjectMocks
	private OtpService otpService;

	@Test
	public void test_should_validate_otp_request_for_user_registration() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isRegistrationRequestType()).thenReturn(true);

		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test
	public void test_should_validate_otp_request_for_user_login() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isLoginRequestType()).thenReturn(true);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(new User(1L, "foo@bar.com", "123"));
		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test(expected = UserAlreadyExistInSystemException.class)
	public void test_should_throwException_when_userAlreadyExist_IncaseOfRegister() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isRegistrationRequestType()).thenReturn(true);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(new User(1L, "foo@bar.com", "123"));
		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}
	
	@Test(expected = UserNotExistingInSystemException.class)
	public void test_should_throwException_when_userNotExist_IncaseOfLogin() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isLoginRequestType()).thenReturn(true);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(null);
		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test
	public void test_should_validate_otp_request_for_password_reset() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isRegistrationRequestType()).thenReturn(false);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(new User(1L, "foo@bar.com", "123"));

		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test(expected = UserMobileNumberNotFoundException.class)
	public void test_should_throwException_whenmobilenumber_is_null() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isRegistrationRequestType()).thenReturn(false);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(new User(1L, "foo@bar.com", null));

		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test(expected = UserMobileNumberNotFoundException.class)
	public void test_should_throwException_whenmobilenumber_is_empty() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		when(otpRequest.isRegistrationRequestType()).thenReturn(false);
		when(userRepository.fetchUser(anyString(), anyString(), anyString())).thenReturn(new User(1L, "foo@bar.com", ""));

		otpService.sendOtp(otpRequest);

		verify(otpRequest).validate();
	}

	@Test
	public void test_should_send_smsm_otp_for_user_registration() {
		final OtpRequest otpRequest = mock(OtpRequest.class);
		final String otpNumber = "otpNumber";
		when(otpRepository.fetchOtp(otpRequest)).thenReturn(otpNumber);
		when(otpRequest.isRegistrationRequestType()).thenReturn(true);

		otpService.sendOtp(otpRequest);

		verify(otpSMSRepository).send(otpRequest, otpNumber);
	}

	@Test
	public void test_should_send_sms_otp_for_password_reset() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenant").mobileNumber("1234567890")
				.type(OtpRequestType.PASSWORD_RESET).userType("CITIZEN").build();
		final String otpNumber = "otpNumber";
		when(otpRepository.fetchOtp(otpRequest)).thenReturn(otpNumber);
		when(userRepository.fetchUser("1234567890", "tenant", "CITIZEN")).thenReturn(new User(1L, "foo@bar.com",
				"1234"));

		otpService.sendOtp(otpRequest);

		verify(otpSMSRepository).send(otpRequest, otpNumber);
	}

	@Test
	public void test_should_send_email_otp_for_password_reset() {
		final OtpRequest otpRequest = OtpRequest.builder().tenantId("tenant").mobileNumber("1234567890")
				.type(OtpRequestType.PASSWORD_RESET).userType("CITIZEN").build();
		final String otpNumber = "otpNumber";
		when(otpRepository.fetchOtp(otpRequest)).thenReturn(otpNumber);
		when(userRepository.fetchUser("1234567890", "tenant", "CITIZEN")).thenReturn(new User(1L, "foo@bar.com",
				"123"));

		otpService.sendOtp(otpRequest);

		verify(otpEmailRepository).send("foo@bar.com", otpNumber);
	}
}