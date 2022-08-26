package org.egov.rn.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceRequestRepositoryTest {
    private ObjectMapper objectMapper;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ServiceRequestRepository serviceRequestRepository;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        serviceRequestRepository = new ServiceRequestRepository(objectMapper, restTemplate);
    }

    @Test
    void shouldFetchResultGivenAUriAndARequestObject() {
        StringBuilder uri = new StringBuilder("/someUri");
        Object request = new Object();
        when(restTemplate.postForObject(anyString(), any(Object.class), eq(Map.class))).thenReturn(new HashMap());

        Object object = serviceRequestRepository.fetchResult(uri, request);

        assertNotNull(object);
    }
}
