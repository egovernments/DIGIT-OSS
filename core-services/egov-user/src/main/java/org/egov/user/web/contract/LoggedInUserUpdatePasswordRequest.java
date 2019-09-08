package org.egov.user.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.enums.UserType;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class
LoggedInUserUpdatePasswordRequest {
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	private String existingPassword;
	private String newPassword;
	private String tenantId;
	private UserType type;

	public org.egov.user.domain.model.LoggedInUserUpdatePasswordRequest toDomain() {
		return org.egov.user.domain.model.LoggedInUserUpdatePasswordRequest.builder()
				.existingPassword(existingPassword)
				.newPassword(newPassword)
				.userName(getUsername())
				.tenantId(tenantId)
                .type(type)
				.build();
	}

	private String getUsername() {
		return requestInfo == null || requestInfo.getUserInfo() == null ? null : requestInfo.getUserInfo().getUserName();
	}
}

