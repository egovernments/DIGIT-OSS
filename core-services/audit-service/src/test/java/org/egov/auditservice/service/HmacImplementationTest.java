package org.egov.auditservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.ArrayList;

import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.service.implementations.HmacImplementation;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {HmacImplementation.class})
@ExtendWith(SpringExtension.class)
class HmacImplementationTest {
    @MockBean
    private AuditServiceRepository auditServiceRepository;

    @Autowired
    private HmacImplementation hmacImplementation;

    @MockBean
    private ObjectMapper objectMapper;


    //@Test
    void testSign() {
        RequestInfo requestInfo = new RequestInfo();
        AuditLogRequest auditLogRequest = new AuditLogRequest(requestInfo, new ArrayList<>());
        hmacImplementation.sign(auditLogRequest);
        assertTrue(auditLogRequest.getAuditLogs().isEmpty());
        assertSame(requestInfo, auditLogRequest.getRequestInfo());
    }


    //@Test
    void testSignWithArrayList() {
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(new ArrayList<>());
        hmacImplementation.sign(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testSignWithSingleAuditLog() throws JsonProcessingException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        hmacImplementation.sign(auditLogRequest);
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testSignWithMultipleAddAuditLog() throws JsonProcessingException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        hmacImplementation.sign(auditLogRequest);
        verify(objectMapper, atLeast(1)).configure((SerializationFeature) any(), anyBoolean());
        verify(objectMapper, atLeast(1)).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testSignWithNullAuditLog() throws JsonProcessingException {
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(null);
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.sign(auditLogRequest));
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testSignWithErrorCode() throws JsonProcessingException {
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        AuditLog auditLog = mock(AuditLog.class);
        when(auditLog.getKeyValueMap()).thenThrow(new CustomException("Code", "An error occurred"));
        doThrow(new CustomException("Code", "An error occurred")).when(auditLog).setIntegrityHash((String) any());
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(auditLog);
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.sign(auditLogRequest));
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(auditLogRequest).getAuditLogs();
    }


    //@Test
    void testHashData() {
        assertEquals("6994b07ba71815e45a67cf104bfbbc9458a13c7de80925126c1732133f822443",
                hmacImplementation.hashData("Data"));
        assertEquals("36ed0a3f878c039fe5282a04e36047bcc347b5c35b7a1435ae44de3d9e3e8401",
                hmacImplementation.hashData("EG_AUDIT_LOG_VERIFICATION_ERR"));
    }


    //@Test
    void testVerify() {
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(new ArrayList<>());
        assertThrows(CustomException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }


    //@Test
    void testVerifyWithAuditLog() throws JsonProcessingException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(objectMapper, atLeast(1)).configure((SerializationFeature) any(), anyBoolean());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }

    //@Test
    void testConstructor() {
        assertEquals("HMAC", (new HmacImplementation()).getSigningAlgorithm());
    }
}

