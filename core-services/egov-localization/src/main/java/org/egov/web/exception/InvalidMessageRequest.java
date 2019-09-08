package org.egov.web.exception;

import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;

@SuppressWarnings("serial")
@Getter
public class InvalidMessageRequest extends RuntimeException {
	private List<FieldError> errors;

	public InvalidMessageRequest(List<FieldError> errors) {
		this.errors = errors;
	}
}
