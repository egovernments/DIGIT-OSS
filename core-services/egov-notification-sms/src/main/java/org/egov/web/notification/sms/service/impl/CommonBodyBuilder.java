package org.egov.web.notification.sms.service.impl;

import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Component
public class CommonBodyBuilder implements SMSBodyBuilder {

	@Autowired
	private SMSProperties smsProps;

	public MultiValueMap<String, String> getSmsRequestBody(Sms sms) {
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		for (String key : smsProps.getConfigMap().keySet()) {
			String value = smsProps.getConfigMap().get(key);
			if (value.contains("$")) {
				if (value.equals("$username")) {
					map.add(key, smsProps.getUsername());
				} else if (value.equals("$password")) {
					map.add(key, smsProps.getPassword());
				} else if (value.equals("$senderid")) {
					map.add(key, smsProps.getSenderid());
				} else if (value.equals("$securekey")) {
					map.add(key, smsProps.getSecureKey());
				} else if (value.equals("$mobileno")) {
					map.add(key, sms.getMobileNumber());
				} else if (value.equals("$message")) {
					map.add(key, sms.getMessage());
				} else
					map.add(key, value);
			} else {
				map.add(key, value);
			}

		}

		return map;
	}

}
