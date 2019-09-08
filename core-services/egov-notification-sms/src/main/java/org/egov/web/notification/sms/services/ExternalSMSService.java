/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.web.notification.sms.services;


import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;


import org.egov.web.notification.sms.config.SmsProperties;
import org.egov.web.notification.sms.models.Sms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.http.*;

import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;


@Service
@ConditionalOnProperty(value = "sms.enabled", havingValue = "true")
public class ExternalSMSService implements SMSService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExternalSMSService.class);

    private static final String SMS_RESPONSE_NOT_SUCCESSFUL = "Sms response not successful";

    private SmsProperties smsProperties;
    private RestTemplate restTemplate;

    @Value("${sms.sender.requestType:POST}")
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
    public ExternalSMSService(SmsProperties smsProperties, RestTemplate restTemplate) {

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
            LOGGER.error(String.format("Sms %s is not valid", sms));
            return;
        }
        submitToExternalSmsService(sms);
    }

    private void submitToExternalSmsService(Sms sms) {
        try {
            
            String url = smsProperties.getSmsProviderURL();
            ResponseEntity<String> response = new ResponseEntity<String>(HttpStatus.OK);
            if (requestType.equals("POST"))
            {
                HttpEntity<MultiValueMap<String, String>> request = getRequest(sms);
                response = restTemplate.postForEntity(url, request, String.class);
                if (isResponseCodeInKnownErrorCodeList(response)) {
                    throw new RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL);
                }
            } else {
               final MultiValueMap<String, String> requestBody = smsProperties.getSmsRequestBody(sms);


               String final_url = UriComponentsBuilder.fromHttpUrl(url).queryParams(requestBody).toUriString();

               if (dontEncodeURL) {
                   final_url = final_url.replace("%20", " ").replace("%2B", "+");
               }

               String responseString = restTemplate.getForObject(final_url, String.class);
               
               if (verifyResponse && !responseString.contains(verifyResponseContains)) {
                   LOGGER.error("Response from API - " + responseString);
                   throw new RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL);
               }
            }

        } catch (RestClientException e) {
            LOGGER.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
            throw e;
        }
    }

    private boolean isResponseCodeInKnownErrorCodeList(ResponseEntity<?> response) {
        final String responseCode = Integer.toString(response.getStatusCodeValue());
        return smsProperties.getSmsErrorCodes().stream().anyMatch(errorCode -> errorCode.equals(responseCode));
    }

    private HttpEntity<MultiValueMap<String, String>> getRequest(Sms sms) {
        final MultiValueMap<String, String> requestBody = smsProperties.getSmsRequestBody(sms);
        return new HttpEntity<>(requestBody, getHttpHeaders());
    }

    private HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

}
