package org.egov.auditservice.service.implementations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.bouncycastle.crypto.macs.HMac;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
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

    @MockBean
    private HMac hMac;

    @Autowired
    private HmacImplementation hmacImplementation;

    @MockBean
    private ObjectMapper objectMapper;


    @Test
    void testSignWithEmpty() {
        RequestInfo requestInfo = new RequestInfo();
        AuditLogRequest auditLogRequest = new AuditLogRequest(requestInfo, new ArrayList<>());
        hmacImplementation.sign(auditLogRequest);
        assertTrue(auditLogRequest.getAuditLogs().isEmpty());
        assertSame(requestInfo, auditLogRequest.getRequestInfo());
    }


    @Test
    void testSignWitharray() {
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(new ArrayList<>());
        hmacImplementation.sign(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testSignwithid() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(3);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        hmacImplementation.sign(auditLogRequest);
        verify(hMac).doFinal((byte[]) any(), anyInt());
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testSignWitherror() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenThrow(new CustomException("Code", "An error occurred"));
        when(hMac.getMacSize()).thenThrow(new CustomException("Code", "An error occurred"));
        doThrow(new CustomException("Code", "An error occurred")).when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.sign(auditLogRequest));
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testSignwithID() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(-1);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.sign(auditLogRequest));
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }

    @Test
    void testSign() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(3);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        hmacImplementation.sign(auditLogRequest);
        verify(hMac, atLeast(1)).doFinal((byte[]) any(), anyInt());
        verify(hMac, atLeast(1)).getMacSize();
        verify(hMac, atLeast(1)).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper, atLeast(1)).writeValueAsString((Object) any());
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testSignwithauditRequest() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(3);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(null);
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.sign(auditLogRequest));
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testHashData() {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(3);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        assertEquals("000000", hmacImplementation.hashData("Data"));
        verify(hMac).doFinal((byte[]) any(), anyInt());
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
    }


    @Test
    void testHashDatawithdata() {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(-1);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        assertThrows(NegativeArraySizeException.class, () -> hmacImplementation.hashData("Data"));
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
    }


    @Test
    void testHashDatawitherror() {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenThrow(new CustomException("Code", "An error occurred"));
        when(hMac.getMacSize()).thenThrow(new CustomException("Code", "An error occurred"));
        doThrow(new CustomException("Code", "An error occurred")).when(hMac).update((byte[]) any(), anyInt(), anyInt());
        assertThrows(CustomException.class, () -> hmacImplementation.hashData("Data"));
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
    }


    @Test
    void testVerify() {
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(new ArrayList<>());
        assertThrows(CustomException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }


    @Test
    void testVerifywithid() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(3);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(hMac).doFinal((byte[]) any(), anyInt());
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }


    @Test
    void testVerifyWithError() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt()))
                .thenThrow(new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "An error occurred"));
        when(hMac.getMacSize()).thenThrow(new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "An error occurred"));
        doThrow(new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "An error occurred")).when(hMac)
                .update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(auditLogList);
        assertThrows(CustomException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }

    @Test
    void testVerifyWithValue() throws JsonProcessingException {
        when(hMac.doFinal((byte[]) any(), anyInt())).thenReturn(1);
        when(hMac.getMacSize()).thenReturn(-1);
        doNothing().when(hMac).update((byte[]) any(), anyInt(), anyInt());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        when(auditServiceRepository.getAuditLogsFromDb((AuditLogSearchCriteria) any())).thenReturn(auditLogList);
        assertThrows(NegativeArraySizeException.class, () -> hmacImplementation.verify(new ObjectIdWrapper()));
        verify(hMac).getMacSize();
        verify(hMac).update((byte[]) any(), anyInt(), anyInt());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(auditServiceRepository).getAuditLogsFromDb((AuditLogSearchCriteria) any());
    }


    @Test
    void testConstructor() {
        assertEquals("HMAC", (new HmacImplementation()).getSigningAlgorithm());
    }
}

