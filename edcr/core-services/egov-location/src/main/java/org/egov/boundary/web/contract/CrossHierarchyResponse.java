package org.egov.boundary.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.boundary.web.contract.CrossHierarchy;
import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CrossHierarchyResponse {
	
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;
	@JsonProperty("CrossHierarchy")
	private List<CrossHierarchy> crossHierarchys = new ArrayList<CrossHierarchy>();

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<CrossHierarchy> getCrossHierarchys() {
		return crossHierarchys;
	}

	public void setCrossHierarchys(List<CrossHierarchy> crossHierarchys) {
		this.crossHierarchys = crossHierarchys;
	}
 
}
