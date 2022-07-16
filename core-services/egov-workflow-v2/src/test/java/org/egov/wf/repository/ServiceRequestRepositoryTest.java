package org.egov.wf.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

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
        HashMap<Object, Object> objectObjectMap = new HashMap<>();
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenReturn(objectObjectMap);
        when(this.objectMapper.configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean()))
                .thenReturn(this.objectMapper);
        Object actualFetchResultResult = this.serviceRequestRepository.fetchResult(new StringBuilder("Str"), "Request");
        assertSame(objectObjectMap, actualFetchResultResult);
        assertTrue(((Map<Object, Object>) actualFetchResultResult).isEmpty());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
        verify(this.objectMapper).configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean());
    }


    @Test
    void testFetchResultWithPostObject() throws RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn("Post For Object");

        when(this.objectMapper.configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean()))
                .thenThrow(new HttpClientErrorException(HttpStatus.CONTINUE));
        assertThrows(HttpClientErrorException.class,
                () -> this.serviceRequestRepository.fetchResult(new StringBuilder("Str"), "Request"));

        verify(this.objectMapper).configure((com.fasterxml.jackson.databind.SerializationFeature) any(), anyBoolean());
    }
}

