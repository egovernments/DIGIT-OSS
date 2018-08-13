package org.egov.infra.microservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestInfoWrapper {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	public RequestInfoWrapper(RequestInfo requestInfo) {
	//	super();
		this.requestInfo = requestInfo;
	}
	public RequestInfoWrapper() {}
	public RequestInfo getRequestInfo() {
		return requestInfo;
	}

	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}
}
