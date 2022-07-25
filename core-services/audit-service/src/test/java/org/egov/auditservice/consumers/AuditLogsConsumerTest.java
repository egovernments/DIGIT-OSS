package org.egov.auditservice.consumers;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;

import org.egov.auditservice.service.AuditLogProcessingService;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditLogsConsumer.class})
@ExtendWith(SpringExtension.class)
class AuditLogsConsumerTest {
    @MockBean
    private AuditLogProcessingService auditLogProcessingService;

    @Autowired
    private AuditLogsConsumer auditLogsConsumer;

    @MockBean
    private ObjectMapper objectMapper;

    //@Test
    void testListen() throws IllegalArgumentException {
        doNothing().when(auditLogProcessingService).process((AuditLogRequest) any());
        when(objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");
        //auditLogsConsumer.listen(new HashMap<>(), "Topic");
        verify(objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    //@Test
    void testListenWithAuditRequest() throws IllegalArgumentException {
        doNothing().when(auditLogProcessingService).process((AuditLogRequest) any());
        when(objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new AuditLogRequest());
        //auditLogsConsumer.listen(new HashMap<>(), "Topic");
        verify(auditLogProcessingService).process((AuditLogRequest) any());
        verify(objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }
}

