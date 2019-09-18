package org.egov.web.notification.sms.service.impl;

import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "DEFAULT", matchIfMissing = true)
@Slf4j
public class DefaultServiceImpl implements SMSService {
	
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
            HttpEntity<HttpEntity<MultiValueMap<String, String>>> request = new HttpEntity<>(getRequest(sms), getHttpHeaders());
			String response = restTemplate.postForObject(url, request, String.class);
			log.info("response: "+response);
		} catch (RestClientException e) {
			log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
			throw e;
		}
	}
	
	private HttpEntity<MultiValueMap<String, String>> getRequest(Sms sms) {
		final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
		return new HttpEntity<>(requestBody, getHttpHeaders());
	}

	private HttpHeaders getHttpHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		return headers;
	}

}
