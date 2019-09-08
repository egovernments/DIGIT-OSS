package org.egov.domain.exception;

import lombok.Getter;
import org.egov.domain.model.ValidateRequest;

public class InvalidTokenValidateRequestException extends RuntimeException {

    private static final long serialVersionUID = -8041669529008165462L;
    @Getter
    private ValidateRequest validateRequest;

    public InvalidTokenValidateRequestException(ValidateRequest validateRequest) {
        this.validateRequest = validateRequest;
    }
}

