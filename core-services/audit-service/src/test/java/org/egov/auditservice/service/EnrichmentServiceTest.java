package org.egov.auditservice.service;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.auditservice.web.models.AuditLog;

import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {EnrichmentService.class})
@ExtendWith(SpringExtension.class)
class EnrichmentServiceTest {
    @Autowired
    private EnrichmentService enrichmentService;



    //@Test
    void testEnrichAuditLogsWithEmptyRequest() {
        RequestInfo requestInfo = new RequestInfo();
        AuditLogRequest auditLogRequest = new AuditLogRequest(requestInfo, new ArrayList<>());
        enrichmentService.enrichAuditLogs(auditLogRequest);
        assertTrue(auditLogRequest.getAuditLogs().isEmpty());
        assertSame(requestInfo, auditLogRequest.getRequestInfo());
    }


    //@Test
    void testEnrichAuditLogsWithAudiLogRequest() {
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(new ArrayList<>());
        enrichmentService.enrichAuditLogs(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testEnrichAuditLogsWithAuditLogList() {
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        enrichmentService.enrichAuditLogs(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testEnrichAuditLogsAddMultipleLog() {
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        enrichmentService.enrichAuditLogs(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }
}

