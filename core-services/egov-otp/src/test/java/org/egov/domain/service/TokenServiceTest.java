package org.egov.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.domain.exception.TokenAlreadyUsedException;
import org.egov.domain.exception.TokenValidationFailureException;
import org.egov.domain.model.Token;
import org.egov.domain.model.TokenRequest;
import org.egov.domain.model.TokenSearchCriteria;
import org.egov.domain.model.Tokens;
import org.egov.domain.model.ValidateRequest;
import org.egov.persistence.repository.TokenRepository;
import org.egov.web.util.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.context.*;
import org.springframework.security.crypto.bcrypt.*;

@RunWith(MockitoJUnitRunner.class)
public class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private LocalDateTimeFactory localDateTimeFactory;

    @InjectMocks
    private TokenService tokenService;

    private LocalDateTime now;

    @Before
    public void before() {
        now = LocalDateTime.now(ZoneId.of("UTC"));
        lenient().when(localDateTimeFactory.now()).thenReturn(now);
        this.tokenService = new TokenService(
                tokenRepository,
                new BCryptPasswordEncoder(),
                new OtpConfiguration(90,6, true)
        );
    }

    @Test
    public void test_should_save_new_token_with_given_identity_and_tenant() {
        final Token savedToken = Token.builder().build();
        final TokenRequest tokenRequest = mock(TokenRequest.class);
        final ValidateRequest validateRequest = mock(ValidateRequest.class);
        when(tokenRepository.save(any(Token.class))).thenReturn(savedToken);

        final Tokens tokens = mock(Tokens.class);
        lenient().when(tokenRepository.findByIdentityAndTenantId(validateRequest)).thenReturn(tokens);
        final Token actualToken = tokenService.create(tokenRequest);

        assertEquals(savedToken, actualToken);
    }

    @Test
    @Ignore
    public void test_should_validate_token_request() {
        final TokenRequest tokenRequest = mock(TokenRequest.class);


        tokenService.create(tokenRequest);

        verify(tokenRequest).validate();
    }

    @Test(expected = TokenValidationFailureException.class)
    public void test_should_throw_exception_when_no_matching_non_expired_token_is_present() {
        final ValidateRequest validateRequest = new ValidateRequest("tenant", "otpNumber", "identity");
        final Tokens tokens = mock(Tokens.class);
        lenient().when(tokens.hasSingleNonExpiredToken(now)).thenReturn(false);
        when(tokenRepository.findByIdentityAndTenantId(validateRequest)).thenReturn(tokens);
        //when(tokenRepository.findByNumberAndIdentityAndTenantIdLike(validateRequest)).thenReturn(tokens);

        tokenService.validate(validateRequest);
    }

    @Test(expected = TokenValidationFailureException.class)
    public void test_should_throw_exception_when_validatingtoken_already_validated() {
        final ValidateRequest validateRequest = new ValidateRequest("tenant", "otpNumber", "identity");
        Token token = Token.builder().uuid("").identity("test").validated(true)
                .timeToLiveInSeconds(300l).number("12345")
                .tenantId("default").createdTime(new Date().getTime()).build();
        List<Token> tokenList = new ArrayList<Token>();
        tokenList.add(token);
        Tokens tokens = new Tokens(tokenList);
        when(tokenRepository.findByIdentityAndTenantId(validateRequest)).thenReturn(tokens);

        final Token token1 = tokenService.validate(validateRequest);
        assertThat(token1.isValidated());
    }

    @Test
    public void test_should_return_token_when_token_is_successfully_updated_to_validated() {
        final ValidateRequest validateRequest = new ValidateRequest("tenant", "12345", "identity");
        Token token = Token.builder().uuid("").identity("test").validated(false)
                .timeToLiveInSeconds(300l).number(new BCryptPasswordEncoder().encode("12345"))
                .tenantId("default").createdTime(new Date().getTime()).build();
        List<Token> tokenList = new ArrayList<Token>();
        tokenList.add(token);
        Tokens tokens = new Tokens(tokenList);
        when(tokenRepository.findByIdentityAndTenantId(validateRequest)).thenReturn(tokens);
        final Token token1 = tokenService.validate(validateRequest);
        assertThat(token1.isValidated());
    }

    @Test
    public void test_should_return_otp_for_given_search_criteria() {
        final Token expectedToken = Token.builder().build();
        final TokenSearchCriteria searchCriteria = new TokenSearchCriteria("uuid", "tenant");
        when(tokenRepository.findBy(searchCriteria)).thenReturn(expectedToken);

        final Token actualToken = tokenService.search(searchCriteria);

        assertEquals(expectedToken, actualToken);
    }


}