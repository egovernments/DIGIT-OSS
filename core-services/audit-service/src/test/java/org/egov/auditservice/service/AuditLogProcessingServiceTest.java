package org.egov.auditservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.auditservice.producer.Producer;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.validator.AuditServiceValidator;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditLogProcessingService.class})
@ExtendWith(SpringExtension.class)
class AuditLogProcessingServiceTest {
    @Autowired
    private AuditLogProcessingService auditLogProcessingService;

    @MockBean
    private AuditServiceRepository auditServiceRepository;

    @MockBean
    private AuditServiceValidator auditServiceValidator;

    @MockBean
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @MockBean
    private EnrichmentService enrichmentService;

    @MockBean
    private Producer producer;


    //@Test
    void testProcess() {
        doNothing().when(chooseSignerAndVerifier).selectImplementationAndSign((AuditLogRequest) any());
        doNothing().when(enrichmentService).enrichAuditLogs((AuditLogRequest) any());
        doNothing().when(producer).push((String) any(), (Object) any());
        auditLogProcessingService.process(new AuditLogRequest());
        verify(chooseSignerAndVerifier).selectImplementationAndSign((AuditLogRequest) any());
        verify(enrichmentService).enrichAuditLogs((AuditLogRequest) any());
        verify(producer).push((String) any(), (Object) any());
    }


    //@Test
    void testGetAuditLogs() {
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(new ArrayList<>());
        doNothing().when(auditServiceValidator).validateAuditLogSearch((AuditLogSearchCriteria) any());
        RequestInfo requestInfo = new RequestInfo();
        assertTrue(auditLogProcessingService.getAuditLogs(requestInfo, new AuditLogSearchCriteria()).isEmpty());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
        verify(auditServiceValidator).validateAuditLogSearch((AuditLogSearchCriteria) any());
    }


    //@Test
    void testGetAuditLogsWithAuditLogList() {
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(auditLogList);
        doNothing().when(auditServiceValidator).validateAuditLogSearch((AuditLogSearchCriteria) any());
        RequestInfo requestInfo = new RequestInfo();
        List<AuditLog> actualAuditLogs = auditLogProcessingService.getAuditLogs(requestInfo, new AuditLogSearchCriteria());
        assertSame(auditLogList, actualAuditLogs);
        assertEquals(1, actualAuditLogs.size());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
        verify(auditServiceValidator).validateAuditLogSearch((AuditLogSearchCriteria) any());
    }


    //@Test
    void testVerifyDbEntity() {
        doNothing().when(chooseSignerAndVerifier).selectImplementationAndVerify((ObjectIdWrapper) any());
        auditLogProcessingService.verifyDbEntity("42", new HashMap<>());
        verify(chooseSignerAndVerifier).selectImplementationAndVerify((ObjectIdWrapper) any());
    }
}

