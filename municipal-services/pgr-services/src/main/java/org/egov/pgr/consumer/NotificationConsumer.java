
package org.egov.pgr.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pgr.service.NotificationService;
import org.egov.pgr.util.PGRConstants;
import org.egov.pgr.web.models.ServiceRequest;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import static org.apache.kafka.common.requests.FetchMetadata.log;
import static org.egov.pgr.util.PGRConstants.TENANTID_MDC_STRING;

@Component
@Slf4j
public class NotificationConsumer {
    @Autowired
    NotificationService notificationService;

    @Autowired
    private ObjectMapper mapper;


/**
     * Consumes record and send notification
     *
     * @param record
     * @param topic
     */

    @KafkaListener(topicPattern = "${pgr.kafka.notification.topic.pattern}")
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            ServiceRequest request = mapper.convertValue(record, ServiceRequest.class);

            String tenantId = request.getService().getTenantId();

            // Adding in MDC so that tracer can add it in header
            MDC.put(PGRConstants.TENANTID_MDC_STRING, tenantId);

            notificationService.process(request, topic);
        } catch (Exception ex) {
            StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
                    .append("on topic: ").append(topic);
            log.error(builder.toString(), ex);
        }
    }
}

