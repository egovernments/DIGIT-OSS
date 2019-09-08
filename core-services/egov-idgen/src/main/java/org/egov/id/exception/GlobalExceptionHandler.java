package org.egov.id.exception;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.id.config.PropertiesManager;
import org.egov.id.model.Error;
import org.egov.id.model.ErrorRes;
import org.egov.id.model.IDSeqNotFoundException;
import org.egov.id.model.IDSeqOverflowException;
import org.egov.id.model.InvalidIDFormatException;
import org.egov.id.model.ResponseInfo;
import org.egov.id.model.ResponseStatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@Autowired
	PropertiesManager propertiesManager;

	/**
	 * Description : MethodArgumentNotValidException type exception handler
	 * 
	 * @param ex
	 * @return
	 */

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorRes processValidationError(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<String, String>();
		for (final FieldError error : ex.getBindingResult().getFieldErrors()) {
			errors.put(error.getField(), error.getDefaultMessage());
		}

		Error error = new Error(HttpStatus.BAD_REQUEST.toString(), propertiesManager.getInvalidInput(), null, errors);
		List<Error> errorList = new ArrayList<Error>();
		errorList.add(error);
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(ResponseStatusEnum.FAILED);
		return new ErrorRes(responseInfo, errorList);
	}

	/**
	 * Description : General exception handler method
	 * 
	 * @param ex
	 * @param req
	 * @return
	 */
	@ExceptionHandler(value = { Exception.class })
	public ErrorRes unknownException(Exception ex, WebRequest req) {
		if (ex instanceof InvalidIDFormatException) {
			Error error = new Error(HttpStatus.BAD_REQUEST.toString(), ((InvalidIDFormatException) ex).getCustomMsg(),
					null, new HashMap<String, String>());
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setApiId(((InvalidIDFormatException) ex).getRequestInfo().getApiId());
			responseInfo.setVer(((InvalidIDFormatException) ex).getRequestInfo().getVer());
			responseInfo.setMsgId(((InvalidIDFormatException) ex).getRequestInfo().getMsgId());
			responseInfo.setTs(new Date().getTime());
			responseInfo.setStatus(ResponseStatusEnum.FAILED);
			List<Error> errorList = new ArrayList<Error>();
			errorList.add(error);
			return new ErrorRes(responseInfo, errorList);
		} else if (ex instanceof IDSeqOverflowException) {
			Error error = new Error(HttpStatus.BAD_REQUEST.toString(), ((IDSeqOverflowException) ex).getCustomMsg(),
					null, new HashMap<String, String>());
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setApiId(((IDSeqOverflowException) ex).getRequestInfo().getApiId());
			responseInfo.setVer(((IDSeqOverflowException) ex).getRequestInfo().getVer());
			responseInfo.setMsgId(((IDSeqOverflowException) ex).getRequestInfo().getMsgId());
			responseInfo.setTs(new Date().getTime());
			responseInfo.setStatus(ResponseStatusEnum.FAILED);
			List<Error> errorList = new ArrayList<Error>();
			errorList.add(error);
			return new ErrorRes(responseInfo, errorList);
		} else if (ex instanceof IDSeqNotFoundException) {
			Error error = new Error(HttpStatus.BAD_REQUEST.toString(), ((IDSeqNotFoundException) ex).getCustomMsg(),
					null, new HashMap<String, String>());
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setApiId(((IDSeqNotFoundException) ex).getRequestInfo().getApiId());
			responseInfo.setVer(((IDSeqNotFoundException) ex).getRequestInfo().getVer());
			responseInfo.setMsgId(((IDSeqNotFoundException) ex).getRequestInfo().getMsgId());
			responseInfo.setTs(new Date().getTime());
			responseInfo.setStatus(ResponseStatusEnum.FAILED);
			List<Error> errorList = new ArrayList<Error>();
			errorList.add(error);
			return new ErrorRes(responseInfo, errorList);
		} else {
			Error error = new Error(HttpStatus.BAD_REQUEST.toString(), ex.getMessage(), null,
					new HashMap<String, String>());
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(ResponseStatusEnum.FAILED);
			List<Error> errorList = new ArrayList<Error>();
			errorList.add(error);
			return new ErrorRes(responseInfo, errorList);
		}
	}

}
