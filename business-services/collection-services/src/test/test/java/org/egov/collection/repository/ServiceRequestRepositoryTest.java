package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.egov.tracer.model.ServiceCallException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {ServiceRequestRepository.class})
@ExtendWith(SpringExtension.class)
class ServiceRequestRepositoryTest {
    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Test
    void testFetchResult() throws RestClientException {
        HashMap<Object, Object> objectObjectMap = new HashMap<>();
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenReturn(objectObjectMap);
        Object actualFetchResultResult = this.serviceRequestRepository.fetchResult(new StringBuilder("Str"), "Request");
        assertSame(objectObjectMap, actualFetchResultResult);
        assertTrue(((Map<Object, Object>) actualFetchResultResult).isEmpty());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
    }

    @Test
    void testFetchGetResult() throws RestClientException {
        when(this.restTemplate.exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(new ResponseEntity<>(HttpStatus.CONTINUE));
        assertNull(this.serviceRequestRepository.fetchGetResult("Uri"));
        verify(this.restTemplate).exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testFetchGetResult2() throws RestClientException {
        when(this.restTemplate.exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any())).thenReturn(null);
        assertThrows(ServiceCallException.class, () -> this.serviceRequestRepository.fetchGetResult("Uri"));
        verify(this.restTemplate).exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testFetchGetResult3() throws RestClientException {
        when(this.restTemplate.exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any()))
                .thenThrow(new HttpClientErrorException(HttpStatus.CONTINUE));
        assertThrows(ServiceCallException.class, () -> this.serviceRequestRepository.fetchGetResult("Uri"));
        verify(this.restTemplate).exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testFetchGetResult4() throws RestClientException {
        when(this.restTemplate.exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any()))
                .thenThrow(new ServiceCallException("An error occurred"));
        assertThrows(ServiceCallException.class, () -> this.serviceRequestRepository.fetchGetResult("Uri"));
        verify(this.restTemplate).exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testFetchGetResult5() throws RestClientException {
        when(this.restTemplate.exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(new ResponseEntity<>(42, HttpStatus.CONTINUE));
        assertThrows(ServiceCallException.class, () -> this.serviceRequestRepository.fetchGetResult("Uri"));
        verify(this.restTemplate).exchange((String) any(), (org.springframework.http.HttpMethod) any(),
                (org.springframework.http.HttpEntity<?>) any(), (Class<Object>) any(), (Object[]) any());
    }
}

