package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DepartmentResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("Department")
	private List<Department> department = new ArrayList<>();
	
	
	public DepartmentResponse(ResponseInfo responseInfo, List<Department> department) {
		this.responseInfo = responseInfo;
		this.department = department;
	}
	public DepartmentResponse(){}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<Department> getDepartment() {
		return department;
	}

	public void setDepartment(List<Department> department) {
		this.department = department;
	}

	
}
