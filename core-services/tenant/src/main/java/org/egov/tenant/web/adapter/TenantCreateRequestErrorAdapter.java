package org.egov.tenant.web.adapter;


import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.tenant.domain.model.Tenant;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class TenantCreateRequestErrorAdapter implements ErrorAdapter<Tenant> {

    private static final String INVALID_TENANT_OBJECT = "Invalid tenant object";

    private static final String TENANT_MISSING_CODE = "core-tenant.TENANT_CODE_MANDATORY";
    private static final String TENANT_FIELD_CODE = "code";
    private static final String TENANT_MISSING_CODE_MESSAGE = "Tenant code is required";
    private static final String TENANT_CODE_INVALID_LENGTH = "core-tenant.TENANT_CODE_LENGTH";
    private static final String TENANT_CODE_INVALID_LENGTH_MESSAGE = "Tenant code should be less than 256 characters";

    private static final String TENANT_MISSING_IMAGE_ID = "core-tenant.TENANT_MISSING_IMAGE_ID";
    private static final String TENANT_FIELD_IMAGE_ID = "imageId";
    private static final String TENANT_MISSING_IMAGE_ID_MESSAGE = "imageId is required";

    private static final String TENANT_MISSING_LOGO_ID = "core-tenant.TENANT_MISSING_LOGO_ID";
    private static final String TENANT_FIELD_LOGO_ID = "logoId";
    private static final String TENANT_MISSING_LOGO_ID_MESSAGE = "logoId is required";

    private static final String TENANT_MISSING_TYPE = "core-tenant.TENANT_MISSING_TYPE";
    private static final String TENANT_INVALID_TYPE = "core-tenant.TENANT_INVALID_TYPE";
    private static final String TENANT_FIELD_TYPE = "type";
    private static final String TENANT_MISSING_TYPE_MESSAGE = "type is required";
    private static final String TENANT_INVALID_TYPE_MESSAGE = "type is invalid";

    private static final String TENANT_MISSING_CITY = "core-tenant.TENANT_MISSING_CITY";
    private static final String TENANT_FIELD_CITY = "city";
    private static final String TENANT_MISSING_CITY_MESSAGE = "city is required";

    private static final String TENANT_MISSING_CITY_NAME = "core-tenant.TENANT_MISSING_CITY_NAME";
    private static final String TENANT_FIELD_CITY_NAME = "city.name";
    private static final String TENANT_MISSING_CITY_NAME_MESSAGE = "city.name is required";

    private static final String TENANT_MISSING_ULB_GRADE = "core-tenant.TENANT_MISSING_ULB_GRADE";
    private static final String TENANT_FIELD_ULB_GRADE = "city.ulbGrade";
    private static final String TENANT_MISSING_ULB_GRADE_MESSAGE = "city.ulbGrade is required";
    
    
    private static final String TENANT_CONTACTNUMBER_INVALID_LENGTH="core-tenant.TENANT_CONTACTNUMBER_LENGTH";
    private static final String TENANT_FIELD_CONTACTNUMBER ="contactNumber";
    private static final String TENANT_CONTACTNUMBER_INVALID_LENGTH_MESSAGE ="Tenant contactNumber should be 16 characters";
    
    private static final String TENANT_HELPLINENUMBER_INVALID_LENGTH="core-tenant.TENANT_HELPLINENUMBER_LENGTH";
    private static final String TENANT_FIELD_HELPLINENUMBER ="helpLineNumber";
    private static final String TENANT_HELPLINENUMBER_INVALID_LENGTH_MESSAGE ="Tenant HELPLINENUMBER should be 16 characters";
    
    @Override
    public ErrorResponse adapt(Tenant tenant) {
        final Error error = getError(tenant);
        return ErrorResponse.builder()
            .error(error)
            .build();
    }

    private Error getError(Tenant tenant) {
        List<ErrorField> errorFields = getErrorFields(tenant);
        return Error.builder()
            .code(HttpStatus.BAD_REQUEST.value())
            .message(INVALID_TENANT_OBJECT)
            .fields(errorFields)
            .build();
    }

    private List<ErrorField> getErrorFields(Tenant tenant) {
        List<ErrorField> errorFields = new ArrayList<>();
        addCodeMissingError(tenant, errorFields);
        addCodeLengthError(tenant, errorFields);
        addImageIdMissingError(tenant, errorFields);
        addLogoIdMissingError(tenant, errorFields);
        addTypeMissingError(tenant, errorFields);
        addTypeInvalidError(tenant, errorFields);
        addCityMissingError(tenant, errorFields);
        addContactNumberLengthError(tenant,errorFields);
        addHelpLineNumberLengthError(tenant,errorFields);
        return errorFields;
    }

    private void addCityMissingError(Tenant tenant, List<ErrorField> errorFields) {
        if (tenant.isCityAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_CITY).field(TENANT_FIELD_CITY).message(TENANT_MISSING_CITY_MESSAGE).build()
            );
            return;
        }
        if (tenant.getCity().isNameAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_CITY_NAME)
                    .field(TENANT_FIELD_CITY_NAME)
                    .message(TENANT_MISSING_CITY_NAME_MESSAGE)
                    .build()
            );
        }
        if (tenant.getCity().isULBGradeAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_ULB_GRADE)
                    .field(TENANT_FIELD_ULB_GRADE)
                    .message(TENANT_MISSING_ULB_GRADE_MESSAGE)
                    .build()
            );
        }
    }

    private void addTypeMissingError(Tenant tenant, List<ErrorField> errorFields) {
        if (tenant.isTypeAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_TYPE).field(TENANT_FIELD_TYPE).message(TENANT_MISSING_TYPE_MESSAGE).build()
            );
        }
    }

    private void addTypeInvalidError(Tenant tenant, List<ErrorField> errorFields) {
        if (!tenant.isTypeAbsent() && tenant.isTypeInvalid()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_INVALID_TYPE).field(TENANT_FIELD_TYPE).message(TENANT_INVALID_TYPE_MESSAGE).build()
            );
        }
    }

    private void addLogoIdMissingError(Tenant tenant, List<ErrorField> errorFields) {
        if (tenant.isLogoIdAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_LOGO_ID).field(TENANT_FIELD_LOGO_ID).message(TENANT_MISSING_LOGO_ID_MESSAGE)
                    .build()
            );
        }
    }

    private void addImageIdMissingError(Tenant tenant, List<ErrorField> errorFields) {
        if (tenant.isImageIdAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_IMAGE_ID).field(TENANT_FIELD_IMAGE_ID).message
                    (TENANT_MISSING_IMAGE_ID_MESSAGE).build()
            );
        }
    }

    private void addCodeLengthError(Tenant tenant, List<ErrorField> errorFields) {
        if (!tenant.isCodeAbsent() && tenant.isCodeOfInvalidLength()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_CODE_INVALID_LENGTH).field(TENANT_FIELD_CODE).message
                    (TENANT_CODE_INVALID_LENGTH_MESSAGE).build()
            );
        }
    }

    private void addCodeMissingError(Tenant tenant, List<ErrorField> errorFields) {
        if (tenant.isCodeAbsent()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_MISSING_CODE).field(TENANT_FIELD_CODE).message(TENANT_MISSING_CODE_MESSAGE).build()
            );
        }
    }
    
    
    private void addContactNumberLengthError(Tenant tenant, List<ErrorField> errorFields){
    	
    	 if (tenant.isContactNumberInvalidLength()) {
             errorFields.add(
                 ErrorField.builder()
                     .code(TENANT_CONTACTNUMBER_INVALID_LENGTH).field(TENANT_FIELD_CONTACTNUMBER).message(TENANT_CONTACTNUMBER_INVALID_LENGTH_MESSAGE).build()
             );
         }
    }
    
    private void addHelpLineNumberLengthError(Tenant tenant, List<ErrorField> errorFields){
    	
   	 if (tenant.isHelpLineNumberInvalidLength()) {
            errorFields.add(
                ErrorField.builder()
                    .code(TENANT_HELPLINENUMBER_INVALID_LENGTH).field(TENANT_FIELD_HELPLINENUMBER).message(TENANT_HELPLINENUMBER_INVALID_LENGTH_MESSAGE).build()
            );
        }
   }
    
}
