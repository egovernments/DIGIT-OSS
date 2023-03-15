package org.egov.egf.master.web.advice;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.exception.UnauthorizedAccessException;
import org.egov.common.persistence.repository.JdbcRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class CustomControllerAdvice {

	private static final Logger LOG = LoggerFactory.getLogger(CustomControllerAdvice.class);

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public String handleMissingParamsError(Exception ex) {
		return ex.getMessage();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(CustomBindException.class)
	public org.egov.common.web.contract.ErrorResponse handleBindingErrors(CustomBindException ex) {
		org.egov.common.web.contract.ErrorResponse errRes = new org.egov.common.web.contract.ErrorResponse();
		//errRes.setErrors(new ArrayList<>());
		BindingResult errors = ex.getErrors();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		errRes.setResponseInfo(responseInfo);
		org.egov.common.web.contract.Error error = new org.egov.common.web.contract.Error();
		if (errors.getGlobalError() != null) {
			if (errors.getGlobalError().getCode() != null) {
				error.setCode(errors.getGlobalError().getCode());
				error.setMessage(errors.getGlobalError().getObjectName());
				error.setDescription(errors.getGlobalError().getDefaultMessage());
			} else if (ErrorCode.getError(errors.getGlobalError().getCode()) != null) {
				error.setCode(ErrorCode.getError(errors.getGlobalError().getDefaultMessage()).getCode());
				String message = MessageFormat.format(
						ErrorCode.getError(errors.getGlobalError().getDefaultMessage()).getMessage(),
						errors.getGlobalError().getObjectName());
				error.setMessage(message);
				String desc = MessageFormat.format(
						ErrorCode.getError(errors.getGlobalError().getDefaultMessage()).getDescription(),
						errors.getGlobalError().getObjectName());
				error.setDescription(desc);
			}
			errRes.getErrors().add(error);

		}
		  /*if (errors.getFieldErrorCount() > 0) {
				error.setDescription("Validation errors");
			}
		*/
				
		if (errors.hasFieldErrors()) {
			List<org.springframework.validation.FieldError> fieldErrors = errors.getFieldErrors();
			for (org.springframework.validation.FieldError errs : fieldErrors) {
				org.egov.common.web.contract.Error err = new org.egov.common.web.contract.Error();
				if (ErrorCode.getError(errs.getCode()) != null) {
					err.setCode(errs.getCode());
					String message = MessageFormat.format(ErrorCode.getError(errs.getCode()).getMessage(),
							errs.getField(), errs.getRejectedValue());
					err.setMessage(message);
					String desc = MessageFormat.format(ErrorCode.getError(errs.getCode()).getDescription(),
							errs.getField(), errs.getRejectedValue());
					err.setDescription(desc);
					err.getParams().add(errs.getField());
					err.getParams().add((String)errs.getRejectedValue());
				} else {
					err.setCode(errs.getCode());
					err.setMessage(errs.getDefaultMessage());
					err.setDescription(errs.getField());
				}
				errRes.getErrors().add(err);
			}

		}

		return errRes;	
	}



	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(InvalidDataException.class)
	public org.egov.common.web.contract.ErrorResponse handleBindingErrors(InvalidDataException ex) {
		org.egov.common.web.contract.ErrorResponse errRes = new org.egov.common.web.contract.ErrorResponse();

		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		errRes.setResponseInfo(responseInfo);
		org.egov.common.web.contract.Error error = new org.egov.common.web.contract.Error();
		error.setCode(ex.getMessageKey());
		System.out.println(ErrorCode.getError("non.unique.value"));
		if (ErrorCode.getError(ex.getMessageKey()) != null) {
			String message = MessageFormat.format(ErrorCode.getError(ex.getMessageKey()).getMessage(),
					ex.getFieldName(), ex.getFieldValue());
			error.setMessage(message);
			String desc = MessageFormat.format(ErrorCode.getError(ex.getMessageKey()).getDescription(),
					ex.getFieldName(), ex.getFieldValue());
			error.setDescription(desc);
		} else {
			LOG.warn("error code is not defined for " + ex.getMessageKey());
		}
		List<org.egov.common.web.contract.Error> errors = new ArrayList<org.egov.common.web.contract.Error>();
		errors.add(error);
		errRes.setErrors(errors);
		return errRes;
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(org.apache.kafka.common.errors.TimeoutException.class)
	public org.egov.common.web.contract.ErrorResponse handleThrowable(
			org.apache.kafka.common.errors.TimeoutException ex) {
		org.egov.common.web.contract.ErrorResponse errRes = new org.egov.common.web.contract.ErrorResponse();
		ex.printStackTrace();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.toString());
		errRes.setResponseInfo(responseInfo);
		org.egov.common.web.contract.Error error = new org.egov.common.web.contract.Error();

		error.setCode(ErrorCode.KAFKA_TIMEOUT_ERROR.getCode());
		error.setMessage(ErrorCode.KAFKA_TIMEOUT_ERROR.getMessage());
		error.setDescription(ErrorCode.KAFKA_TIMEOUT_ERROR.getDescription());
		List<org.egov.common.web.contract.Error> errors = new ArrayList<org.egov.common.web.contract.Error>();
		errors.add(error);
		errRes.setErrors(errors);
		return errRes;
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Throwable.class)
	public ErrorResponse handleThrowable(Exception ex) {
		ErrorResponse errRes = new ErrorResponse();
		ex.printStackTrace();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.toString());
		errRes.setResponseInfo(responseInfo);
		Error error = new Error();

		error.setCode(500);
		error.setMessage("Internal Server Error");
		error.setDescription(ex.getMessage());
		return errRes;
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	public ErrorResponse handleServerError(Exception ex) {
		ex.printStackTrace();
		ErrorResponse errRes = new ErrorResponse();

		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.toString());
		errRes.setResponseInfo(responseInfo);
		Error error = new Error();

		error.setCode(500);
		error.setMessage("Internal Server Error");
		error.setDescription(ex.getMessage());
		errRes.setError(error);
		return errRes;
	}

	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	@ExceptionHandler(UnauthorizedAccessException.class)
	public ErrorResponse handleAuthenticationError(UnauthorizedAccessException ex) {
		ex.printStackTrace();
		ErrorResponse errRes = new ErrorResponse();

		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.UNAUTHORIZED.toString());
		errRes.setResponseInfo(responseInfo);
		Error error = new Error();

		error.setCode(404);
		error.setMessage("Un Authorized Access");
		error.setDescription(ex.getMessage());
		errRes.setError(error);
		return errRes;
	}

}