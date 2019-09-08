package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.UserSearchCriteria;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class InvalidUserSearchRequestErrorHandler implements ErrorAdapter<UserSearchCriteria> {

    private static final String TENANT_ID_MANDATORY_CODE = "USER.TENANT_ID_MANDATORY";
    private static final String TENANT_ID_MANDATORY_MESSAGE = "Tenant id is mandatory";
    private static final String TENANT_ID_FIELD = "tenantId";
    private static final String USER_SEARCH_REQUEST_INVALID_MESSAGE = "User search request is invalid";

    public ErrorResponse adapt(UserSearchCriteria user) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(USER_SEARCH_REQUEST_INVALID_MESSAGE)
                .fields(getTenantIdError())
                .build();
    }

    private List<ErrorField> getTenantIdError() {
        return Collections.singletonList(
                ErrorField.builder()
                        .field(TENANT_ID_FIELD)
                        .code(TENANT_ID_MANDATORY_CODE)
                        .message(TENANT_ID_MANDATORY_MESSAGE)
                        .build()
        );
    }
}

