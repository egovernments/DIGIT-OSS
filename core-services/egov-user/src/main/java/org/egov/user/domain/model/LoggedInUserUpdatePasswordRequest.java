package org.egov.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.egov.user.domain.exception.InvalidLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.model.enums.UserType;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@AllArgsConstructor
@Builder
@Getter
@EqualsAndHashCode
public class LoggedInUserUpdatePasswordRequest {
	private String userName;
	private String tenantId;
	private UserType type;
	private String existingPassword;
	private String newPassword;

	public void validate() {
		if (isUsernameAbsent() || isTenantAbsent() || isUserTypeAbsent() || isExistingPasswordAbsent() ||
                isNewPasswordAbsent()) {
			throw new InvalidLoggedInUserUpdatePasswordRequestException(this);
		}
	}

    public boolean isUsernameAbsent() {
        return isEmpty(userName);
    }

    public boolean isExistingPasswordAbsent() {
        return isEmpty(existingPassword);
    }

    public boolean isNewPasswordAbsent() {
        return isEmpty(newPassword);
    }

    public boolean isTenantAbsent() {
        return isEmpty(tenantId);
    }
    public boolean isUserTypeAbsent() {
        return isNull(type);
    }
}

