package org.egov.web.adapter.error;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.TokenSearchCriteria;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class TokenSearchErrorAdapter implements ErrorAdapter<TokenSearchCriteria> {

    private static final String INVALID_OTP_SEARCH_REQUEST = "Invalid OTP search request";

    private static final String ID_MANDATORY_CODE = "OTP.UUID_MANDATORY";
    private static final String ID_MANDATORY_MESSAGE = "UUID field is mandatory";
    private static final String ID_FIELD = "otp.uuid";

    private static final String TENANT_MANDATORY_CODE = "OTP.TENANT_ID_MANDATORY";
    private static final String TENANT_MANDATORY_MESSAGE = "Tenant field is mandatory";
    private static final String TENANT_FIELD = "otp.tenantId";

    @Override
    public ErrorResponse adapt(TokenSearchCriteria model) {
        final Error error = getError(model);
        return new ErrorResponse(null, error);
    }

    private Error getError(TokenSearchCriteria model) {
        List<ErrorField> errorFields = getErrorFields(model);
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(INVALID_OTP_SEARCH_REQUEST)
                .fields(errorFields)
                .build();
    }

    private List<ErrorField> getErrorFields(TokenSearchCriteria model) {
        List<ErrorField> errorFields = new ArrayList<>();
        addIdValidationErrors(model, errorFields);
        addTenantIdValidationErrors(model, errorFields);
        return errorFields;
    }

    private void addTenantIdValidationErrors(TokenSearchCriteria model, List<ErrorField> errorFields) {
        if (!model.isTenantIdAbsent()) {
            return;
        }
        final ErrorField longitudeErrorField = ErrorField.builder()
                .code(TENANT_MANDATORY_CODE)
                .message(TENANT_MANDATORY_MESSAGE)
                .field(TENANT_FIELD)
                .build();
        errorFields.add(longitudeErrorField);
    }

    private void addIdValidationErrors(TokenSearchCriteria model, List<ErrorField> errorFields) {
        if (!model.isIdAbsent()) {
            return;
        }
        final ErrorField longitudeErrorField = ErrorField.builder()
                .code(ID_MANDATORY_CODE)
                .message(ID_MANDATORY_MESSAGE)
                .field(ID_FIELD)
                .build();
        errorFields.add(longitudeErrorField);
    }

}
