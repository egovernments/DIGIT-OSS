package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.collection.web.contract.BusinessDetailsResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.tracer.model.CustomException;
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

@ContextConfiguration(classes = {BusinessDetailsRepository.class, String.class})
@ExtendWith(SpringExtension.class)
class BusinessDetailsRepositoryTest {
    @Autowired
    private BusinessDetailsRepository businessDetailsRepository;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    void testGetBusinessDetails() throws RestClientException {
        BusinessDetailsResponse businessDetailsResponse = new BusinessDetailsResponse();
        businessDetailsResponse.setBusinessDetails(new ArrayList<>());
        businessDetailsResponse.setResponseInfo(new ResponseInfo());
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any())).thenReturn(businessDetailsResponse);
        ArrayList<String> businessCodes = new ArrayList<>();
        assertSame(businessDetailsResponse,
                this.businessDetailsRepository.getBusinessDetails(businessCodes, "42", new RequestInfo()));
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any());
    }

    @Test
    void testGetBusinessDetails2() throws RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any())).thenThrow(new HttpClientErrorException(HttpStatus.CONTINUE));
        ArrayList<String> businessCodes = new ArrayList<>();
        assertThrows(ServiceCallException.class,
                () -> this.businessDetailsRepository.getBusinessDetails(businessCodes, "42", new RequestInfo()));
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any());
    }

    @Test
    void testGetBusinessDetails3() throws RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any())).thenThrow(new ServiceCallException("An error occurred"));
        ArrayList<String> businessCodes = new ArrayList<>();
        assertThrows(CustomException.class,
                () -> this.businessDetailsRepository.getBusinessDetails(businessCodes, "42", new RequestInfo()));
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<BusinessDetailsResponse>) any(),
                (Object[]) any());
    }
}

