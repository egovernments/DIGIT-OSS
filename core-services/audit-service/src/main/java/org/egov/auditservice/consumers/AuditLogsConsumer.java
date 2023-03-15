package org.egov.auditservice.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.auditservice.persisterauditclient.PersisterAuditClientService;
import org.egov.auditservice.persisterauditclient.models.contract.PersisterClientInput;
import org.egov.auditservice.service.AuditLogProcessingService;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@Slf4j
public class AuditLogsConsumer {

    @Autowired
    private AuditLogProcessingService auditService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private PersisterAuditClientService auditLogsProcessingService;

    @KafkaListener(topics = { "${process.audit.logs.kafka.topic}"})
    public void listen(final HashMap<String, Object> data, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            PersisterClientInput input = PersisterClientInput.builder()
                    .topic((String) data.get("topic"))
                    .json(mapper.writeValueAsString(data.get("value")))
                    .build();
            auditLogsProcessingService.generateAuditLogs(input);
        } catch (Exception ex) {
            StringBuilder builder = new StringBuilder("Error while listening to value: ").append(data)
                    .append("on topic: ").append(topic);
            log.error(builder.toString(), ex);
        }
    }

}
