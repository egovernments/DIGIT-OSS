package org.egov.chat.xternal.responseformatter.ValueFirst;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@PropertySource("classpath:application.properties")
@Slf4j
@Service
public class ValueFirstRestCall {

    @Value("${valuefirst.send.message.url}")
    private String valueFirstSendMessageUrl;


    @Autowired
    private RestTemplate restTemplate;

    public void sendMessage(JsonNode response) {
        try {
            HttpHeaders httpHeaders = getDefaultHttpHeaders();

            HttpEntity<JsonNode> request = new HttpEntity<>(response, httpHeaders);

            ResponseEntity<JsonNode> valueFirstResponse = restTemplate.postForEntity(valueFirstSendMessageUrl, request, JsonNode.class);

            log.info("ValueFirst Send Message Response : " + valueFirstResponse.toString());
        } catch (Exception e) {
            log.error("error in value first rest call", e);
        }

    }

    HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }


}
