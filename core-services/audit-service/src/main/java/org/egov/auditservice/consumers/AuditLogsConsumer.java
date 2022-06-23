package org.egov.auditservice.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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


    @KafkaListener(topics = { "${process.audit.logs.kafka.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            AuditLogRequest request = mapper.convertValue(record, AuditLogRequest.class);
            auditService.process(request);
        } catch (Exception ex) {
            StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
                    .append("on topic: ").append(topic);
            log.error(builder.toString(), ex);
        }
    }

}
