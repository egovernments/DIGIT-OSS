package org.egov.user.domain.exception;


import lombok.Getter;

public class InvalidOtpException extends RuntimeException {

    private static final long serialVersionUID = -6903761146294214595L;
    @Getter
    private String errorMessage;

    public InvalidOtpException(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}