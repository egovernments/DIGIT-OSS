package org.egov.web.notification.sms.service.spicedigital.impl;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import javax.net.ssl.SSLContext;

import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.egov.web.notification.sms.config.SpiceDigitalProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
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

	private static final String SMS_RESPONSE_NOT_SUCCESSFUL = "Sms response not successful";

	private SpiceDigitalProperties smsProperties;
	private RestTemplate restTemplate;
	
    @Autowired
    private SMSBodyBuilder bodyBuilder;

	@Value("${sms.spicedigital.sender.requestType:POST}")
	private String requestType;

	@Value("${sms.verify.response:false}")
	private boolean verifyResponse;

	@Value("${sms.verify.responseContains:}")
	private String verifyResponseContains;

	@Value("${sms.verify.ssl:true}")
	private boolean verifySSL;

	@Value("${sms.url.dont_encode_url:true}")
	private boolean dontEncodeURL;

	@Autowired
	public SpiceDigitalSMSServiceImpl(SpiceDigitalProperties smsProperties, RestTemplate restTemplate) {

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
			final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
			String final_url = UriComponentsBuilder.fromHttpUrl(url).queryParams(requestBody).toUriString();
			if (dontEncodeURL) {
				final_url = final_url.replace("%20", " ").replace("%2B", "+");
			}
			String responseString = restTemplate.getForObject(final_url, String.class);
			if (verifyResponse && !responseString.contains(verifyResponseContains)) {
				log.error("Response from API - " + responseString);
				throw new RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL);
			}

		} catch (RestClientException e) {
			log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
			throw e;
		}
	}

/*	private HttpEntity<MultiValueMap<String, String>> getRequest(Sms sms) {
		final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
		return new HttpEntity<>(requestBody, getHttpHeaders());
	}

	private HttpHeaders getHttpHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		return headers;
	} */

}
