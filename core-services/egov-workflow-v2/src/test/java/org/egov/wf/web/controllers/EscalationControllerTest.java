package org.egov.wf.web.controllers;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.wf.service.EscalationService;
import org.egov.wf.util.ResponseInfoFactory;
import org.egov.wf.web.models.RequestInfoWrapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {EscalationController.class})
@ExtendWith(SpringExtension.class)
class EscalationControllerTest {
    @Autowired
    private EscalationController escalationController;

    @MockBean
    private EscalationService escalationService;

    @MockBean
    private ResponseInfoFactory responseInfoFactory;


    @Test
    void testProcessTransition() throws Exception {
        when(this.responseInfoFactory.createResponseInfoFromRequestInfo((RequestInfo) any(), (Boolean) any()))
                .thenReturn(new ResponseInfo());
        doNothing().when(this.escalationService).escalateApplications((RequestInfo) any(), (String) any());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/egov-wf/auto/{businessService}/_escalate", "Business Service")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.escalationController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string("{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null}"));
    }

    @Test
    void testProcessTransitionTest() throws Exception {
        when(this.responseInfoFactory.createResponseInfoFromRequestInfo((RequestInfo) any(), (Boolean) any()))
                .thenReturn(new ResponseInfo());
        when(this.escalationService.escalateApplicationsTest((RequestInfo) any(), (String) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders
                .post("/egov-wf/auto/{businessService}/_test", "Business Service")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.escalationController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("[]"));
    }
}

