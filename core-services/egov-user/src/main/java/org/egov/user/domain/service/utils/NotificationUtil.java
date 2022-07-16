package org.egov.user.domain.service.utils;

import java.util.Collections;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.user.domain.model.Email;
import org.egov.user.domain.model.EmailRequest;
import org.egov.user.domain.model.SMSRequest;
import org.egov.user.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static org.egov.user.config.UserServiceConstants.EMAIL_UPDATION_CODE;


@Slf4j
@Component
public class NotificationUtil {

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    private LocalizationUtil localizationUtil;

    @Value("${kafka.topics.notification.mail.name}")
    public String emailNotificationTopic;

    @Value("${kafka.topics.notification.sms.topic.name}")
    public String smsNotificationTopic;

    public void sendEmail(RequestInfo requestInfo, User existingUser, User updatedUser) {
        String oldEmail = existingUser.getEmailId();
        String newEmail = updatedUser.getEmailId();
        String mobileNumber = existingUser.getMobileNumber();
        String locale = existingUser.getLocale();

        String emailUpdationMessage = localizationUtil.getLocalizedMessage(EMAIL_UPDATION_CODE,locale,requestInfo);
        emailUpdationMessage = emailUpdationMessage.replace("{oldEmail}",oldEmail);
        emailUpdationMessage = emailUpdationMessage.replace("{newEmail}",newEmail);

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
