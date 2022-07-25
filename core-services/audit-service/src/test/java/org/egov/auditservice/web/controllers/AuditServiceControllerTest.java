package org.egov.auditservice.web.controllers;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.egov.auditservice.persisterauditclient.PersisterAuditClientService;
import org.egov.auditservice.persisterauditclient.models.contract.PersisterClientInput;
import org.egov.auditservice.service.AuditLogProcessingService;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.RequestInfoWrapper;
import org.egov.auditservice.web.models.VerificationRequest;
import org.egov.common.contract.request.RequestInfo;
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

@ContextConfiguration(classes = {AuditServiceController.class})
@ExtendWith(SpringExtension.class)
class AuditServiceControllerTest {
    @MockBean
    private AuditLogProcessingService auditLogProcessingService;

    @Autowired
    private AuditServiceController auditServiceController;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private PersisterAuditClientService persisterAuditClientService;


    ////@Test
    void testCreate() throws Exception {
        doNothing().when(auditLogProcessingService).process((AuditLogRequest) any());

        AuditLogRequest auditLogRequest = new AuditLogRequest();
        auditLogRequest.setAuditLogs(new ArrayList<>());
        auditLogRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(auditLogRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/log/v1/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(auditServiceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"responseInfo\":null,\"AuditLogs\":null}"));
    }


    ////@Test
    void testSearch() throws Exception {
        when(auditLogProcessingService.getAuditLogs((RequestInfo) any(), (AuditLogSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/log/v1/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(auditServiceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"responseInfo\":null,\"AuditLogs\":[]}"));
    }


    ////@Test
    void testTestNewAuditFlow() throws Exception {
        when(persisterAuditClientService.generateAuditLogs((PersisterClientInput) any())).thenReturn(new ArrayList<>());

        PersisterClientInput persisterClientInput = new PersisterClientInput();
        persisterClientInput.setJson("Json");
        persisterClientInput.setTopic("Topic");
        String content = (new ObjectMapper()).writeValueAsString(persisterClientInput);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/log/v1/_test")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(auditServiceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("[]"));
    }


    ////@Test
    void testVerify() throws Exception {
        doNothing().when(auditLogProcessingService).verifyDbEntity((String) any(), (Map<String, Object>) any());

        VerificationRequest verificationRequest = new VerificationRequest();
        verificationRequest.setKeyValuePairs(new HashMap<>());
        verificationRequest.setObjectId("42");
        verificationRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(verificationRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/log/v1/_verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(auditServiceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string("{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null}"));
    }
}

