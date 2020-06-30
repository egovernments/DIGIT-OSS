package org.egov.web.notification.mail.service;

import org.egov.web.notification.mail.consumer.contract.Email;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(value = "mail.enabled", havingValue = "false", matchIfMissing = true)
public class ConsoleEmailService implements EmailService {

    @Override
    public void sendEmail(Email email) {
        System.out.println(
                String.format(
                        "Sending email to %s with subject %s and body %s",
                        email.getEmailTo(),
                        email.getSubject(),
                        email.getBody()
                )
        );
    }
}
