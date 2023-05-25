package org.egov.domain.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@EqualsAndHashCode
@ToString
public class MessageIdentity {
	private String code;
	private Tenant tenant;
	private String locale;
	private String module;
}
