package org.egov.boundary.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BoundaryTypeResponse {
	
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo = null;
	@JsonProperty("BoundaryType")
	private List<BoundaryType> boundaryTypes = new ArrayList<BoundaryType>();

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<BoundaryType> getBoundaryTypes() {
		return boundaryTypes;
	}

	public void setBoundaryTypes(List<BoundaryType> boundaryTypes) {
		this.boundaryTypes = boundaryTypes;
	}

	 
}
