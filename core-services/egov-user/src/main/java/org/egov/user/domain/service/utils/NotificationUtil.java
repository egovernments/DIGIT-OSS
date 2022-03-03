package org.egov.user.domain.service.utils;

import java.util.Collections;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.user.domain.model.Email;
import org.egov.user.domain.model.EmailRequest;
import org.egov.user.domain.model.SMSRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class NotificationUtil {

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.notification.mail.name}")
    public String emailNotificationTopic;

    @Value("${kafka.topics.notification.sms.topic.name}")
    public String smsNotificationTopic;

    public void sendEmail(RequestInfo requestInfo, String oldEmail, String newEmail, String mobileNumber) {
        String emailUpdationMessage = "Dear Citizen, your e-mail has been updated from <oldEmail> to <newEmail>";
        emailUpdationMessage = emailUpdationMessage.replace("<oldEmail>",oldEmail);
        emailUpdationMessage = emailUpdationMessage.replace("<newEmail>",newEmail);

        Email email = new Email();
        email.setEmailTo(Collections.singleton(oldEmail));
        email.setSubject("Email Update Notification");
        email.setBody(emailUpdationMessage);
        email.setHTML(false);

        SMSRequest smsRequest = new SMSRequest();
        smsRequest.setMobileNumber(mobileNumber);
        smsRequest.setMessage(emailUpdationMessage);

        EmailRequest emailRequest = EmailRequest.builder().requestInfo(requestInfo).email(email).build();
        kafkaTemplate.send(emailNotificationTopic,emailRequest);
        kafkaTemplate.send(smsNotificationTopic,smsRequest);


    }

}