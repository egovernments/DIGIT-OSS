package org.egov.user.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

@AllArgsConstructor
@Getter
public class UpdatePasswordResponse {
	private ResponseInfo responseInfo;
}
