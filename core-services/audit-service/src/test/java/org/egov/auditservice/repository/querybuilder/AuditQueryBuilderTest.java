package org.egov.auditservice.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.auditservice.config.AuditServiceConfiguration;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class AuditQueryBuilderTest {
    @Autowired
    private AuditQueryBuilder auditQueryBuilder;

    @MockBean
    private AuditServiceConfiguration auditServiceConfiguration;


    ////@Test
    void testGetAuditLogQuery() {
        when(auditServiceConfiguration.getDefaultLimit()).thenReturn(1);
        when(auditServiceConfiguration.getDefaultOffset()).thenReturn(1);
        AuditLogSearchCriteria criteria = new AuditLogSearchCriteria();
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluepairs,"
                        + " operationtype, integrityhash FROM eg_audit_logs  OFFSET ?  LIMIT ? ",
                auditQueryBuilder.getAuditLogQuery(criteria, objectList));
        verify(auditServiceConfiguration).getDefaultLimit();
        verify(auditServiceConfiguration).getDefaultOffset();
        assertEquals(2, objectList.size());
    }


    ////@Test
    void testGetAuditLogQueryWithMaxSearchLimit() {
        when(auditServiceConfiguration.getMaxSearchLimit()).thenReturn(3);
        when(auditServiceConfiguration.getDefaultLimit()).thenReturn(1);
        when(auditServiceConfiguration.getDefaultOffset()).thenReturn(1);
        AuditLogSearchCriteria criteria = new AuditLogSearchCriteria("42", "42",
                "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluepairs,"
                        + " operationtype, integrityhash FROM eg_audit_logs ",
                "01234567-89AB-CDEF-FEDC-BA9876543210", "42", 2, 1);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluepairs,"
                        + " operationtype, integrityhash FROM eg_audit_logs  WHERE  tenantid = ?  AND  id = ?  AND  module = ? "
                        + " AND  objectid = ?  AND  useruuid = ?  OFFSET ?  LIMIT ? ",
                auditQueryBuilder.getAuditLogQuery(criteria, objectList));
        verify(auditServiceConfiguration).getDefaultLimit();
        verify(auditServiceConfiguration).getDefaultOffset();
        verify(auditServiceConfiguration, atLeast(1)).getMaxSearchLimit();
        assertEquals(7, objectList.size());
    }

    ////@Test
    void testGetAuditLogQueryWithZeroMaxSearchLimt() {
        when(auditServiceConfiguration.getMaxSearchLimit()).thenReturn(0);
        when(auditServiceConfiguration.getDefaultLimit()).thenReturn(1);
        when(auditServiceConfiguration.getDefaultOffset()).thenReturn(1);
        AuditLogSearchCriteria criteria = new AuditLogSearchCriteria("42", "42",
                "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluepairs,"
                        + " operationtype, integrityhash FROM eg_audit_logs ",
                "01234567-89AB-CDEF-FEDC-BA9876543210", "42", 2, 1);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluepairs,"
                        + " operationtype, integrityhash FROM eg_audit_logs  WHERE  tenantid = ?  AND  id = ?  AND  module = ? "
                        + " AND  objectid = ?  AND  useruuid = ?  OFFSET ?  LIMIT ? ",
                auditQueryBuilder.getAuditLogQuery(criteria, objectList));
        verify(auditServiceConfiguration).getDefaultLimit();
        verify(auditServiceConfiguration).getDefaultOffset();
        verify(auditServiceConfiguration, atLeast(1)).getMaxSearchLimit();
        assertEquals(7, objectList.size());
    }

}

