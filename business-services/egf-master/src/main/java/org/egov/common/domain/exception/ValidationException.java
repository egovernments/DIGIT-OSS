package org.egov.common.domain.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValidationException extends RuntimeException {
	private static final long serialVersionUID = -1509069993620266971L;
	private String fieldName;
	private String messageKey;
	private String fieldValue;
	

}
