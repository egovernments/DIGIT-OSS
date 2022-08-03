package org.egov.auditservice.validator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.auditservice.web.models.AuditLog;

import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.enums.OperationType;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class AuditServiceValidatorTest {
    @Autowired
    private AuditServiceValidator auditServiceValidator;

    @MockBean
    private Integer integer;


    @Test
    void testValidateAuditLogSearch() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        assertThrows(CustomException.class,
                () -> auditServiceValidator.validateAuditLogSearch(new AuditLogSearchCriteria()));
    }


    @Test
    void testValidateAuditLogSearchWithLogError() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
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


    @Test
    void testValidateAuditLogSearchWithReturnId() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getTenantId()).thenReturn("42");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria);
        verify(auditLogSearchCriteria).getObjectId();
        verify(auditLogSearchCriteria).getTenantId();
    }


    @Test
    void testValidateAuditLogSearchWithSearchErr() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getTenantId())
                .thenThrow(new CustomException("EG_AUDIT_LOGS_SEARCH_ERR", "An error occurred"));
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        assertThrows(CustomException.class, () -> auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria));
        verify(auditLogSearchCriteria).getObjectId();
        verify(auditLogSearchCriteria).getTenantId();
    }

    @Test
    void testValidateAuditLogSearchWithEmptyString() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLogSearchCriteria auditLogSearchCriteria = mock(AuditLogSearchCriteria.class);
        when(auditLogSearchCriteria.getTenantId()).thenReturn("");
        when(auditLogSearchCriteria.getObjectId()).thenReturn("42");
        assertThrows(CustomException.class, () -> auditServiceValidator.validateAuditLogSearch(auditLogSearchCriteria));
        verify(auditLogSearchCriteria).getObjectId();
        verify(auditLogSearchCriteria).getTenantId();
    }


    @Test
    void testValidateOperationType() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        auditServiceValidator.validateOperationType(new ArrayList<>());
    }


    @Test
    void testValidateOperationTypeWithAuditLogList() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        assertThrows(CustomException.class, () -> auditServiceValidator.validateOperationType(auditLogList));
    }

    @Test
    void testValidateOperationTypeWitgLogErr() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "EG_AUDIT_LOGS_CREATE_ERR", "42",
                "EG_AUDIT_LOGS_CREATE_ERR", 1L, "EG_AUDIT_LOGS_CREATE_ERR", "42", new HashMap<>(), OperationType.CREATE,
                "EG_AUDIT_LOGS_CREATE_ERR"));
        auditServiceValidator.validateOperationType(auditLogList);
    }


    @Test
    void testValidateOperationTypeCreate() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLog auditLog = mock(AuditLog.class);
        when(auditLog.getOperationType()).thenReturn(OperationType.CREATE);

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(auditLog);
        auditServiceValidator.validateOperationType(auditLogList);
        verify(auditLog).getOperationType();
    }


    @Test
    void testValidateOperationTypeWithAuditList() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLog auditLog = mock(AuditLog.class);
        when(auditLog.getOperationType()).thenReturn(OperationType.CREATE);

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog("42", "01234567-89AB-CDEF-FEDC-BA9876543210", "Module", "42", "Transaction Code",
                1L, "Entity Name", "42", new HashMap<>(), OperationType.CREATE, "Integrity Hash"));
        auditLogList.add(auditLog);
        auditServiceValidator.validateOperationType(auditLogList);
        verify(auditLog).getOperationType();
    }



    @Test
    void testValidateKeyValueMap() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        auditServiceValidator.validateKeyValueMap(new ArrayList<>());
    }


    @Test
    void testValidateKeyValueMaps() {

        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();

        AuditLog auditLog = new AuditLog();
        auditLog.setKeyValueMap(new HashMap<>());

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(auditLog);
        assertThrows(CustomException.class, () -> auditServiceValidator.validateKeyValueMap(auditLogList));
    }


    @Test
    void testValidateKeyValueMapWithList() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();
        AuditLog auditLog = mock(AuditLog.class);
        when(auditLog.getKeyValueMap()).thenReturn(new HashMap<>());

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(auditLog);
        assertThrows(CustomException.class, () -> auditServiceValidator.validateKeyValueMap(auditLogList));
        verify(auditLog).getKeyValueMap();
    }


    @Test
    void testValidateKeyValueMapWithError() {


        AuditServiceValidator auditServiceValidator = new AuditServiceValidator();

        HashMap<String, Object> stringObjectMap = new HashMap<>();
        stringObjectMap.put("EG_AUDIT_LOGS_CREATE_ERR", "Value");
        AuditLog auditLog = mock(AuditLog.class);
        when(auditLog.getKeyValueMap()).thenReturn(stringObjectMap);

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(auditLog);
        auditServiceValidator.validateKeyValueMap(auditLogList);
        verify(auditLog).getKeyValueMap();
    }
}

