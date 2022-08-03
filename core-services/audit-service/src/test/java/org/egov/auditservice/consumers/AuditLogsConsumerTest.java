package org.egov.auditservice.consumers;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.auditservice.persisterauditclient.PersisterAuditClientService;
import org.egov.auditservice.persisterauditclient.models.contract.PersisterClientInput;
import org.egov.auditservice.service.AuditLogProcessingService;
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

    @MockBean
    private PersisterAuditClientService persisterAuditClientService;


    @Test
    void testListen() throws JsonProcessingException {
        when(persisterAuditClientService.generateAuditLogs((PersisterClientInput) any())).thenReturn(new ArrayList<>());
        when(objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        auditLogsConsumer.listen(new HashMap<>(), "Topic");
        verify(persisterAuditClientService).generateAuditLogs((PersisterClientInput) any());
        verify(objectMapper).writeValueAsString((Object) any());
    }
}

