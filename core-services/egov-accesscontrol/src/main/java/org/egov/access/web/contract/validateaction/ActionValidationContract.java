package org.egov.access.web.contract.validateaction;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActionValidationContract {
	@NonNull
	private String allowed;
}
