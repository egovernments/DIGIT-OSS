package org.egov.demand.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.service.DemandService;
import org.egov.demand.util.migration.DemandMigration;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.DemandResponse;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {DemandController.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class DemandControllerTest {
    @Autowired
    private DemandController demandController;

    @MockBean
    private DemandMigration demandMigration;

    @MockBean
    private DemandService demandService;


    @Test
    void testCreate() throws Exception {
        when(this.demandService.create((DemandRequest) any())).thenReturn(new DemandResponse());

        DemandRequest demandRequest = new DemandRequest();
        demandRequest.setDemands(new ArrayList<>());
        demandRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(demandRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/demand/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.demandController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(
                        MockMvcResultMatchers.content().string("{\"ResponseInfo\":null,\"Demands\":[],\"CollectedReceipt\":null}"));
    }


    @Test
    void testMigrate() throws Exception {
        when(this.demandMigration.migrateToV1((Integer) any(), (Integer) any())).thenReturn(new HashMap<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder postResult = MockMvcRequestBuilders.post("/demand/_migratetov1");
        MockHttpServletRequestBuilder requestBuilder = postResult.param("batchSizeInput", String.valueOf(1))
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.demandController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{}"));
    }


    @Test
    void testSearch() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/demand/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.demandController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testUpdate() throws Exception {
        when(this.demandService.updateAsync((DemandRequest) any(), (org.egov.demand.model.PaymentBackUpdateAudit) any()))
                .thenReturn(new DemandResponse());

        DemandRequest demandRequest = new DemandRequest();
        demandRequest.setDemands(new ArrayList<>());
        demandRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(demandRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/demand/_update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.demandController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(
                        MockMvcResultMatchers.content().string("{\"ResponseInfo\":null,\"Demands\":[],\"CollectedReceipt\":null}"));
    }
}

