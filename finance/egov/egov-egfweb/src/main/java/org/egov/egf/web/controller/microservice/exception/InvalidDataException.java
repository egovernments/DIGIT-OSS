package org.egov.egf.web.controller.microservice.exception;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.infra.microservice.models.Error;

import com.fasterxml.jackson.annotation.JsonProperty;

 
public class InvalidDataException extends RuntimeException {
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getParams() {
		return params;
	}

	public void setParams(List<String> params) {
		this.params = params;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getMessageKey() {
		return messageKey;
	}

	public void setMessageKey(String messageKey) {
		this.messageKey = messageKey;
	}

	public List<Error> getValidationErrors() {
		return validationErrors;
	}

	public void setValidationErrors(List<Error> validationErrors) {
		this.validationErrors = validationErrors;
	}

	private static final long serialVersionUID = -1509069993620266971L;
	// public static final String code = "001";
	@JsonProperty("code")
	private String code = null;

	@JsonProperty("message")
	private String message = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("params")
	private List<String> params = null;
	
	private String fieldName;
	
	private String messageKey;

	private List<Error> validationErrors = new ArrayList<>();

	public void addDataError(String errorCode,String ...params) {
		Error error=new Error();
		error.setCode(errorCode);
		//error.setMessage(MessageFormat.format(ErrorCode.getError(errorCode).getMessage(),params));
		//error.setDescription(MessageFormat.format(ErrorCode.getError(errorCode).getDescription(),params));
		error.params(Arrays.asList(params));
		validationErrors.add(error);
	}

	public InvalidDataException(String code, String message, String description, List<String> params) {
		super();
		this.code = code;
		this.message = message;
		this.description = description;
		this.params = params;
	}

	public InvalidDataException(String code, String message, String description, List<String> params,
			List<Error> validationErrors) {
		super();
		this.code = code;
		this.message = message;
		this.description = description;
		this.params = params;
		this.validationErrors = validationErrors;
	}

	public InvalidDataException(String string, String code2, Object object) {
		 
	}

}
