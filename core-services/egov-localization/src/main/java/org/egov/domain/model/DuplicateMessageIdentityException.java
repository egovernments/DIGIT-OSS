package org.egov.domain.model;

@SuppressWarnings("serial")
public class DuplicateMessageIdentityException extends RuntimeException {
	public DuplicateMessageIdentityException(Throwable cause) {
		super(cause);
	}
}
