package org.egov.domain.exception;

import lombok.Getter;
import org.egov.domain.model.Token;

public class TokenUpdateException extends RuntimeException {

    private static final long serialVersionUID = -5189733065290610351L;
    @Getter
    private Token token;

    public TokenUpdateException(Token token) {
        this.token = token;
    }
}
