package org.egov.persistence.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.egov.domain.model.Message;
import org.egov.domain.model.MessageIdentity;
import org.egov.domain.model.Tenant;

import java.io.Serializable;

@SuppressWarnings("serial")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO implements Serializable {
	private String code;
	private String locale;
	private String module;
	private String tenant;
	private String message;

	public MessageDTO(Message domainMessage) {
		code = domainMessage.getCode();
		module = domainMessage.getModule();
		locale = domainMessage.getLocale();
		tenant = domainMessage.getTenant();
		message = domainMessage.getMessage();
	}

	@JsonIgnore
	public Message toDomainMessage() {
		final Tenant tenant = new Tenant(this.tenant);
		final MessageIdentity messageIdentity = MessageIdentity.builder().code(code).module(module).locale(locale)
				.tenant(tenant).build();
		return Message.builder().messageIdentity(messageIdentity).message(message).build();
	}
}
