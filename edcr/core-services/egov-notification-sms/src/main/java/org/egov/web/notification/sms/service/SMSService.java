package org.egov.web.notification.sms.service;

import org.egov.web.notification.sms.models.Sms;

public interface SMSService {
    void sendSMS(Sms sms);
}

