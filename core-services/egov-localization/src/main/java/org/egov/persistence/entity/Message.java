package org.egov.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import org.egov.domain.model.MessageIdentity;
import org.egov.domain.model.Tenant;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "message")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@SequenceGenerator(name = Message.SEQ_MESSAGE, sequenceName = Message.SEQ_MESSAGE, allocationSize = 1)
public class Message {

	static final String SEQ_MESSAGE = "SEQ_MESSAGE";

	@Id
	private String id;

	@Column(name = "locale")
	private String locale;

	@Column(name = "code")
	private String code;

	@Column(name = "module")
	private String module;

	@Column(name = "message")
	private String message;

	@Column(name = "tenantid")
	private String tenantId;

	@Column(name = "createdby")
	private Long createdBy;

	@Column(name = "createddate")
	private Date createdDate;

	@Column(name = "lastmodifiedby")
	private Long lastModifiedBy;

	@Column(name = "lastmodifieddate")
	private Date lastModifiedDate;

	public Message(org.egov.domain.model.Message domainMessage) {
		this.tenantId = domainMessage.getTenant();
		this.locale = domainMessage.getLocale();
		this.module = domainMessage.getModule();
		this.code = domainMessage.getCode();
		this.message = domainMessage.getMessage();
	}

	public org.egov.domain.model.Message toDomain() {
		final Tenant tenant = new Tenant(tenantId);
		final MessageIdentity messageIdentity = MessageIdentity.builder().tenant(tenant).module(module).locale(locale)
				.code(code).build();
		return org.egov.domain.model.Message.builder().message(message).messageIdentity(messageIdentity).build();
	}

	public void update(org.egov.domain.model.Message updatedMessage) {
		message = updatedMessage.getMessage();
	}
}
