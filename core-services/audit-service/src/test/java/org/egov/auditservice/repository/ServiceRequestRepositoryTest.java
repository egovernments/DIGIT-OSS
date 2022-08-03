package org.egov.auditservice.repository;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.HashMap;
import java.util.Map;

import org.egov.tracer.model.ServiceCallException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.HttpClientErrorException;
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
    void testFetchResult() throws RestClientException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        HashMap<Object, Object> objectObjectMap = new HashMap<>();
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenReturn(objectObjectMap);
        Object actualFetchResultResult = serviceRequestRepository.fetchResult("Uri", "Request");
        assertSame(objectObjectMap, actualFetchResultResult);
        assertTrue(((Map<Object, Object>) actualFetchResultResult).isEmpty());
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
    }

    @Test
    void testFetchResultWithRequest() throws RestClientException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenThrow(new HttpClientErrorException(HttpStatus.CONTINUE));
        assertThrows(ServiceCallException.class, () -> serviceRequestRepository.fetchResult("Uri", "Request"));
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
    }


    @Test
    void testFetchResultWithError() throws RestClientException {
        when(objectMapper.configure((SerializationFeature) any(), anyBoolean())).thenReturn(objectMapper);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenThrow(new ServiceCallException("An error occurred"));
        assertNull(serviceRequestRepository.fetchResult("Uri", "Request"));
        verify(objectMapper).configure((SerializationFeature) any(), anyBoolean());
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
    }
}

