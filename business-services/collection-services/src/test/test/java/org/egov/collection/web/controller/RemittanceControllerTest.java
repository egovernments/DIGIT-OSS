package org.egov.collection.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.collection.service.RemittanceService;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceRequest;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
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

@ContextConfiguration(classes = {RemittanceController.class})
@ExtendWith(SpringExtension.class)
class RemittanceControllerTest {
    @Autowired
    private RemittanceController remittanceController;

    @MockBean
    private RemittanceService remittanceService;

    @Test
    void testCreate() throws Exception {
        when(this.remittanceService.createRemittance((RemittanceRequest) any())).thenReturn(new Remittance());

        RemittanceRequest remittanceRequest = new RemittanceRequest();
        remittanceRequest.setRemittances(new ArrayList<>());
        remittanceRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(remittanceRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/remittances/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.remittanceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Remittance\":[{\"tenantId\":null,\"id\":null,\"referenceNumber\":null,\"referenceDate\":null,\"voucherHeader"
                                        + "\":null,\"function\":null,\"fund\":null,\"remarks\":null,\"reasonForDelay\":null,\"status\":null,\"bankaccount\""
                                        + ":null,\"auditDetails\":null,\"remittanceReceipts\":[],\"remittanceDetails\":[],\"remittanceInstruments\":[]"
                                        + "}]}"));
    }

    @Test
    void testSearch() throws Exception {
        when(this.remittanceService.getRemittances((RequestInfo) any(),
                (org.egov.collection.web.contract.RemittanceSearchRequest) any())).thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/remittances/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.remittanceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Remittance\":[]}"));
    }

    @Test
    void testSearch2() throws Exception {
        when(this.remittanceService.getRemittances((RequestInfo) any(),
                (org.egov.collection.web.contract.RemittanceSearchRequest) any())).thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/remittances/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.remittanceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":\"\",\"status\":\"200"
                                        + " OK\"},\"Remittance\":[]}"));
    }

    @Test
    void testUpdate() throws Exception {
        when(this.remittanceService.updateRemittance((RemittanceRequest) any())).thenReturn(new Remittance());

        RemittanceRequest remittanceRequest = new RemittanceRequest();
        remittanceRequest.setRemittances(new ArrayList<>());
        remittanceRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(remittanceRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/remittances/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.remittanceController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Remittance\":[{\"tenantId\":null,\"id\":null,\"referenceNumber\":null,\"referenceDate\":null,\"voucherHeader"
                                        + "\":null,\"function\":null,\"fund\":null,\"remarks\":null,\"reasonForDelay\":null,\"status\":null,\"bankaccount\""
                                        + ":null,\"auditDetails\":null,\"remittanceReceipts\":[],\"remittanceDetails\":[],\"remittanceInstruments\":[]"
                                        + "}]}"));
    }
}

