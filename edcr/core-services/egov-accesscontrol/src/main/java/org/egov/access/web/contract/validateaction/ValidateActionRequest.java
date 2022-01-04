package org.egov.access.web.contract.validateaction;

import lombok.*;
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.web.contract.role.RoleContract;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidateActionRequest {
	@NonNull
	private RequestInfo requestInfo;

	@NonNull
	@Valid
	private ValidateActionContract validateAction;

	public ValidateActionCriteria toDomain() {
		return ValidateActionCriteria.builder()
				.roleNames(validateAction.getTenantRole().getRoles().stream().map(RoleContract::getName)
						.collect(Collectors.toList()))
				.actionUrl(validateAction.getActionUrl()).tenantId(validateAction.getTenantRole().getTenantId())
				.build();
	}
}
