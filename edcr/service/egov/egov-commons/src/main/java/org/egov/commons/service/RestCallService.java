
package org.egov.commons.service;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RestCallService {
    private static final Logger LOG = Logger.getLogger(RestCallService.class);

    public Object fetchResult(StringBuilder uri, Object request) {
        Object response = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            LOG.info("URI: " + uri.toString());
            LOG.info("Request: " + mapper.writeValueAsString(request));
            RestTemplate restTemplate = new RestTemplate();
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        } catch (HttpClientErrorException | JsonProcessingException e) {
            LOG.error("Error occurred while calling API", e);
        }

        return response;
    }

}
