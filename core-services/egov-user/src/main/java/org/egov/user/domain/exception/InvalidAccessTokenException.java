package org.egov.user.domain.exception;

import lombok.Getter;

@Getter
public class InvalidAccessTokenException extends RuntimeException {

    public InvalidAccessTokenException() {
        super("Invalid Access Token Exception");
    }

}

