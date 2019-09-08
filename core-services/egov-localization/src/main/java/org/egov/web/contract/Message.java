package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.egov.domain.model.MessageIdentity;
import org.egov.domain.model.Tenant;
import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class Message {
	@NotEmpty
	private String code;
	@NotEmpty
	private String message;
	@NotEmpty
	private String module;
	@NotEmpty
	private String locale;

	public Message(org.egov.domain.model.Message domainMessage) {
		this.code = domainMessage.getCode();
		this.message = domainMessage.getMessage();
		this.module = domainMessage.getModule();
		this.locale = domainMessage.getLocale();
	}

	@JsonIgnore
	public MessageIdentity getMessageIdentity(Tenant tenant) {
		return MessageIdentity.builder().code(code).module(module).locale(locale).tenant(tenant).build();
	}
}
