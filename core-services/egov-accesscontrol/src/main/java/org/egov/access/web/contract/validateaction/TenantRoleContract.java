package org.egov.access.web.contract.validateaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import org.egov.access.web.contract.role.RoleContract;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class TenantRoleContract {
	@NonNull
	private String tenantId;

	@NonNull
	private List<RoleContract> roles;
}
