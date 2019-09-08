package org.egov.domain.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Getter
@Builder
@EqualsAndHashCode
public class MessageSearchCriteria {
	private Tenant tenantId;
	private String locale;
	private String module;

	public boolean isModuleAbsent() {
		return isEmpty(module);
	}
}
