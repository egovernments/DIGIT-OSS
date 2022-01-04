package org.egov.collection.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;


@Slf4j
@Repository
public class ServiceRequestRepository {



    @Autowired
    private RestTemplate restTemplate;


    /**
     * Makes a RestTemplate Call on the input uri with the given get request
     * @param uri The uri to be called
     * @param request The request body
     * @return The reponse of the call
     */
    public Object fetchResult(StringBuilder uri, Object request) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;
        try {
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        }catch(HttpClientErrorException e) {
            log.error("External Service threw an Exception: ",e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        }catch(Exception e) {
            log.error("Exception while fetching from searcher: ",e);
        }

        return response;

    }
    
    /**
     * Makes a RestTemplate Call on the input uri with thegiven request
     * @param uri The uri to be called
     * @param request The request body
     * @return The reponse of the call
     */
    public String fetchGetResult(String uri) {
        
        String response;
        try {
            response = restTemplate.exchange(uri, HttpMethod.GET, null, String.class).getBody();
        }catch(HttpClientErrorException e) {
            log.error("External Service threw an Exception: ",e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        }catch(Exception e) {
            log.error("Exception while fetching from searcher: ",e);
            throw new ServiceCallException(e.getMessage());
        }

        return response;

    }
   


}



