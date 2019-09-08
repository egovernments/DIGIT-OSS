package org.egov.user.domain.exception;

import lombok.Getter;
import org.egov.user.domain.model.LoggedInUserUpdatePasswordRequest;

public class InvalidLoggedInUserUpdatePasswordRequestException extends RuntimeException {
	private static final long serialVersionUID = 6391424774009868054L;
	@Getter
	private final LoggedInUserUpdatePasswordRequest request;

	public InvalidLoggedInUserUpdatePasswordRequestException(LoggedInUserUpdatePasswordRequest updatePassword) {
		this.request = updatePassword;
	}
}
