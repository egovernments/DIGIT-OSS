package org.egov.auditservice.persisterauditclient.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.github.zafarkhaja.semver.UnexpectedCharacterException;
import com.github.zafarkhaja.semver.Version;

import java.util.ArrayList;
import java.util.List;

import org.egov.auditservice.persisterauditclient.models.contract.AuditAttributes;
import org.egov.auditservice.persisterauditclient.models.contract.RowData;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;

class AuditUtilTest {

    //@Test
    void testGetSemVer() {

        Version actualSemVer = (new AuditUtil()).getSemVer("1.0.2");
        assertEquals("", actualSemVer.getBuildMetadata());
        assertEquals("", actualSemVer.getPreReleaseVersion());
        assertEquals(2, actualSemVer.getPatchVersion());
        assertEquals(0, actualSemVer.getMinorVersion());
        assertEquals(1, actualSemVer.getMajorVersion());
    }


    //@Test
    void testGetSemVerWithNull() {

        assertNull((new AuditUtil()).getSemVer(null));
    }

    //@Test
    void testGetSemVerWithEmpty() {

        assertNull((new AuditUtil()).getSemVer((String) ""));
    }


    //@Test
    void testGetSemVer4() {

        assertNull((new AuditUtil()).getSemVer("Version present in API request is: "));
    }


    //@Test
    void testGetSemVerWithId() {

        assertNull((new AuditUtil()).getSemVer("42"));
    }

    //@Test
    void TestGetSemVer() {


        assertNull((new AuditUtil()).getSemVer("1.0.21.0.2"));
    }


    //@Test
    void testGetAuditRecord() {

        AuditUtil auditUtil = new AuditUtil();
        assertTrue(auditUtil.getAuditRecord(new ArrayList<>(), "Query").isEmpty());
    }


    //@Test
    void testGetAuditRecordWithData() {

        AuditUtil auditUtil = new AuditUtil();

        AuditAttributes auditAttributes = new AuditAttributes();
        auditAttributes.setAuditCorrelationId("42");
        auditAttributes.setModule("Module");
        auditAttributes.setObjectId("42");
        auditAttributes.setTenantId("42");
        auditAttributes.setTransactionCode("Transaction Code");
        auditAttributes.setUserUUID("01234567-89AB-CDEF-FEDC-BA9876543210");
        RowData rowData = mock(RowData.class);
        when(rowData.getAuditAttributes()).thenReturn(auditAttributes);

        ArrayList<RowData> rowDataList = new ArrayList<>();
        rowDataList.add(rowData);
        assertThrows(CustomException.class, () -> auditUtil.getAuditRecord(rowDataList, "Query"));
        verify(rowData).getAuditAttributes();
    }


}

