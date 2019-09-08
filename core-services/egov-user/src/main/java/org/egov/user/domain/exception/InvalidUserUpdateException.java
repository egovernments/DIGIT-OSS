package org.egov.user.domain.exception;

import lombok.Getter;
import org.egov.user.domain.model.User;

public class InvalidUserUpdateException extends RuntimeException {

	private static final long serialVersionUID = 580361940613077431L;
	@Getter
	private User user;

	public InvalidUserUpdateException(User user) {
		this.user = user;
	}

}
