package org.egov.web.controller;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.domain.model.DuplicateMessageIdentityException;
import org.egov.domain.model.MessagePersistException;
import org.egov.domain.model.NotAuthenticatedException;
import org.egov.web.exception.InvalidMessageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class CustomControllerAdvice {

	private static final String DUPLICATE_MESSAGE_IDENTITY = "core.DUPLICATE_MESSAGE_IDENTITY";
	private static final String UNIQUE_MESSAGE = "Combination of tenant, locale, module and code should be unique.";

	private static final String PERSIST_FAILED_CODE = "core.MESSAGE_PERSIST_FAILED";
	private static final String PERSIST_FAILED_MESSAGE = "Message persist failed";

	private static final String NOT_AUTHENTICATED_CODE = "core.NOT_AUTHENTICATED";
	private static final String NOT_AUTHENTICATED_MESSAGE = "Not authenticated";

	@ExceptionHandler(InvalidMessageRequest.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorResponse processValidationError(InvalidMessageRequest ex) {
		List<ErrorField> errorFields = ex.getErrors().stream()
				.map(e -> new ErrorField(e.getCode(), e.getDefaultMessage(), e.getField()))
				.collect(Collectors.toList());
		return createErrorResponse(errorFields);
	}

	@ExceptionHandler(DuplicateMessageIdentityException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorResponse handleDuplicateMessageIdentityException() {
		final ErrorField errorField = new ErrorField(DUPLICATE_MESSAGE_IDENTITY, UNIQUE_MESSAGE,
				DUPLICATE_MESSAGE_IDENTITY);
		return createErrorResponse(Collections.singletonList(errorField));
	}

	@ExceptionHandler(MessagePersistException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorResponse handleMessagePersistException() {
		final ErrorField errorField = new ErrorField(PERSIST_FAILED_CODE, PERSIST_FAILED_MESSAGE, PERSIST_FAILED_CODE);
		return createErrorResponse(Collections.singletonList(errorField));
	}

	@ExceptionHandler(NotAuthenticatedException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorResponse handleNotAuthenticatedException() {
		final ErrorField errorField = new ErrorField(NOT_AUTHENTICATED_CODE, NOT_AUTHENTICATED_MESSAGE,
				NOT_AUTHENTICATED_CODE);
		return createErrorResponse(Collections.singletonList(errorField));
	}

	private ErrorResponse createErrorResponse(List<ErrorField> errorFields) {
		final ResponseInfo responseInfo = ResponseInfo.builder().build();
		final Error error = Error.builder().code(HttpStatus.BAD_REQUEST.value()).fields(errorFields).build();
		return new ErrorResponse(responseInfo, error);
	}

}