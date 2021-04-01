package org.egov.access.web.contract.validateaction;

import lombok.*;
import org.egov.access.web.contract.role.RoleContract;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenantRoleContract {
	@NonNull
	private String tenantId;

	@NonNull
	private List<RoleContract> roles;
}
