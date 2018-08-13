package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmployeeInfoResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("Employee")
	private List<EmployeeInfo> employees = new ArrayList<EmployeeInfo>();

	public EmployeeInfoResponse(ResponseInfo responseInfo, List<EmployeeInfo> employees) {
		this.responseInfo = responseInfo;
		this.employees = employees;
	}

	public EmployeeInfoResponse(){}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<EmployeeInfo> getEmployees() {
		return employees;
	}

	public void setEmployees(List<EmployeeInfo> employees) {
		this.employees = employees;
	}
	
}
