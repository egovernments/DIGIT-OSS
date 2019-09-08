package org.egov.boundary.web.contract;

import javax.validation.Valid;

import org.egov.boundary.web.contract.HierarchyType;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;


public class HierarchyTypeRequest {

	@Valid
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo = null;
	@Valid
	@JsonProperty("HierarchyType")
	private HierarchyType hierarchyType = null;

	public RequestInfo getRequestInfo() {
		return requestInfo;
	}

	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}

	public HierarchyType getHierarchyType() {
		return hierarchyType;
	}

	public void setHierarchyType(HierarchyType hierarchyType) {
		this.hierarchyType = hierarchyType;
	}

}
