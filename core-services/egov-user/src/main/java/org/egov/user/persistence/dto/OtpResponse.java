package org.egov.user.persistence.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@AllArgsConstructor
public class OtpResponse {
	private Otp otp;
	private ResponseInfo responseInfo;

	public boolean isValidationComplete(String mobileNumber) {
		return otp != null && otp.isValidationComplete(mobileNumber);
	}

}
