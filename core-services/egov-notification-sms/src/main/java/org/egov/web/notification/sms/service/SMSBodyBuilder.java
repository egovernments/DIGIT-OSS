package org.egov.web.notification.sms.service;

import org.egov.web.notification.sms.models.Sms;
import org.springframework.util.MultiValueMap;

public interface SMSBodyBuilder {

    MultiValueMap<String, String> getSmsRequestBody(Sms sms);

}
