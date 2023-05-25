package org.egov.domain.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import javax.validation.constraints.Null;

@Builder
@Getter
@EqualsAndHashCode
@ToString
public class Message {
	private String message;

	@Null
	private MessageIdentity messageIdentity;

	public boolean isMoreSpecificComparedTo(Message otherMessage) {
		final Tenant otherTenant = otherMessage.getMessageIdentity().getTenant();
		return messageIdentity.getTenant().isMoreSpecificComparedTo(otherTenant);
	}

	public String getCode() {
		return messageIdentity.getCode();
	}

	public String getModule() {
		return messageIdentity.getModule();
	}

	public String getLocale() {
		return messageIdentity.getLocale();
	}

	public String getTenant() {
		return messageIdentity.getTenant().getTenantId();
	}
}
