package org.egov.wf.web.controllers;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.wf.service.WorkflowService;
import org.egov.wf.util.ResponseInfoFactory;
import org.egov.wf.web.models.ProcessInstanceRequest;
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

@ContextConfiguration(classes = {WorkflowController.class})
@ExtendWith(SpringExtension.class)
class WorkflowControllerTest {
    @MockBean
    private HttpServletRequest httpServletRequest;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private WorkflowController workflowController;

    @MockBean
    private WorkflowService workflowService;


    @Test
    void testProcessTransition() throws Exception {
        when(this.workflowService.transition((ProcessInstanceRequest) any())).thenReturn(new ArrayList<>());
        when(this.responseInfoFactory.createResponseInfoFromRequestInfo((RequestInfo) any(), (Boolean) any()))
                .thenReturn(new ResponseInfo());

        ProcessInstanceRequest processInstanceRequest = new ProcessInstanceRequest();
        processInstanceRequest.setProcessInstances(new ArrayList<>());
        processInstanceRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(processInstanceRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/egov-wf/process/_transition")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.workflowController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},"
                                        + "\"ProcessInstances\":[],\"totalCount\":null}"));
    }
}
