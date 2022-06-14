package org.egov.demand.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.ArrayList;

import java.util.HashSet;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.helper.BillHelperV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.model.UpdateBillRequest;
import org.egov.demand.service.BillServicev2;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.BillResponseV2;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.BillValidator;
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

@ContextConfiguration(classes = {BillControllerv2.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class BillControllerv2Test {
    @Autowired
    private BillControllerv2 billControllerv2;

    @MockBean
    private BillHelperV2 billHelperV2;

    @MockBean
    private BillServicev2 billServicev2;

    @MockBean
    private BillValidator billValidator;

    @Test
    void testCancelBillFail() throws Exception {
        UpdateBillRequest updateBillRequest = new UpdateBillRequest();
        updateBillRequest.setRequestInfo(new RequestInfo());
        updateBillRequest.setUpdateBillCriteria(new UpdateBillCriteria());
        String content = (new ObjectMapper()).writeValueAsString(updateBillRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_cancelbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testCancelBillSucessfullyCancleActiveBill() throws Exception {
        when(this.billServicev2.cancelBill((UpdateBillRequest) any())).thenReturn(1);

        UpdateBillRequest updateBillRequest = new UpdateBillRequest();
        updateBillRequest.setRequestInfo(new RequestInfo());
        HashSet<String> consumerCodes = new HashSet<>();
        MissingNode additionalDetails = MissingNode.getInstance();
        updateBillRequest.setUpdateBillCriteria(
                new UpdateBillCriteria("42", consumerCodes, "?", additionalDetails, new HashSet<>(), BillV2.BillStatus.ACTIVE));
        String content = (new ObjectMapper()).writeValueAsString(updateBillRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_cancelbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"200"
                                        + " OK\"},\"Message\":\"Successfully cancelled 1 Active bills for given consumer codes\"}"));
    }


    @Test
    void testCancelBillwithNoActiveBillFound() throws Exception {
        when(this.billServicev2.cancelBill((UpdateBillRequest) any())).thenReturn(0);

        UpdateBillRequest updateBillRequest = new UpdateBillRequest();
        updateBillRequest.setRequestInfo(new RequestInfo());
        HashSet<String> consumerCodes = new HashSet<>();
        MissingNode additionalDetails = MissingNode.getInstance();
        updateBillRequest.setUpdateBillCriteria(
                new UpdateBillCriteria("42", consumerCodes, "?", additionalDetails, new HashSet<>(), BillV2.BillStatus.ACTIVE));
        String content = (new ObjectMapper()).writeValueAsString(updateBillRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_cancelbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"Message\":\"No Active bills found for cancellation for the given criteria\"}"));
    }

    @Test
    void testCancelBillWithNotCancelduringWorkflow() throws Exception {
        when(this.billServicev2.cancelBill((UpdateBillRequest) any())).thenReturn(-1);

        UpdateBillRequest updateBillRequest = new UpdateBillRequest();
        updateBillRequest.setRequestInfo(new RequestInfo());
        HashSet<String> consumerCodes = new HashSet<>();
        MissingNode additionalDetails = MissingNode.getInstance();
        updateBillRequest.setUpdateBillCriteria(
                new UpdateBillCriteria("42", consumerCodes, "?", additionalDetails, new HashSet<>(), BillV2.BillStatus.ACTIVE));
        String content = (new ObjectMapper()).writeValueAsString(updateBillRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_cancelbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"Message\":\"You cannot cancel the bill in the workflow\"}"));
    }


    @Test
    void testCancelBillNotFound() throws Exception {
        UpdateBillRequest updateBillRequest = new UpdateBillRequest();
        updateBillRequest.setRequestInfo(new RequestInfo());
        updateBillRequest.setUpdateBillCriteria(new UpdateBillCriteria());
        String content = (new ObjectMapper()).writeValueAsString(updateBillRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_cancelbill", "Uri Vars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testCreateWithNull() throws Exception {
        when(this.billServicev2.sendBillToKafka((BillRequestV2) any())).thenReturn(new BillResponseV2());
        doNothing().when(this.billHelperV2).getBillRequestWithIds((BillRequestV2) any());

        BillRequestV2 billRequestV2 = new BillRequestV2();
        billRequestV2.setBills(new ArrayList<>());
        billRequestV2.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequestV2);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"ResposneInfo\":null,\"Bill\":[]}"));
    }

    @Test
    void testpostSucess() throws Exception {
        when(this.billServicev2.sendBillToKafka((BillRequestV2) any())).thenReturn(new BillResponseV2());
        doNothing().when(this.billHelperV2).getBillRequestWithIds((BillRequestV2) any());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = new BillRequestV2();
        billRequestV2.setBills(billV2List);
        billRequestV2.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequestV2);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"ResposneInfo\":null,\"Bill\":[]}"));
    }


    @Test
    void testFetchBillWithError() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_fetchbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testGenrateWithError() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testSearch() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/v2/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billControllerv2)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }
}

