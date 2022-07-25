package org.egov.auditservice.validator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditServiceValidator.class})
@ExtendWith(SpringExtension.class)
class AuditServiceValidatorTest {
    @Autowired
    private AuditServiceValidator auditServiceValidator;


    //@Test
    void testValidateAuditLogSearch() {
        assertThrows(CustomException.class,
                () -> auditServiceValidator.validateAuditLogSearch(new AuditLogSearchCriteria()));
    }


    //@Test
    void TestValidateAuditLogSearch() {
        AuditLogSearchCriteria auditLogSearchCriteria = new AuditLogSearchCriteria("42", "42", "EG_AUDIT_LOGS_SEARCH_ERR",
                "01234567-89AB-CDEF-FEDC-BA9876543210", "42", 2, 1);
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        assertEquals("42", auditLogSearchCriteria.getId());
        assertEquals("01234567-89AB-CDEF-FEDC-BA9876543210", auditLogSearchCriteria.getUserUUID());
        assertEquals("42", auditLogSearchCriteria.getTenantId());
        assertEquals(2, auditLogSearchCriteria.getOffset().intValue());
        assertEquals("42", auditLogSearchCriteria.getObjectId());
        assertEquals("EG_AUDIT_LOGS_SEARCH_ERR", auditLogSearchCriteria.getModule());
        assertEquals(1, auditLogSearchCriteria.getLimit().intValue());
    }


    //@Test
    void testValidateAuditLogSearchWithAllData() {
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getModule()).thenReturn("Module");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        when(auditLogSearchCriteria.getTenantId()).thenReturn("42");
        when(auditLogSearchCriteria.getUserUUID()).thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        verify(auditLogSearchCriteria).getModule();
    }


    //@Test
    void testValidateAuditLogSearchWithEmptyModule() {
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getModule()).thenReturn("");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        when(auditLogSearchCriteria.getTenantId()).thenReturn("42");
        when(auditLogSearchCriteria.getUserUUID()).thenReturn("01234567-89AB-CDEF-FEDC-BA9876543210");
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        verify(auditLogSearchCriteria).getModule();
        verify(auditLogSearchCriteria).getUserUUID();
    }


    //@Test
    void testValidateAuditLogSearchWithEmptyModuleAndUUID() {
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getModule()).thenReturn("");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        when(auditLogSearchCriteria.getTenantId()).thenReturn("42");
        when(auditLogSearchCriteria.getUserUUID()).thenReturn("");
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        verify(auditLogSearchCriteria).getModule();
        verify(auditLogSearchCriteria).getObjectId();
        verify(auditLogSearchCriteria).getUserUUID();
    }


    //@Test
    void testValidateAuditLogSearchWithEmptyObjectId() {
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getModule()).thenReturn("");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("");
        when(auditLogSearchCriteria.getTenantId()).thenReturn("42");
        when(auditLogSearchCriteria.getUserUUID()).thenReturn("");
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        verify(auditLogSearchCriteria).getModule();
        verify(auditLogSearchCriteria).getObjectId();
        verify(auditLogSearchCriteria).getTenantId();
        verify(auditLogSearchCriteria).getUserUUID();
    }
}

