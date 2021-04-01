package org.egov.domain.exception;

import lombok.Getter;
import org.egov.domain.model.TokenRequest;

public class InvalidTokenRequestException extends RuntimeException {
    private static final long serialVersionUID = -1900986732529893867L;

    @Getter
    private TokenRequest tokenRequest;

    public InvalidTokenRequestException(TokenRequest tokenRequest) {

        this.tokenRequest = tokenRequest;
    }
}


