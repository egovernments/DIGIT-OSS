package org.egov.user.web.adapters.errors;

import lombok.Getter;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

@Getter
public class InvalidAccessTokenErrorHandler {

    private static final String ACCESS_TOKEN_NOT_FOUND_CODE = "ACCESS_TOKEN_NOT_FOUND";
    private static final String ACCESS_TOKEN_NOT_FOUND = "Access Token Not Found";

	public ErrorResponse adapt() {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(ACCESS_TOKEN_NOT_FOUND)
                .fields(getAcessTokenFieldError())
                .build();
    }

    private List<ErrorField> getAcessTokenFieldError() {
        return Collections.singletonList(
                ErrorField.builder()
                        .message(ACCESS_TOKEN_NOT_FOUND)
                        .code(ACCESS_TOKEN_NOT_FOUND_CODE)
                        .field("access_token")
                        .build()
        );
    }

}

