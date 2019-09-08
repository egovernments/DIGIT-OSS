package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.AuthenticatedUser;
import org.egov.domain.model.NotAuthenticatedException;
import org.egov.domain.model.Tenant;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class CreateMessagesRequest {
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@NotEmpty
	private String tenantId;

	@Size(min = 1)
	@Valid
	private List<Message> messages;

	public List<org.egov.domain.model.Message> toDomainMessages() {
		return messages.stream().map(this::toDomainMessage).collect(Collectors.toList());
	}

	private org.egov.domain.model.Message toDomainMessage(Message contractMessage) {
		return org.egov.domain.model.Message.builder().message(contractMessage.getMessage())
				.messageIdentity(contractMessage.getMessageIdentity(getTenant())).build();
	}

	public Tenant getTenant() {
		return new Tenant(tenantId);
	}

	public AuthenticatedUser getAuthenticatedUser() {
		if (requestInfo == null || requestInfo.getUserInfo() == null || requestInfo.getUserInfo().getId() == null) {
			throw new NotAuthenticatedException();
		}
		return new AuthenticatedUser(requestInfo.getUserInfo().getId());
	}
}
