package org.egov.web.notification.sms.service.msdg.impl;

import org.egov.web.notification.sms.config.MSDGProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "MSDG")
public class MSDGSMSBodyBuilderImpl implements SMSBodyBuilder {
	
	@Autowired
	private MSDGProperties smsProps;

	
    public MultiValueMap<String, String> getSmsRequestBody(Sms sms) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add(smsProps.getUsernameParameter(), smsProps.getUsername());
        map.add(smsProps.getPasswordParameter(), smsProps.getPassword());
        map.add(smsProps.getSenderidParameter(), smsProps.getSenderid());
        map.add(smsProps.getSmsservicetypeParameter(), smsProps.getSmsservicetype());
        map.add(smsProps.getMobileNoParameter(), sms.getMobileNumber());
        map.add(smsProps.getMessageParameter(), sms.getMessage());

        return map;
    }

}
