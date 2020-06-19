package org.egov.web.controller;

import org.egov.Resources;
import org.egov.domain.exception.*;
import org.egov.domain.model.Token;
import org.egov.domain.model.TokenRequest;
import org.egov.domain.model.TokenSearchCriteria;
import org.egov.domain.model.ValidateRequest;
import org.egov.domain.service.TokenService;
import org.egov.persistence.repository.*;
import org.egov.web.util.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.*;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(OtpController.class)
@Ignore
public class OtpControllerTest {

    private final static String IDENTITY = "identity";
    private final static String TENANT_ID = "tenantId";
    private static final String OTP_NUMBER = "otpNumber";

    @Autowired
    private MockMvc mockMvc;

    private Resources resources = new Resources();

    @MockBean
    @InjectMocks
    private TokenService tokenService;

    @Mock
    private TokenRepository tokenRepository;

    @Before
    public void before() {
        this.tokenService = new TokenService(
                tokenRepository,
                new BCryptPasswordEncoder(),
                new OtpConfiguration(90,6, true)
        );
    }

    @Test
    public void test_should_return_token() throws Exception {

        final Token token = Token.builder()
                .uuid("uuid")
                .identity(IDENTITY)
                .tenantId(TENANT_ID)
                .number("randomNumber")
                .build();
        final TokenRequest tokenRequest = new TokenRequest(IDENTITY, TENANT_ID);
        when(tokenService.create(tokenRequest)).thenReturn(token);

        mockMvc.perform(post("/v1/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("createOtpRequest.json")))
                .andExpect(status().isCreated())
                .andExpect(content().json(resources.getFileContents("createOtpResponse.json")));
    }

    @Test
    public void test_should_return_token_for_given_search_criteria() throws Exception {
        final Token token = Token.builder()
                .uuid("uuid")
                .identity(IDENTITY)
                .tenantId(TENANT_ID)
                .number("randomNumber")
                .build();
        final String uuid = "uuid";
        when(tokenService.search(new TokenSearchCriteria(uuid, TENANT_ID))).thenReturn(token);

        mockMvc.perform(post("/v1/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("otpSearchRequest.json")))
                .andExpect(status().isOk())
                .andExpect(content().json(resources.getFileContents("createOtpResponse.json")));
    }

    @Test
    public void test_should_return_success_response_when_validation_is_successful() throws Exception {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(OTP_NUMBER)
                .tenantId(TENANT_ID)
                .identity(IDENTITY)
                .build();
        final Token token = Token.builder()
                .validated(true)
                .tenantId(TENANT_ID)
                .number(OTP_NUMBER)
                .identity(IDENTITY)
                .uuid("uuid")
                .build();
        when(tokenService.validate(validateRequest)).thenReturn(token);

        mockMvc.perform(post("/v1/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("validateOtpRequest.json")))
                .andExpect(status().isOk())
                .andExpect(content().json(resources.getFileContents("successOtpValidationResponse.json")));
    }

    @Test
    public void test_should_return_error_response_when_otp_validation_request_is_not_valid() throws Exception {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp("")
                .tenantId("")
                .identity("")
                .build();
        when(tokenService.validate(validateRequest))
                .thenThrow(new InvalidTokenValidateRequestException(validateRequest));

        mockMvc.perform(post("/v1/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("invalidOtpValidationRequest.json")))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(resources.getFileContents("errorOtpValidationResponse.json")));
    }

    @Test
    public void test_should_return_error_response_when_otp_update_is_not_successful() throws Exception {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(OTP_NUMBER)
                .tenantId(TENANT_ID)
                .identity(IDENTITY)
                .build();
        final Token token = Token.builder().build();
        when(tokenService.validate(validateRequest))
                .thenThrow(new TokenUpdateException(token));

        mockMvc.perform(post("/v1/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("validateOtpRequest.json")))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(resources.getFileContents("otpUpdateErrorResponse.json")));
    }

    @Test
    public void test_should_return_error_response_when_otp_validate_is_not_successful() throws Exception {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(OTP_NUMBER)
                .tenantId(TENANT_ID)
                .identity(IDENTITY)
                .build();
        when(tokenService.validate(validateRequest))
                .thenThrow(new TokenValidationFailureException());

        mockMvc.perform(post("/v1/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("validateOtpRequest.json")))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(resources.getFileContents("otpValidateFailureErrorResponse.json")));
    }

    @Test
    public void test_should_return_error_response_when_otp_validate() throws Exception {
        final ValidateRequest validateRequest = ValidateRequest.builder()
                .otp(OTP_NUMBER)
                .tenantId(TENANT_ID)
                .identity(IDENTITY)
                .build();
        when(tokenService.validate(validateRequest))
                .thenThrow(new TokenAlreadyUsedException());

        mockMvc.perform(post("/v1/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("validateOtpRequest.json")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void test_should_return_error_response_when_token_request_is_not_valid() throws Exception {
        final TokenRequest tokenRequest = new TokenRequest("", "");
        when(tokenService.create(tokenRequest)).thenThrow(new InvalidTokenRequestException(tokenRequest));

        mockMvc.perform(post("/v1/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("invalidOtpRequest.json")))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(resources.getFileContents("invalidOtpResponse.json")));
    }

    @Test
    public void test_should_return_error_response_when_search_is_not_valid() throws Exception {
        final TokenSearchCriteria searchCriteria = new TokenSearchCriteria("", "");
        final InvalidTokenSearchCriteriaException exception =
                new InvalidTokenSearchCriteriaException(searchCriteria);
        when(tokenService.search(searchCriteria)).thenThrow(exception);

        mockMvc.perform(post("/v1/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(resources.getFileContents("invalidOtpSearchRequest.json")))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(resources.getFileContents("invalidOtpSearchResponse.json")));
    }

}