package org.egov.chat.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@PropertySources({
        @PropertySource("classpath:xternal.properties"),
        @PropertySource("classpath:application.properties")
})
public class URLShorteningSevice {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${egov.urlshortner.host}")
    private String urlShortnerServiceHost;

    @Value("${egov.urlshortner.endpoint}")
    private String shortenURLendpoint;

    public String shortenURL(String url) {
        ObjectNode requestbody = objectMapper.createObjectNode();
        requestbody.put("url", url);
        String shortenedURL = restTemplate.postForObject(urlShortnerServiceHost + shortenURLendpoint,
                requestbody, String.class);
        return shortenedURL;
    }

}
