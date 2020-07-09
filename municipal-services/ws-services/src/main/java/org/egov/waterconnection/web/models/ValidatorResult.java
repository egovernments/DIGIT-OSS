package org.egov.waterconnection.web.models;

import java.util.Map;

public class ValidatorResult {

	private boolean status;

	private Map<String, String> errorMessage;

	public ValidatorResult(boolean status, Map<String, String> errorMessage) {
		super();
		this.status = status;
		this.errorMessage = errorMessage;
	}

	public ValidatorResult() {

	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public Map<String, String> getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(Map<String, String> errorMessage) {
		this.errorMessage = errorMessage;
	}
}
