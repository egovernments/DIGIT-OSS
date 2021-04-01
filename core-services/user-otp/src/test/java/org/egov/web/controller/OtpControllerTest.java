package org.egov.web.controller;

import org.egov.Resources;
import org.egov.TestConfiguration;
import org.egov.domain.exception.*;
import org.egov.domain.model.OtpRequest;
import org.egov.domain.model.OtpRequestType;
import org.egov.domain.service.OtpService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(OtpController.class)
@Import(TestConfiguration.class)
public class OtpControllerTest {

	private final static String TENANT_ID = "tenantId";
	private static final String OTP_NUMBER = "otpNumber";

	@Autowired
	private MockMvc mockMvc;

	private Resources resources = new Resources();

	@MockBean
	private OtpService otpService;

	@Test
	public void test_should_return_success_response_when_otp_is_sent() throws Exception {

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpSendRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().json(resources.getFileContents("otpSendSuccessResponse.json")));

		final OtpRequest expectedOtpRequest = new OtpRequest("mobileNumber", "tenantId", OtpRequestType.PASSWORD_RESET, "CITIZEN");
		verify(otpService).sendOtp(expectedOtpRequest);
	}

	@Test
	public void test_should_return_error_response_when_mandatory_fields_are_not_present_in_request() throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("", "", null, "CITIZEN");
		doThrow(new InvalidOtpRequestException(expectedOtpRequest)).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpRequestWithoutMandatoryFields.json")))
				.andExpect(status().isBadRequest())
				.andExpect(content().json(resources.getFileContents("otpMandatoryFieldsErrorResponse.json")));
	}

	@Test
	public void test_should_return_error_response_when_user_not_found_for_sending_forgot_password_otp()
			throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("", "", null, "CITIZEN");
		doThrow(new UserNotFoundException()).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpRequestWithoutMandatoryFields.json")))
				.andExpect(status().isBadRequest())
				.andExpect(content().json(resources.getFileContents("unknownMobileNumberErrorResponse.json")));
	}

	@Test
	public void test_should_return_error_response_when_user_alreadyExist_incaseoftypeisregister() throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("mobileNumber", "tenantId", OtpRequestType.REGISTER, "CITIZEN");
		doThrow(new UserAlreadyExistInSystemException()).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpSendRegisterRequest.json"))).andExpect(status().isBadRequest())
				.andExpect(content().json(resources.getFileContents("userAlreadyExistInSystemResponse.json")));
	}

	@Test
	public void test_should_return_error_response_when_user_doesntExist_incaseoftypeislogin() throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("mobileNumber", "tenantId", OtpRequestType.LOGIN, "CITIZEN");
		doThrow(new UserNotExistingInSystemException()).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpSendLoginRequest.json"))).andExpect(status().isBadRequest())
				.andExpect(content().json(resources.getFileContents("userNotExistInSytemResponse.json")));
	}

	@Test
	public void test_should_return_error_response_when_user_mobilenot_found_for_sending_forgot_password_otp()
			throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("", "", null, "CITIZEN");
		doThrow(new UserMobileNumberNotFoundException()).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("otpRequestWithoutMandatoryFields.json")))
				.andExpect(status().isBadRequest())
				.andExpect(content().json(resources.getFileContents("invalidMobileNumberErrorResponse.json")));
	}

	@Test
	public void test_should_return_error_message_when_unhandled_exception_occurs() throws Exception {
		final OtpRequest expectedOtpRequest = new OtpRequest("mobileNumber", "tenantId", null, "CITIZEN");
		final String exceptionMessage = "Some exception message";
		doThrow(new RuntimeException(exceptionMessage)).when(otpService).sendOtp(expectedOtpRequest);

		mockMvc.perform(post("/v1/_send").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("invalidOtpSendRequest.json")))
				.andExpect(status().isInternalServerError()).andExpect(content().string(exceptionMessage));
	}

}