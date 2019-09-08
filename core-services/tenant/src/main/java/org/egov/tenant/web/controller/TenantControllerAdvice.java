package org.egov.tenant.web.controller;

import org.egov.common.contract.response.ErrorResponse;
import org.egov.tenant.domain.exception.DuplicateTenantCodeException;
import org.egov.tenant.domain.exception.InvalidTenantDetailsException;
import org.egov.tenant.domain.exception.TenantInvalidCodeException;
import org.egov.tenant.web.adapter.DuplicateTenantCodeErrorAdapter;
import org.egov.tenant.web.adapter.TenantCodeErrorAdapter;
import org.egov.tenant.web.adapter.TenantCreateRequestErrorAdapter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class TenantControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidTenantDetailsException.class)
    public ErrorResponse handleInvalidTenantDetailsException(InvalidTenantDetailsException ex) {
        return new TenantCreateRequestErrorAdapter().adapt(ex.getTenant());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(DuplicateTenantCodeException.class)
    public ErrorResponse handleDuplicateTenantCodeException(DuplicateTenantCodeException ex) {
        return new DuplicateTenantCodeErrorAdapter().adapt(ex.getTenant());
    }
    
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(TenantInvalidCodeException.class)
    public ErrorResponse handleTenantCodeExitException(TenantInvalidCodeException ex) {
        return new TenantCodeErrorAdapter().adapt(ex.getTenant());
    }
}
