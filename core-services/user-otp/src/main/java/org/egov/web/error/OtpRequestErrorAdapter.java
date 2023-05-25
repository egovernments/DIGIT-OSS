package org.egov.web.error;

import org.egov.domain.model.OtpRequest;
import org.egov.web.contract.Error;
import org.egov.web.contract.ErrorField;
import org.egov.web.contract.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class OtpRequestErrorAdapter implements ErrorAdapter<OtpRequest> {

    private static final String INVALID_OTP_REQUEST = "Invalid OTP request";

    private static final String TENANT_MANDATORY_CODE = "OTP.TENANT_ID_MANDATORY";
    private static final String TENANT_MANDATORY_MESSAGE = "Tenant field is mandatory";
    private static final String TENANT_FIELD = "otp.tenantId";

    private static final String MOBILE_MANDATORY_CODE = "OTP.MOBILE_NUMBER_MANDATORY";
    private static final String MOBILE_MANDATORY_MESSAGE = "Mobile number field is mandatory";
    private static final String MOBILE_FIELD = "otp.mobileNumber";

	private static final String TYPE_INVALID_CODE = "OTP.REQUEST_TYPE_MANDATORY";
	private static final String TYPE_INVALID_MESSAGE = "Request type (register, passwordreset,login) is mandatory";
	private static final String TYPE_FIELD = "otp.type";
	
	private static final String MOBILE_INVALID_CODE = "OTP.MOBILE_NUMBER_INVALID";
	private static final String MOBILE_INVALID_MESSAGE = "Mobile number field should be numeric.";
	private static final String MOBILE_INVALID_FIELD = "otp.mobileNumber";

	private static final String MOBILE_INVALIDLENGTH_CODE = "OTP.MOBILE_NUMBER_INVALIDLENGTH";
	private static final String MOBILE_INVALIDLENGTH_MESSAGE = "Mobile number length should be min 10 and max 13 digits";
	private static final String MOBILE_INVALIDLENGTH_FIELD = "otp.mobileNumber";

    @Override
    public ErrorResponse adapt(OtpRequest model) {
        final Error error = getError(model);
        return new ErrorResponse(null, error);
    }

    private Error getError(OtpRequest model) {
        List<ErrorField> errorFields = getErrorFields(model);
        return Error.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message(INVALID_OTP_REQUEST)
                .fields(errorFields)
                .build();
    }

    private List<ErrorField> getErrorFields(OtpRequest model) {
        List<ErrorField> errorFields = new ArrayList<>();
        addTenantIdValidationErrors(model, errorFields);
        addMobileNumberValidationErrors(model, errorFields);
        addRequestTypeValidationErrors(model, errorFields);
        addMobileNumberInvalidValidationErrors(model, errorFields);
		addMobileNumberValidLengthValidationError(model, errorFields);
        return errorFields;
    }

	private void addRequestTypeValidationErrors(OtpRequest model, List<ErrorField> errorFields) {
		if (!model.isInvalidType()) {
			return;
		}
		final ErrorField latitudeErrorField = ErrorField.builder()
				.code(TYPE_INVALID_CODE)
				.message(TYPE_INVALID_MESSAGE)
				.field(TYPE_FIELD)
				.build();
		errorFields.add(latitudeErrorField);
	}

	private void addMobileNumberValidationErrors(OtpRequest model, List<ErrorField> errorFields) {
        if (!model.isMobileNumberAbsent()) {
            return;
        }
        final ErrorField latitudeErrorField = ErrorField.builder()
                .code(MOBILE_MANDATORY_CODE)
                .message(MOBILE_MANDATORY_MESSAGE)
                .field(MOBILE_FIELD)
                .build();
        errorFields.add(latitudeErrorField);
    }

    private void addTenantIdValidationErrors(OtpRequest model, List<ErrorField> errorFields) {
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
    
	private void addMobileNumberValidLengthValidationError(OtpRequest model, List<ErrorField> errorFields) {
		if (!model.isMobileNumberValidLength()) {
			return;
		}
		final ErrorField latitudeErrorField = ErrorField.builder().code(MOBILE_INVALIDLENGTH_CODE)
				.message(MOBILE_INVALIDLENGTH_MESSAGE).field(MOBILE_INVALIDLENGTH_FIELD).build();
		errorFields.add(latitudeErrorField);
	}

	private void addMobileNumberInvalidValidationErrors(OtpRequest model, List<ErrorField> errorFields) {
		if (!model.isMobileNumberNumeric()) {
			return;
		}
		final ErrorField latitudeErrorField = ErrorField.builder().code(MOBILE_INVALID_CODE)
				.message(MOBILE_INVALID_MESSAGE).field(MOBILE_INVALID_FIELD).build();
		errorFields.add(latitudeErrorField);
	}

}
