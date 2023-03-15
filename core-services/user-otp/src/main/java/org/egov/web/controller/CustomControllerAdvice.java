package org.egov.web.controller;

import org.egov.domain.exception.InvalidOtpRequestException;
import org.egov.domain.exception.UserAlreadyExistInSystemException;
import org.egov.domain.exception.UserMobileNumberNotFoundException;
import org.egov.domain.exception.UserNotExistingInSystemException;
import org.egov.domain.exception.UserNotFoundException;
import org.egov.web.contract.ErrorResponse;
import org.egov.web.error.OtpRequestErrorAdapter;
import org.egov.web.error.UserAlreadyExistErrorAdapter;
import org.egov.web.error.UserMobileNumberNotFoundErrorAdapter;
import org.egov.web.error.UserNotExistErrorAdapter;
import org.egov.web.error.UserNotFoundErrorAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class CustomControllerAdvice {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidOtpRequestException.class)
    public ErrorResponse handleInvalidOtpRequestException(InvalidOtpRequestException ex) {
        return new OtpRequestErrorAdapter().adapt(ex.getOtpRequest());
    }

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserNotFoundException.class)
	public ErrorResponse handleUserNotFoundException() {
		return new UserNotFoundErrorAdapter().adapt(null);
	}
	
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserMobileNumberNotFoundException.class)
	public ErrorResponse handleUserMobileNumberNotFoundException() {
		return new UserMobileNumberNotFoundErrorAdapter().adapt(null);
	}
	
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserAlreadyExistInSystemException.class)
	public ErrorResponse handleUserAlreadyExistException() {
		return new UserAlreadyExistErrorAdapter().adapt(null);
	}
	
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(UserNotExistingInSystemException.class)
	public ErrorResponse handleUserNotExistException() {
		return new UserNotExistErrorAdapter().adapt(null);
	}

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public String handleServerError(Exception ex) {
        logger.error(ex.getMessage(), ex);
        return ex.getMessage();
    }

}
