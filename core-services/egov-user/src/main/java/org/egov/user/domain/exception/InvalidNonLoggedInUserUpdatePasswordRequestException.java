package org.egov.user.domain.exception;

import lombok.Getter;
import org.egov.user.domain.model.NonLoggedInUserUpdatePasswordRequest;

public class InvalidNonLoggedInUserUpdatePasswordRequestException extends RuntimeException {
	private static final long serialVersionUID = -371650760688252507L;
	@Getter
	private NonLoggedInUserUpdatePasswordRequest model;

	public InvalidNonLoggedInUserUpdatePasswordRequestException(NonLoggedInUserUpdatePasswordRequest model) {
		this.model = model;
	}
}
