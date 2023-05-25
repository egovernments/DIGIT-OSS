package org.egov.web.notification.sms.service.impl;


import lombok.extern.slf4j.*;
import org.egov.web.notification.sms.service.*;


import org.egov.web.notification.sms.models.Sms;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.http.*;

import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.*;


@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "Generic")
public class GenericSMSServiceImpl extends BaseSMSService {

    @Value("${sms.url.dont_encode_url:true}")
    private boolean dontEncodeURL;


    protected void submitToExternalSmsService(Sms sms) {
        try {

            String url = smsProperties.getUrl();

            if (smsProperties.requestType.equals("POST")) {
                HttpEntity<MultiValueMap<String, String>> request = getRequest(sms);

                executeAPI(URI.create(url), HttpMethod.POST, request, String.class);

            } else {
                final MultiValueMap<String, String> requestBody = getSmsRequestBody(sms);

                URI final_url = UriComponentsBuilder.fromHttpUrl(url).queryParams(requestBody).build().encode().toUri();

                executeAPI(final_url, HttpMethod.GET, null, String.class);
            }

        } catch (RestClientException e) {
            log.error("Error occurred while sending SMS to " + sms.getMobileNumber(), e);
            throw e;
        }
    }


}
