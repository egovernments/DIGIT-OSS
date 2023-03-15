package org.egov.domain.exception;

import lombok.Getter;
import org.egov.domain.model.OtpRequest;

public class InvalidOtpRequestException extends RuntimeException {
    private static final long serialVersionUID = 8296991087364414970L;
    @Getter
    private OtpRequest otpRequest;

    public InvalidOtpRequestException(OtpRequest otpRequest) {

        this.otpRequest = otpRequest;
    }
}

