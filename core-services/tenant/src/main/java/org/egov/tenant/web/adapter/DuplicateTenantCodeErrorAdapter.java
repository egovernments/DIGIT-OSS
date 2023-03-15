package org.egov.tenant.web.adapter;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.tenant.domain.model.Tenant;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class DuplicateTenantCodeErrorAdapter implements ErrorAdapter<Tenant> {

    private static final String DUPLICATE_TENANT_CODE = "TENANT.TENANT_CODE_ALREADY_EXISTS";
    private static final String DUPLICATE_TENANT_CODE_MESSAGE = "Tenant code already exists";
    private static final String TENANT_CODE_FIELD = "code";

    public ErrorResponse adapt(Tenant tenant) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
            .code(HttpStatus.BAD_REQUEST.value())
            .message(DUPLICATE_TENANT_CODE_MESSAGE)
            .fields(getUserNameFieldError())
            .build();
    }

    private List<ErrorField> getUserNameFieldError() {
        return Collections.singletonList(
            ErrorField.builder()
                .field(TENANT_CODE_FIELD)
                .code(DUPLICATE_TENANT_CODE)
                .message(DUPLICATE_TENANT_CODE_MESSAGE)
                .build()
        );
    }
}

