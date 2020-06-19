package org.egov.domain.service;

import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

import java.util.UUID;

import org.egov.domain.exception.TokenValidationFailureException;
import org.egov.domain.model.Token;
import org.egov.domain.model.TokenRequest;
import org.egov.domain.model.TokenSearchCriteria;
import org.egov.domain.model.Tokens;
import org.egov.domain.model.ValidateRequest;
import org.egov.persistence.repository.TokenRepository;
import org.egov.web.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TokenService {

    private TokenRepository tokenRepository;

    private OtpConfiguration otpConfiguration;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public TokenService(TokenRepository tokenRepository, PasswordEncoder passwordEncoder, OtpConfiguration otpConfiguration) {
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpConfiguration = otpConfiguration;
    }

    public Token create(TokenRequest tokenRequest) {
        tokenRequest.validate();

        String originalOtp = randomNumeric(otpConfiguration.getOtpLength());
        String encryptedOtp = originalOtp;

        if (otpConfiguration.isEncryptOTP()){
            encryptedOtp = passwordEncoder.encode(originalOtp);
        }

        Token token = Token.builder().uuid(UUID.randomUUID().toString()).tenantId(tokenRequest.getTenantId())
                .identity(tokenRequest.getIdentity()).number(encryptedOtp)
                .timeToLiveInSeconds(otpConfiguration.getTtl()).build();
        token = tokenRepository.save(token);
        token.setNumber(originalOtp);
        return token;
    }

    public Token validate(ValidateRequest validateRequest) {
        validateRequest.validate();

        Tokens tokens = tokenRepository.findByIdentityAndTenantId(validateRequest);

        if (tokens == null || tokens.getTokens().isEmpty())
            throw new TokenValidationFailureException();

        for (Token t: tokens.getTokens()) {

            if (!otpConfiguration.isEncryptOTP() && validateRequest.getOtp().equalsIgnoreCase(t.getNumber())
             || (otpConfiguration.isEncryptOTP()  && passwordEncoder.matches(validateRequest.getOtp(), t.getNumber()))) {
                tokenRepository.markAsValidated(t);
                return t;
            }
        }
        throw new TokenValidationFailureException();
    }

    public Token search(TokenSearchCriteria searchCriteria) {
        return tokenRepository.findBy(searchCriteria);
    }
}
