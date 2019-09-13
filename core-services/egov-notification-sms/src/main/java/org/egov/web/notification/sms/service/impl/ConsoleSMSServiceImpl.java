package org.egov.web.notification.sms.service.impl;

import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "Console")
public class ConsoleSMSServiceImpl implements SMSService {

    @Override
    public void sendSMS(Sms sms) {
        System.out.println(String.format("Sending sms to %s with message '%s'",
                sms.getMobileNumber(), sms.getMessage()));
    }
}
