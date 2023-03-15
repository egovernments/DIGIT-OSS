package org.egov.infra.microservice.contract;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class Error implements Serializable{

	private Integer code;
	@SafeHtml
	private String message;
	@SafeHtml
	private String description;
	
	public Error(){}

	public Error(Integer code, String message, String description) {
		this.code = code;
		this.message = message;
		this.description = description;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
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
	
}
