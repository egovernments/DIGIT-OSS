package org.egov.echallan.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import java.util.HashMap;



@Slf4j
@Component
public class ChallanConsumer {

    private NotificationService notificationService;

    private ChallanConfiguration config;
    
    @Autowired
    public ChallanConsumer(NotificationService notificationService,ChallanConfiguration config) {
        this.notificationService = notificationService;
        this.config = config;
    }

    @KafkaListener(topics = {"${persister.save.challan.topic}","${persister.update.challan.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
        ObjectMapper mapper = new ObjectMapper();
        ChallanRequest challanRequest = new ChallanRequest();
  
            challanRequest = mapper.convertValue(record, ChallanRequest.class);

        if(topic.equalsIgnoreCase(config.getSaveChallanTopic()))
        	notificationService.sendChallanNotification(challanRequest,true);
        else if(topic.equalsIgnoreCase(config.getUpdateChallanTopic()))
            notificationService.sendChallanNotification(challanRequest,false);
        } catch (final Exception e) {
        	e.printStackTrace();
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
    }
}
