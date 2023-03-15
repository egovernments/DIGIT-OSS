package org.egov.collection.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class MDMSServiceTest {

    @Test
    void testMDMSCall() {
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
        MDMSService mdmsService = new MDMSService(new ApplicationProperties(), serviceRequestRepository);
        assertEquals("Fetch Result", mdmsService.mDMSCall(new RequestInfo(), "foo"));
        verify(serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }
}

