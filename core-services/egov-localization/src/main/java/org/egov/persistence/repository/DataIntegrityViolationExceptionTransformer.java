package org.egov.persistence.repository;

import org.egov.domain.model.DuplicateMessageIdentityException;
import org.egov.domain.model.MessagePersistException;
import org.springframework.dao.DataIntegrityViolationException;

public class DataIntegrityViolationExceptionTransformer {

	private final static String UNIQUE_CONSTRAINT_NAME = "unique_message_entry";

	private DataIntegrityViolationException exception;

	public DataIntegrityViolationExceptionTransformer(DataIntegrityViolationException exception) {
		this.exception = exception;
	}

	public void transform() {
		if (exception.getMessage().contains(UNIQUE_CONSTRAINT_NAME)) {
			throw new DuplicateMessageIdentityException(exception);
		}
		throw new MessagePersistException(exception);
	}

}
