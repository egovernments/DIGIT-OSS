package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DesignationResponse {
	
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("Designation")
	private List<Designation> designation = new ArrayList<Designation>();

	public DesignationResponse(ResponseInfo responseInfo, List<Designation> designation) {
		this.responseInfo = responseInfo;
		this.designation = designation;
	}

	public DesignationResponse(){}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<Designation> getDesignation() {
		return designation;
	}

	public void setDesignation(List<Designation> designation) {
		this.designation = designation;
	}
	
	
}
