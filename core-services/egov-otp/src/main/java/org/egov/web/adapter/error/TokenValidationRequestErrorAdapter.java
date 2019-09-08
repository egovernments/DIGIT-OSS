package org.egov.web.adapter.error;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.domain.model.ValidateRequest;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class TokenValidationRequestErrorAdapter implements ErrorAdapter<ValidateRequest> {

    private static final String INVALID_OTP_VALIDATION_REQUEST = "Invalid OTP validation request";

    private static final String IDENTITY_MANDATORY_CODE = "OTP.IDENTITY_MANDATORY";
    private static final String IDENTITY_MANDATORY_MESSAGE = "Identity field is mandatory";
    private static final String IDENTITY_FIELD = "otp.identity";

    private static final String TENANT_MANDATORY_CODE = "OTP.TENANT_ID_MANDATORY";
    private static final String TENANT_MANDATORY_MESSAGE = "Tenant field is mandatory";
    private static final String TENANT_FIELD = "otp.tenantId";

    private static final String OTP_MANDATORY_CODE = "OTP.OTP_MANDATORY";
    private static final String OTP_MANDATORY_MESSAGE = "Otp field is mandatory";
    private static final String OTP_FIELD = "otp.otp";


    @Override
    public ErrorResponse adapt(ValidateRequest model) {
        final Error error = getError(model);
        return new ErrorResponse(null, error);
    }

    private Error getError(ValidateRequest model) {
        List<ErrorField> errorFields = getErrorFields(model);
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(INVALID_OTP_VALIDATION_REQUEST)
                .fields(errorFields)
                .build();
    }

    private List<ErrorField> getErrorFields(ValidateRequest model) {
        List<ErrorField> errorFields = new ArrayList<>();
        addTenantIdValidationErrors(model, errorFields);
        addIdentityValidationErrors(model, errorFields);
        addOtpValidationErrors(model, errorFields);
        return errorFields;
    }

    private void addOtpValidationErrors(ValidateRequest model, List<ErrorField> errorFields) {
        if (!model.isOtpAbsent()) {
            return;
        }
        final ErrorField latitudeErrorField = ErrorField.builder()
                .code(OTP_MANDATORY_CODE)
                .message(OTP_MANDATORY_MESSAGE)
                .field(OTP_FIELD)
                .build();
        errorFields.add(latitudeErrorField);
    }

    private void addIdentityValidationErrors(ValidateRequest model, List<ErrorField> errorFields) {
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

    private void addTenantIdValidationErrors(ValidateRequest model, List<ErrorField> errorFields) {
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
