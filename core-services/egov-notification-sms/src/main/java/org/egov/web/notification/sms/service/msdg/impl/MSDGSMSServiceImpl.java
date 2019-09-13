package org.egov.web.notification.sms.service.msdg.impl;

import org.egov.web.notification.sms.config.MSDGProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "MSDG")
public class MSDGSMSServiceImpl implements SMSService {

	private RestTemplate restTemplate;

	@Autowired
	private MSDGProperties smsProperties;

	@Autowired
	private SMSBodyBuilder bodyBuilder;

	@Override
	public void sendSMS(Sms sms) {
		if (!sms.isValid()) {
			log.error(String.format("Sms %s is not valid", sms));
			return;
		}
		submitToExternalSmsService(sms);
	}

	private void submitToExternalSmsService(Sms sms) {
		try {
			String url = smsProperties.getUrl();
			final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
			String final_url = UriComponentsBuilder.fromHttpUrl(url).queryParams(requestBody).toUriString();
			restTemplate.getForObject(final_url, String.class);
		} catch (RestClientException e) {
			log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
			throw e;
		}
	}

}
