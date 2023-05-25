package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class OtpValidationErrorAdapter implements ErrorAdapter<Void> {

    private static final String OTP_FIELD = "User.otpReference";
    private static final String OTP_VALIDATION_CODE = "core-user.006";
    private static final String OTP_VALIDATION_MSG = "Otp validation is pending.";
    private static final String OTP_VALIDATION_PENDING = "Otp validation is pending.";

    public ErrorResponse adapt(Void model) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(OTP_VALIDATION_PENDING)
                .fields(getOtpFieldError())
                .build();
    }

    private List<ErrorField> getOtpFieldError() {
        return Collections.singletonList(
                ErrorField.builder().
                        field(OTP_FIELD).
                        code(OTP_VALIDATION_CODE).
                        message(OTP_VALIDATION_MSG).build()
        );
    }
}
