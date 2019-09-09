package org.egov.persistence.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchRequest {
	private String userName;
	private String tenantId;
	private String userType;
}
