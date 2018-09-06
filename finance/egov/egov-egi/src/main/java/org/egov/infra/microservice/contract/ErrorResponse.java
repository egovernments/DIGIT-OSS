package org.egov.infra.microservice.contract;

import java.io.Serializable;
import java.util.List;

public class ErrorResponse implements Serializable {
	
	private ResponseInfo responseInfo;
	private List<Error> errors;

	public ErrorResponse(){}

	public ErrorResponse(ResponseInfo responseInfo, List<Error> errors) {
		this.responseInfo = responseInfo;
		this.errors = errors;
	}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<Error> getErrors() {
		return errors;
	}

	public void setErrors(List<Error> errors) {
		this.errors = errors;
	}
	
}
