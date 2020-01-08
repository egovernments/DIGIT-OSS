package org.egov.pt.consumer;

import org.egov.pt.service.NotificationService;
import org.egov.pt.service.PaymentNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyNotificationConsumer {

    @Autowired
    private NotificationService notificationService;


    @Autowired
    private PaymentNotificationService paymentNotificationService;
    
    @Autowired
    private ObjectMapper mapper;


//    @KafkaListener(topics = {"${persister.save.property.topic}","${persister.update.property.topic}"})
//    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
//    	
//        PropertyRequest propertyRequest = new PropertyRequest();
//        try {
//        	
//            log.debug("Consuming record: " + record);
//            propertyRequest = mapper.convertValue(record, PropertyRequest.class);
//        } catch (final Exception e) {
//        	
//            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
//        }
//        
//        log.info("property Received: "+propertyRequest.getProperty().getPropertyId());
//
//        Source source = propertyRequest.getProperty().getSource();
//
//        if (source == null || !source.equals(Source.DATA_MIGRATION))
//            notificationService.process(propertyRequest,topic);
//    }
//
//
//    @KafkaListener(topics = {"${kafka.topics.notification.fullpayment}","${kafka.topics.notification.pg.save.txns}"})
//    public void listenPayments(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
//    	
//        paymentNotificationService.process(record,topic);
//    }
//




}
