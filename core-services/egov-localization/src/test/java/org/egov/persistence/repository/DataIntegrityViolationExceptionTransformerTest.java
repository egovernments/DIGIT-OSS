package org.egov.persistence.repository;

import org.egov.domain.model.DuplicateMessageIdentityException;
import org.egov.domain.model.MessagePersistException;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;

public class DataIntegrityViolationExceptionTransformerTest {

    @Test(expected = DuplicateMessageIdentityException.class)
    public void test_should_convert_data_integrity_exception_for_unique_constraint_violation_to_domain_exception() {
        final String message = "ERROR: duplicate key value violates unique constraint \"unique_message_entry\"";
        final DataIntegrityViolationException exception = new DataIntegrityViolationException(message);
        new DataIntegrityViolationExceptionTransformer(exception).transform();
    }

    @Test(expected = MessagePersistException.class)
    public void test_should_convert_unknown_data_integrity_exception_to_domain_exception() {
        final String message = "ERROR: duplicate key value violates unique constraint \"foo\"";
        final DataIntegrityViolationException exception = new DataIntegrityViolationException(message);
        new DataIntegrityViolationExceptionTransformer(exception).transform();
    }

}