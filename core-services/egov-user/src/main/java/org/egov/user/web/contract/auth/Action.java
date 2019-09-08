package org.egov.user.web.contract.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class Action {
	private String name;
	private String url;
	private String displayName;
	private Integer orderNumber;
	private String queryParams;
	private String parentModule;
	private String serviceCode;

	public Action(org.egov.user.domain.model.Action domainAction) {
		this.name = domainAction.getName();
		this.url = domainAction.getUrl();
		this.displayName = domainAction.getDisplayName();
		this.orderNumber = domainAction.getOrderNumber();
		this.queryParams = domainAction.getQueryParams();
		this.parentModule = domainAction.getParentModule();
		this.serviceCode = domainAction.getServiceCode();
	}
}

