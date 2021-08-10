package org.egov.infra.microservice.contract;

import java.util.List;

public class ActionResponse {
	
	private ResponseInfo responseInfo;
	private List<ActionContract> actions;
	
	public ActionResponse(){}

	public ActionResponse(ResponseInfo responseInfo, List<ActionContract> actions) {
		this.responseInfo = responseInfo;
		this.actions = actions;
	}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<ActionContract> getActions() {
		return actions;
	}

	public void setActions(List<ActionContract> actions) {
		this.actions = actions;
	}
	
}
