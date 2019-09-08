package org.egov.access.web.contract.validateaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@Builder
@AllArgsConstructor
public class ValidateActionContract {
	@NonNull
	private TenantRoleContract tenantRole;

	@NonNull
	private String actionUrl;
}
