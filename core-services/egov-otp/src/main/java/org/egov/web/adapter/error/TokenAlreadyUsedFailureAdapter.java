package org.egov.web.adapter.error;

import java.util.Collections;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.Token;
import org.springframework.http.HttpStatus;

public class TokenAlreadyUsedFailureAdapter implements ErrorAdapter<Token> {

    private static final String OTP_VALIDATION_FAILED_MESSAGE = "Otp Is Already Used. ";
    private static final String OTP_VALIDATION_FAILED_CODE = "OTP.VALIDATION_UNSUCCESSFUL";
    public static final String OTP_FIELD = "otp.otp";

    @Override
    public ErrorResponse adapt(Token model) {
        final Error error = Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(OTP_VALIDATION_FAILED_MESSAGE)
                .fields(Collections.singletonList(getError()))
                .build();
        return new ErrorResponse(null, error);
    }

    private ErrorField getError() {
        return ErrorField.builder()
                .code(OTP_VALIDATION_FAILED_CODE)
                .message(OTP_VALIDATION_FAILED_MESSAGE)
                .field(OTP_FIELD)
                .build();
    }
}
 
