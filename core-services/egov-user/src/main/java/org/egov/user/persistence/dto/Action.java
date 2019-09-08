package org.egov.user.persistence.dto;

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

	public org.egov.user.domain.model.Action toDomain() {
		return org.egov.user.domain.model.Action.builder()
				.name(this.name)
				.url(this.url)
				.displayName(this.displayName)
				.orderNumber(this.orderNumber)
				.queryParams(this.queryParams)
				.parentModule(this.parentModule)
				.serviceCode(this.serviceCode)
				.build();
	}
}

