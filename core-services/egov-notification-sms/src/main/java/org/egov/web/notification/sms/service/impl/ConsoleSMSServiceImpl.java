package org.egov.web.notification.sms.service.impl;

import lombok.extern.slf4j.*;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "Console")
public class ConsoleSMSServiceImpl extends BaseSMSService {

    @Override
    protected void submitToExternalSmsService(Sms sms) {
        log.info(String.format("Sending sms to %s with message '%s'",
                sms.getMobileNumber(), sms.getMessage()));

    }
}
