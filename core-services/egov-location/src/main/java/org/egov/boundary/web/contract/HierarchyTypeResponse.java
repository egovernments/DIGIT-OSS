package org.egov.boundary.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.boundary.web.contract.HierarchyType;
import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HierarchyTypeResponse {
	
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;
	@JsonProperty("HierarchyType")
	private List<HierarchyType> hierarchyTypes = new ArrayList<HierarchyType>();

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<HierarchyType> getHierarchyTypes() {
		return hierarchyTypes;
	}

	public void setHierarchyTypes(List<HierarchyType> hierarchyTypes) {
		this.hierarchyTypes = hierarchyTypes;
	}
}
