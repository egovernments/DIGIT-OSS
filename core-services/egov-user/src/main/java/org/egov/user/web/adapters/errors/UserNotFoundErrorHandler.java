package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class UserNotFoundErrorHandler implements ErrorAdapter<Void> {

    private static final String USER_NOT_FOUND_CODE = "USER.USER_NOT_FOUND";
    private static final String USER_NOT_FOUND_MESSAGE = "User not found, Please check userId And tenantId";
    private static final String USER_ID_FIELD = "User.id";

    public ErrorResponse adapt(Void model) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(USER_NOT_FOUND_MESSAGE)
                .fields(getUserNameFieldError())
                .build();
    }

    private List<ErrorField> getUserNameFieldError() {
        return Collections.singletonList(
                ErrorField.builder()
                        .field(USER_ID_FIELD)
                        .code(USER_NOT_FOUND_CODE)
                        .message(USER_NOT_FOUND_MESSAGE)
                        .build()
        );
    }
}
