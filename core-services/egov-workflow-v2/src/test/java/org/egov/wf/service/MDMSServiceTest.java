package org.egov.wf.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.repository.ServiceRequestRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class MDMSServiceTest {

    @Test
    void testConstructor() {
        WorkflowConfig config = new WorkflowConfig();
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        assertNull((new MDMSService(config, serviceRequestRepository, new WorkflowConfig())).getStateLevelMapping());
    }


    @Test

    void testStateLevelMapping() {


        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
           }







    @Test
    void testMDMSCall() {


        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
        WorkflowConfig config = new WorkflowConfig();
        MDMSService mdmsService = new MDMSService(config, serviceRequestRepository, new WorkflowConfig());
        assertEquals("Fetch Result", mdmsService.mDMSCall(new RequestInfo()));
        verify(serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }


    @Test

    void testMDMSCall2() {


        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
        MDMSService mdmsService = new MDMSService(null, serviceRequestRepository, new WorkflowConfig());

    }


    @Test

    void testMDMSCall3() {


        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
        MDMSService mdmsService = new MDMSService(new WorkflowConfig(), serviceRequestRepository, null);

    }

    @Test
    void testGetBusinessServiceMDMS() {


        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        when(serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any())).thenReturn("Fetch Result");
        WorkflowConfig config = new WorkflowConfig();
        assertEquals("Fetch Result",
                (new MDMSService(config, serviceRequestRepository, new WorkflowConfig())).getBusinessServiceMDMS());
        verify(serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }



    @Test
    void testGetMdmsSearchUrl() {

        WorkflowConfig config = new WorkflowConfig();
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        (new MDMSService(config, serviceRequestRepository, new WorkflowConfig())).getMdmsSearchUrl();
    }




    @Test
    void testGetMdmsSearchUrl3() {

        WorkflowConfig workflowConfig = mock(WorkflowConfig.class);
        when(workflowConfig.getMdmsEndPoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(workflowConfig.getMdmsHost()).thenReturn("localhost");
        ServiceRequestRepository serviceRequestRepository = mock(ServiceRequestRepository.class);
        (new MDMSService(workflowConfig, serviceRequestRepository, new WorkflowConfig())).getMdmsSearchUrl();
        verify(workflowConfig).getMdmsEndPoint();
        verify(workflowConfig).getMdmsHost();
    }
}

