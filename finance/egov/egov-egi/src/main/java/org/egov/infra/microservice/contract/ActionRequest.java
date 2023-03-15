package org.egov.infra.microservice.contract;

import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;

public class ActionRequest {

	
	private RequestInfo requestInfo;
	private List<String> roleCodes;
	private List<Long> featureIds;
	private String tenantId;
	private Boolean enabled;
	private List<Action> actions;
	private String actionMaster;
	private String navigationURL;
	private String leftIcon;
	private String rightIcon;
	
	public ActionRequest(){}

	public ActionRequest(RequestInfo requestInfo, List<String> roleCodes, List<Long> featureIds, String tenantId,
			Boolean enabled, List<Action> actions, String actionMaster, String navigationURL, String leftIcon,
			String rightIcon) {
		this.requestInfo = requestInfo;
		this.roleCodes = roleCodes;
		this.featureIds = featureIds;
		this.tenantId = tenantId;
		this.enabled = enabled;
		this.actions = actions;
		this.actionMaster = actionMaster;
		this.navigationURL = navigationURL;
		this.leftIcon = leftIcon;
		this.rightIcon = rightIcon;
	}

	public RequestInfo getRequestInfo() {
		return requestInfo;
	}

	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}

	public List<String> getRoleCodes() {
		return roleCodes;
	}

	public void setRoleCodes(List<String> roleCodes) {
		this.roleCodes = roleCodes;
	}

	public List<Long> getFeatureIds() {
		return featureIds;
	}

	public void setFeatureIds(List<Long> featureIds) {
		this.featureIds = featureIds;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public List<Action> getActions() {
		return actions;
	}

	public void setActions(List<Action> actions) {
		this.actions = actions;
	}

	public String getActionMaster() {
		return actionMaster;
	}

	public void setActionMaster(String actionMaster) {
		this.actionMaster = actionMaster;
	}

	public String getNavigationURL() {
		return navigationURL;
	}

	public void setNavigationURL(String navigationURL) {
		this.navigationURL = navigationURL;
	}

	public String getLeftIcon() {
		return leftIcon;
	}

	public void setLeftIcon(String leftIcon) {
		this.leftIcon = leftIcon;
	}

	public String getRightIcon() {
		return rightIcon;
	}

	public void setRightIcon(String rightIcon) {
		this.rightIcon = rightIcon;
	}
	
}
