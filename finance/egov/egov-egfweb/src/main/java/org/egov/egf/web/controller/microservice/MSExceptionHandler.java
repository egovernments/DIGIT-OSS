package org.egov.egf.web.controller.microservice;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.contract.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice(assignableTypes=FinanceController.class)
public class MSExceptionHandler {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler({Exception.class,ApplicationRuntimeException.class,RuntimeException.class})
	@ResponseBody public ErrorResponse handlerException(){
		
		
		return new ErrorResponse();
	}
			
}
