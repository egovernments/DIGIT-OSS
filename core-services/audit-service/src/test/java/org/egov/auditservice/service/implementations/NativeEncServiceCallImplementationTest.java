package org.egov.auditservice.service.implementations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.auditservice.repository.ServiceRequestRepository;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.auditservice.web.models.encryptionclient.SignResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {NativeEncServiceCallImplementation.class})
@ExtendWith(SpringExtension.class)
class NativeEncServiceCallImplementationTest {
    @Autowired
    private NativeEncServiceCallImplementation nativeEncServiceCallImplementation;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;



    @Test
    void testSign2() {
        RequestInfo requestInfo = new RequestInfo();
        AuditLogRequest auditLogRequest = new AuditLogRequest(requestInfo, new ArrayList<>());

        nativeEncServiceCallImplementation.sign(auditLogRequest);
        assertTrue(auditLogRequest.getAuditLogs().isEmpty());
        assertSame(requestInfo, auditLogRequest.getRequestInfo());
    }


    @Test
    void testSign4() {
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(new ArrayList<>());
        nativeEncServiceCallImplementation.sign(auditLogRequest);
        verify(auditLogRequest).getAuditLogs();
    }


    @Test
    void testSign5() throws JsonProcessingException, IllegalArgumentException {
        when(objectMapper.convertValue((Object) any(), (Class<SignResponse>) any()))
                .thenReturn(new SignResponse("42", "Signature"));
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        when(serviceRequestRepository.fetchResult((String) any(), (Object) any())).thenReturn("Fetch Result");

        ArrayList<AuditLog> auditLogList = new ArrayList<>();
        auditLogList.add(new AuditLog());
        AuditLogRequest auditLogRequest = mock(AuditLogRequest.class);
        when(auditLogRequest.getAuditLogs()).thenReturn(auditLogList);
        nativeEncServiceCallImplementation.sign(auditLogRequest);
        verify(objectMapper).convertValue((Object) any(), (Class<SignResponse>) any());
        verify(objectMapper).writeValueAsString((Object) any());
        verify(serviceRequestRepository).fetchResult((String) any(), (Object) any());
        verify(auditLogRequest).getAuditLogs();
    }



    @Test
    void testVerify() {
        assertNull(nativeEncServiceCallImplementation.verify(new ObjectIdWrapper()));
    }


    @Test
    void testConstructor() {
        assertEquals("NATIVE_ENC", (new NativeEncServiceCallImplementation()).getSigningAlgorithm());
    }
}

