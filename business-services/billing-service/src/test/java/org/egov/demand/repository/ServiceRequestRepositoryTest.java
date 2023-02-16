package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import org.egov.tracer.model.ServiceCallException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {ServiceRequestRepository.class})
@ExtendWith(SpringExtension.class)
class ServiceRequestRepositoryTest {
    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;


    @Test
    void testFetchResult() throws JsonProcessingException, RestClientException {
        HashMap<Object, Object> objectObjectMap = new HashMap<>();
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenReturn(objectObjectMap);
        when(this.objectMapper.configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean()))
                .thenReturn(this.objectMapper);
        when(this.objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        Map actualFetchResultResult = this.serviceRequestRepository.fetchResult("Uri", "Request");
        assertSame(objectObjectMap, actualFetchResultResult);
        assertTrue(actualFetchResultResult.isEmpty());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
        verify(this.objectMapper).configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean());
        verify(this.objectMapper).writeValueAsString((Object) any());
    }



}

