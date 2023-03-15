package org.egov.persistence.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Repository
@Slf4j
public class RestCallRepository {

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Fetches results from a REST service using the uri and object
     *
     * @param requestInfo
     * @param serviceReqSearchCriteria
     * @return Optional
     * @author vishal
     */
    public Optional<Object> fetchResult(StringBuilder uri, Object request) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;
        try {
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        } catch (HttpClientErrorException e) {
            log.error("External Service threw an Exception: ", e);
        } catch (Exception e) {
            log.error("Exception while fetching data: ", e);
        }
        return Optional.ofNullable(response);

    }

}
