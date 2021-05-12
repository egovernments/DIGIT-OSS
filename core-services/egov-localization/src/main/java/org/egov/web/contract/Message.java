package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.domain.model.MessageIdentity;
import org.egov.domain.model.Tenant;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
	@NotEmpty
    @SafeHtml
	private String code;
	@NotEmpty
    @SafeHtml
	private String message;
	@NotEmpty
    @SafeHtml
	private String module;
	@NotEmpty
    @SafeHtml
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
