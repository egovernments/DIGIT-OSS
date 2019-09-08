package org.egov.web.notification.mail.consumer;

import org.egov.web.notification.mail.consumer.contract.EmailRequest;
import org.egov.web.notification.mail.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationListener {

    @Autowired
    private EmailService emailService;

    public EmailNotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "${kafka.topics.notification.mail.name}")
    public void listen(EmailRequest emailRequest) {
        emailService.sendEmail(emailRequest.toDomain());
    }

}
