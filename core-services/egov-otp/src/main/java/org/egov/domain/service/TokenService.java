package org.egov.domain.service;

import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;

import java.util.UUID;

import org.egov.domain.exception.TokenAlreadyUsedException;
import org.egov.domain.exception.TokenValidationFailureException;
import org.egov.domain.model.Token;
import org.egov.domain.model.TokenRequest;
import org.egov.domain.model.TokenSearchCriteria;
import org.egov.domain.model.Tokens;
import org.egov.domain.model.ValidateRequest;
import org.egov.persistence.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TokenService {

	private TokenRepository tokenRepository;
	private static final int TTL_IN_SECONDS = 300;

	@Value("${egov.otp.length}")
	private int otpLength;

	@Autowired
	public TokenService(TokenRepository tokenRepository) {
		this.tokenRepository = tokenRepository;
	}

	public Token create(TokenRequest tokenRequest) {
		tokenRequest.validate();
		Token token = Token.builder().uuid(UUID.randomUUID().toString()).tenantId(tokenRequest.getTenantId())
				.identity(tokenRequest.getIdentity()).number(randomNumeric(otpLength))
				.timeToLiveInSeconds(tokenRequest.getTimeToLive()).build();
		return tokenRepository.save(token);
	}

	public Token validate(ValidateRequest validateRequest) {
		validateRequest.validate();
		Tokens tokens = tokenRepository.findByNumberAndIdentityAndTenantId(validateRequest);

		if (tokens != null && tokens.getTokens().isEmpty())
			tokens = tokenRepository.findByNumberAndIdentityAndTenantIdLike(validateRequest);

		Long currentTime = System.currentTimeMillis() / 1000;
		Long createdTime = 0l;

		if (tokens != null && tokens.getTokens() != null && !tokens.getTokens().isEmpty()) {
			Token token = tokens.getTokens().get(0);
			if (token.isValidated()) {
				throw new TokenAlreadyUsedException();
			}
			createdTime = token.getCreatedTime() / 1000;
		} else if (tokens.getTokens().isEmpty()) {
			throw new TokenValidationFailureException();
		}

		if (!((currentTime - createdTime) <= TTL_IN_SECONDS)) {
			log.info("Token validation failure for otp #", validateRequest.getOtp());
			throw new TokenValidationFailureException();
		}
		final Token matchingToken = tokens.getTokens().get(0);
		tokenRepository.markAsValidated(matchingToken);
		return matchingToken;
	}

	public Token search(TokenSearchCriteria searchCriteria) {
		return tokenRepository.findBy(searchCriteria);
	}
}
