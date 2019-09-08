package org.egov.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class Action {
	private String name;
	private String url;
	private String displayName;
	private Integer orderNumber;
	private String queryParams;
	private String parentModule;
	private String serviceCode;
}

