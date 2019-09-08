package org.egov.user.web.adapters.errors;

import lombok.Getter;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

@Getter
public class UserDetailsErrorHandler implements ErrorAdapter<Void> {

    private static final String USER_DETAILS_NOT_FOUND_CODE = "USER_DETAILS_NOT_FOUND";
    private static final String USER_DETAILS_NOT_FOUND = "Error while fetching user details";
	private static final long serialVersionUID = -6686068213873485044L;

	public ErrorResponse adapt(Void model) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(USER_DETAILS_NOT_FOUND)
                .fields(getAcessTokenFieldError())
                .build();
    }

    private List<ErrorField> getAcessTokenFieldError() {
        return Collections.singletonList(
                ErrorField.builder()
                        .message(USER_DETAILS_NOT_FOUND)
                        .code(USER_DETAILS_NOT_FOUND_CODE)
                        .field("user")
                        .build()
        );
    }

}

