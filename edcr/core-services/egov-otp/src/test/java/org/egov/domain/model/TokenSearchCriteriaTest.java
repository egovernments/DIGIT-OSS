package org.egov.domain.model;

import org.egov.domain.exception.InvalidTokenSearchCriteriaException;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class TokenSearchCriteriaTest {

    @Test
    public void test_should_not_throw_exception_when_search_criteria_has_mandatory_fields() {
        final TokenSearchCriteria searchCriteria = new TokenSearchCriteria("uuid", "tenant");

        searchCriteria.validate();
    }

    @Test(expected = InvalidTokenSearchCriteriaException.class)
    public void test_should_throw_validation_exception_when_tenant_id_is_not_present() {
        final TokenSearchCriteria searchCriteria = new TokenSearchCriteria("uuid", null);

        assertTrue(searchCriteria.isTenantIdAbsent());
        searchCriteria.validate();
    }

    @Test(expected = InvalidTokenSearchCriteriaException.class)
    public void test_should_throw_validation_exception_when_uuid_is_not_present() {
        final TokenSearchCriteria searchCriteria = new TokenSearchCriteria(null, "tenant");

        assertTrue(searchCriteria.isIdAbsent());
        searchCriteria.validate();
    }
}