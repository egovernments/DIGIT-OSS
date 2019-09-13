package org.egov.web.notification.sms.service.smscountry.impl;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext;

import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.egov.web.notification.sms.config.SMSCountryPorperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "SMS_COUNTRY")
@Slf4j
public class SMSCountrySMSServiceImpl implements SMSService {

	private static final String SMS_RESPONSE_NOT_SUCCESSFUL = "Sms response not successful";

	private SMSCountryPorperties smsProperties;
	private RestTemplate restTemplate;

	@Autowired
	private SMSBodyBuilder bodyBuilder;

	@Value("${sms.smscountry.sender.requestType:POST}")
	private String requestType;

	@Value("${sms.verify.response:false}")
	private boolean verifyResponse;

	@Value("${sms.verify.responseContains:}")
	private String verifyResponseContains;

	@Value("${sms.verify.ssl:true}")
	private boolean verifySSL;


	@Autowired
	public SMSCountrySMSServiceImpl(SMSCountryPorperties smsProperties, RestTemplate restTemplate) {

		this.smsProperties = smsProperties;
		this.restTemplate = restTemplate;

		if (!verifySSL) {
			TrustStrategy acceptingTrustStrategy = new TrustStrategy() {
				@Override
				public boolean isTrusted(java.security.cert.X509Certificate[] x509Certificates, String s) {
					return true;
				}

			};

			SSLContext sslContext = null;
			try {
				sslContext = org.apache.http.ssl.SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy)
						.build();
			} catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			} catch (KeyManagementException e) {
				e.printStackTrace();
			} catch (KeyStoreException e) {
				e.printStackTrace();
			}
			SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
			CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			requestFactory.setHttpClient(httpClient);
			restTemplate.setRequestFactory(requestFactory);
		}
	}

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
			String url = smsProperties.getSmsProviderURL();
			ResponseEntity<String> response = new ResponseEntity<String>(HttpStatus.OK);
			HttpEntity<MultiValueMap<String, String>> request = getRequest(sms);
			response = restTemplate.postForEntity(url, request, String.class);
			if (isResponseCodeInKnownErrorCodeList(response))
				throw new RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL);
		} catch (RestClientException e) {
			log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
			throw e;
		}
	}

	private boolean isResponseCodeInKnownErrorCodeList(ResponseEntity<?> response) {
		final String responseCode = Integer.toString(response.getStatusCodeValue());
		return smsProperties.getSmsErrorCodes().stream().anyMatch(errorCode -> errorCode.equals(responseCode));
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
