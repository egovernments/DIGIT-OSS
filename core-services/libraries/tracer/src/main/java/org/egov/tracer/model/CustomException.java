package org.egov.tracer.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Setter
@Getter
public class CustomException extends RuntimeException{
	
	private static final long serialVersionUID = 8859144435338793971L;
	
	private String code;
	private String message;
	private Map<String, String> errors;
	
	public CustomException() {
		super();
	}
	public CustomException(String code, String message) {
		super();
		this.code = code;
		this.message = message;
	}
	public CustomException(Map<String, String> errors) {
		super();
		this.message = errors.toString();
		this.errors = errors;
	}
	
	
}
