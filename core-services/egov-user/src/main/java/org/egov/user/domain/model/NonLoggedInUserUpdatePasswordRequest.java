package org.egov.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.egov.user.domain.exception.InvalidNonLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.model.enums.UserType;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@AllArgsConstructor
@Builder
@Getter
@EqualsAndHashCode
public class NonLoggedInUserUpdatePasswordRequest {
	private String otpReference;
	private String userName;
	private String newPassword;
	private String tenantId;
	private UserType type;

	public void validate() {
		if (isModelInvalid()) {
			throw new InvalidNonLoggedInUserUpdatePasswordRequestException(this);
		}
	}

	public OtpValidationRequest getOtpValidationRequest() {
		return OtpValidationRequest.builder()
				.otpReference(otpReference)
				.mobileNumber(userName)
				.tenantId(tenantId)
				.build();
	}

	public boolean isOtpReferenceAbsent() {
		return isEmpty(otpReference);
	}

	public boolean isUsernameAbsent() {
		return isEmpty(userName);
	}

	public boolean isNewPasswordAbsent() {
		return isEmpty(newPassword);
	}

	public boolean isTenantIdAbsent() {
		return isEmpty(tenantId);
	}

    private boolean isUserTypeAbsent() {
        return isNull(type);
    }


    private boolean isModelInvalid() {
		return isOtpReferenceAbsent() || isUsernameAbsent() || isTenantIdAbsent() || isUserTypeAbsent() || isNewPasswordAbsent();
	}
}
