package com.tarento.analytics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import static javax.servlet.http.HttpServletRequest.BASIC_AUTH;
import static org.apache.commons.codec.CharEncoding.US_ASCII;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class RestService {
    public static final Logger LOGGER = LoggerFactory.getLogger(RestService.class);

    @Value("${services.esindexer.host}")
    private String indexServiceHost;
    @Value("${egov.services.esindexer.host.search}")
    private String indexServiceHostSearch;
    @Value("${services.esindexer.host}")
    private String dssindexServiceHost;
    @Value("${egov.es.username}")
    private String userName;
    @Value("${egov.es.password}")
    private String password;

    @Autowired
    private RetryTemplate retryTemplate;


    /**
     * search on Elastic search for a search query
     * @param index           elastic search index name against which search operation
     * @param searchQuery     search query as request body
     * @return
     * @throws IOException
     */

    public JsonNode search(String index, String searchQuery) {
        //System.out.println("INSIDE REST");
        String url =( indexServiceHost) + index + indexServiceHostSearch;
        HttpHeaders headers = getHttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        //LOGGER.info("Index Name : " + index);
        //LOGGER.info("Searching ES for Query: " + searchQuery);
        HttpEntity<String> requestEntity = new HttpEntity<>(searchQuery, headers);
        String reqBody = requestEntity.getBody();
        JsonNode responseNode = null;

        try {
            ResponseEntity<Object> response = retryTemplate.postForEntity(url, requestEntity);
            responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
            //LOGGER.info("RestTemplate response :- "+responseNode);

        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            LOGGER.error("client error while searching ES : " + e.getMessage());
        }
        return responseNode;
    }

    /**
     * makes a client rest api call of Http POST option
     * @param uri
     * @param authToken
     * @param requestNode
     * @return
     * @throws IOException
     */
    public JsonNode post(String uri, String authToken, JsonNode requestNode) {

        HttpHeaders headers = new HttpHeaders();
        if(authToken != null && !authToken.isEmpty())
            headers.add("Authorization", "Bearer "+ authToken );
        headers.setContentType(MediaType.APPLICATION_JSON);

        LOGGER.info("Request URI: " + uri + ", Node: " + requestNode);
        HttpEntity<String> requestEntity = null;
        if(requestNode != null ) requestEntity = new HttpEntity<>(requestNode.toString(), headers);
        else requestEntity = new HttpEntity<>("{}", headers);

        JsonNode responseNode = null;

        try {
            ResponseEntity<Object> response = retryTemplate.postForEntity(uri,requestEntity);
            responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
            LOGGER.info("RestTemplate response :- "+responseNode);

        } catch (HttpClientErrorException e) {
            LOGGER.error("post client exception: " + e.getMessage());
        }
        return responseNode;
    }

    /**
     * makes a client rest api call of Http GET option
     * @param uri
     * @param authToken
     * @return
     * @throws IOException
     */
    public JsonNode get(String uri, String authToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer "+ authToken );
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> headerEntity = new HttpEntity<>("{}", headers);

        JsonNode responseNode = null;
        try {
            ResponseEntity<Object> response = retryTemplate.getForEntity(uri, headerEntity);
            responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
            LOGGER.info("RestTemplate response :- "+responseNode);

        } catch (HttpClientErrorException e) {
            LOGGER.error("get client exception: " + e.getMessage());
        }
        return responseNode;
    }


    private HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(AUTHORIZATION, getBase64Value(userName, password));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON);
        headers.setAccept(mediaTypes);
        return headers;
    }

    /**
     * Helper Method to create the Base64Value for headers
     *
     * @param userName
     * @param password
     * @return
     */
    private String getBase64Value(String userName, String password) {
        String authString = String.format("%s:%s", userName, password);
        byte[] encodedAuthString = Base64.encodeBase64(authString.getBytes(Charset.forName(US_ASCII)));
        return String.format(BASIC_AUTH, new String(encodedAuthString));
    }

}
