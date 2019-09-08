package org.egov.user.domain.exception;

import lombok.Getter;

@Getter
public class OtpValidationPendingException extends RuntimeException {
	private static final long serialVersionUID = -7229108921841183488L;
}
