package org.egov.tenant.web.adapter;


import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.tenant.domain.model.Tenant;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class TenantCodeErrorAdapter implements ErrorAdapter<Tenant> {

    private static final String VALID_TENANT_CODE = "TENANT.TENANT_CODE_DOES_NOT_EXIT";
    private static final String VALID_TENANT_CODE_MESSAGE = "Tenant Code Does Not Exit";
    private static final String VALID_TENANT_CODE_FIELD = "code";

    public ErrorResponse adapt(Tenant tenant) {
        final Error error = getError();
        return new ErrorResponse(null, error);
    }

    private Error getError() {
        return Error.builder()
            .code(HttpStatus.BAD_REQUEST.value())
            .message(VALID_TENANT_CODE_MESSAGE)
            .fields(getTenantCodeFieldError())
            .build();
    }

    private List<ErrorField> getTenantCodeFieldError() {
        return Collections.singletonList(
            ErrorField.builder()
                .field(VALID_TENANT_CODE_FIELD)
                .code(VALID_TENANT_CODE)
                .message(VALID_TENANT_CODE_MESSAGE)
                .build()
        );
    }
}