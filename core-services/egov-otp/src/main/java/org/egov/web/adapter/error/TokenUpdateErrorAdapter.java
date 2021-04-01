package org.egov.web.adapter.error;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.Token;
import org.springframework.http.HttpStatus;

import java.util.Collections;

public class TokenUpdateErrorAdapter implements ErrorAdapter<Token> {

    private static final String OTP_UPDATE_FAILURE_EXCEPTION = "OTP update unsuccessful";
    private static final String OTP_UPDATE_FAILURE_CODE = "OTP.UPDATE_FAILED";
    private static final String EMPTY = "";

    @Override
    public ErrorResponse adapt(Token model) {
        final Error error = Error.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(OTP_UPDATE_FAILURE_EXCEPTION)
                .fields(Collections.singletonList(getError()))
                .build();
        return new ErrorResponse(null, error);
    }

    private ErrorField getError() {
        return ErrorField.builder()
                .code(OTP_UPDATE_FAILURE_CODE)
                .message(OTP_UPDATE_FAILURE_EXCEPTION)
                .field(EMPTY)
                .build();
    }
}
