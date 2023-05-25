package org.egov.web.notification.mail.service;

import org.egov.web.notification.mail.consumer.contract.Email;

public interface EmailService {
    void sendEmail(Email email);
}
