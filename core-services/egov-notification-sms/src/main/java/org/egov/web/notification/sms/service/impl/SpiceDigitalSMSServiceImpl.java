package org.egov.web.notification.sms.service.impl;

import java.util.Map;

import org.egov.web.notification.sms.config.SMSProperties;
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
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "SPICE_DIGITAL")
@Slf4j
public class SpiceDigitalSMSServiceImpl implements SMSService {
	
    @Autowired
    private SMSBodyBuilder bodyBuilder;
    
    @Autowired
	private SMSProperties smsProperties;
    
    @Autowired
	private RestTemplate restTemplate;

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
			url = UriComponentsBuilder.fromHttpUrl(url).queryParams(requestBody).toUriString();
			log.debug("URL: "+url);
			String response = restTemplate.getForObject(url, String.class);
			log.info("response: "+response);
		} catch (RestClientException e) {
			log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
			throw e;
		}
	}

}
