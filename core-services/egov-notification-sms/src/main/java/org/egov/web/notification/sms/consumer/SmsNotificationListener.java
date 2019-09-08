package org.egov.web.notification.sms.consumer;

import org.egov.web.notification.sms.consumer.contract.SMSRequest;
import org.egov.web.notification.sms.models.RequestContext;
import org.egov.web.notification.sms.services.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SmsNotificationListener {

    private SMSService smsService;

    @Autowired
    public SmsNotificationListener(SMSService smsService) {
        this.smsService = smsService;
    }

    @KafkaListener(id = "${kafka.topics.notification.sms.id}",
            topics = "${kafka.topics.notification.sms.name}",
            group = "${kafka.topics.notification.sms.group}")
    public void process(SMSRequest request) {
        RequestContext.setId(UUID.randomUUID().toString());
        smsService.sendSMS(request.toDomain());
    }

}

