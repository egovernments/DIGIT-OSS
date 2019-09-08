package org.egov.user.domain.exception;

import lombok.Getter;

@Getter
public class InvalidRoleCodeException extends RuntimeException {

	private static final long serialVersionUID = 1554672029887030683L;
	private String roleCode;

	public InvalidRoleCodeException(String roleCode) {
		this.roleCode = roleCode;
	}

}

