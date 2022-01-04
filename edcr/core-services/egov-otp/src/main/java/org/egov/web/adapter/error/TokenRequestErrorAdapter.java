package org.egov.web.adapter.error;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.TokenRequest;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class TokenRequestErrorAdapter implements ErrorAdapter<TokenRequest> {

    private static final String INVALID_OTP_REQUEST = "Invalid OTP request";

    private static final String IDENTITY_MANDATORY_CODE = "OTP.IDENTITY_MANDATORY";
    private static final String IDENTITY_MANDATORY_MESSAGE = "Identity field is mandatory";
    private static final String IDENTITY_FIELD = "otp.identity";

    private static final String TENANT_MANDATORY_CODE = "OTP.TENANT_ID_MANDATORY";
    private static final String TENANT_MANDATORY_MESSAGE = "Tenant field is mandatory";
    private static final String TENANT_FIELD = "otp.tenantId";


    @Override
    public ErrorResponse adapt(TokenRequest model) {
        final Error error = getError(model);
        return new ErrorResponse(null, error);
    }

    private Error getError(TokenRequest model) {
        List<ErrorField> errorFields = getErrorFields(model);
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(INVALID_OTP_REQUEST)
                .fields(errorFields)
                .build();
    }

    private List<ErrorField> getErrorFields(TokenRequest model) {
        List<ErrorField> errorFields = new ArrayList<>();
        addTenantIdValidationErrors(model, errorFields);
        addIdentityValidationErrors(model, errorFields);
        return errorFields;
    }

    private void addIdentityValidationErrors(TokenRequest model, List<ErrorField> errorFields) {
        if (!model.isIdentityAbsent()) {
            return;
        }
        final ErrorField latitudeErrorField = ErrorField.builder()
                .code(IDENTITY_MANDATORY_CODE)
                .message(IDENTITY_MANDATORY_MESSAGE)
                .field(IDENTITY_FIELD)
                .build();
        errorFields.add(latitudeErrorField);
    }

    private void addTenantIdValidationErrors(TokenRequest model, List<ErrorField> errorFields) {
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

}
