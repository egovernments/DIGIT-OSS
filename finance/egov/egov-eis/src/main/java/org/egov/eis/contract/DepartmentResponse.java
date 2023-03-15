package org.egov.eis.contract;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.infra.admin.master.entity.Department;
import org.egov.infra.admin.master.entity.DepartmentT;

public class DepartmentResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;
	
	@JsonProperty("Department")
	private List<DepartmentT> department = new ArrayList<DepartmentT>();
	public ResponseInfo getRespinfo() {
		return responseInfo;
	}
	public void setRespinfo(ResponseInfo respinfo) {
		this.responseInfo = respinfo;
	}
	public List<DepartmentT> getDepartlist() {
		return department;
	}
	public void setDepartlist(List<DepartmentT> departlist) {
		this.department = departlist;
	};
}
