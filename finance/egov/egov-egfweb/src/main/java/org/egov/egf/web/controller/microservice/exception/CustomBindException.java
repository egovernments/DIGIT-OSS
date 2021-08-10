package org.egov.egf.web.controller.microservice.exception;

public class CustomBindException extends RuntimeException {

	private static final long serialVersionUID = 8861914629969408745L;

	private String message;

	public CustomBindException(String message) {
	this.message = message;

	}

}
