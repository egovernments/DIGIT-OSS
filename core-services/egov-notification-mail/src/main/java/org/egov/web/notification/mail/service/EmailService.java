package org.egov.web.notification.mail.service;

import org.egov.web.notification.mail.model.Email;

public interface EmailService {
    void sendEmail(Email email);
}
