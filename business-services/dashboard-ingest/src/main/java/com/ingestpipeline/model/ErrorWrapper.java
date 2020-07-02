package com.ingestpipeline.model;

public class ErrorWrapper {
	
	private String errorCode; 
	private String errorMessage;
	private Object incomingData;
	
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public Object getIncomingData() {
		return incomingData;
	}
	public void setIncomingData(Object incomingData) {
		this.incomingData = incomingData;
	} 
}
