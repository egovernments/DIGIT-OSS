package org.egov.access.web.contract.validateaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@Builder
@AllArgsConstructor
public class ValidateActionResponse {
	private ResponseInfo responseInfo;
	private ActionValidationContract actionValidation;
}
