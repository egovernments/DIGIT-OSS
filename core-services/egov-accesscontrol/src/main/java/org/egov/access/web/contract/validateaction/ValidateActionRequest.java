package org.egov.access.web.contract.validateaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.web.contract.role.RoleContract;
import org.egov.common.contract.request.RequestInfo;

import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
public class ValidateActionRequest {
	@NonNull
	private RequestInfo requestInfo;

	@NonNull
	private ValidateActionContract validateAction;

	public ValidateActionCriteria toDomain() {
		return ValidateActionCriteria.builder()
				.roleNames(validateAction.getTenantRole().getRoles().stream().map(RoleContract::getName)
						.collect(Collectors.toList()))
				.actionUrl(validateAction.getActionUrl()).tenantId(validateAction.getTenantRole().getTenantId())
				.build();
	}
}
