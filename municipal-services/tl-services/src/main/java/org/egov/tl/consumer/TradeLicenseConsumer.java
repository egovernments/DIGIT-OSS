package org.egov.tl.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.tl.service.notification.TLNotificationService;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;


@Slf4j
@Component
public class TradeLicenseConsumer {

    private TLNotificationService notificationService;

    @Autowired
    public TradeLicenseConsumer(TLNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = {"${persister.update.tradelicense.topic}","${persister.save.tradelicense.topic}","${persister.update.tradelicense.workflow.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        ObjectMapper mapper = new ObjectMapper();
        TradeLicenseRequest tradeLicenseRequest = new TradeLicenseRequest();
        try {
            log.info("Consuming record: " + record);
            tradeLicenseRequest = mapper.convertValue(record, TradeLicenseRequest.class);
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
        log.info("TradeLicense Received: "+tradeLicenseRequest.getLicenses().get(0).getApplicationNumber());
        notificationService.process(tradeLicenseRequest);
    }



}
