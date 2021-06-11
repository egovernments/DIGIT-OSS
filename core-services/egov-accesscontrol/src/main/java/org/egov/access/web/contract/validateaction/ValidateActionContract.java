package org.egov.access.web.contract.validateaction;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidateActionContract {
	@NonNull
	private TenantRoleContract tenantRole;

	@NonNull
	private String actionUrl;
}
