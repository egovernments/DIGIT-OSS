package org.egov.demand.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class BillControllerTest {
    @Autowired
    private BillController billController;

    @Autowired
    private MockMvc mockMvc;




    @Test
    public void BillPostFailure() throws Exception {
        mockMvc.perform(post("/bill/_create").contentType(MediaType
                        .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }
    @Test
    public void FetchBillPostFailure() throws Exception {
        mockMvc.perform(post("/bill/_fetchbill").contentType(MediaType
                        .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }
    @Test
    public void GenerateBillPostFailure() throws Exception {
        mockMvc.perform(post("/amendment/_create").contentType(MediaType
                        .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }
    @Test
    public void SearchBillPostFailure() throws Exception {
        mockMvc.perform(post("/bill/_search").contentType(MediaType
                        .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreate() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);

        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testCreateWithError400() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create", "Uri Vars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testCreateWithNull() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying to access has been"
                                        + " depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testCreate4() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testCreate5() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create", "Uri Vars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testCreate6() throws Exception {
        BillRequest billRequest = new BillRequest();
        billRequest.setBills(new ArrayList<>());
        billRequest.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(billRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying to access has been"
                                        + " depricated, Access the V2 API's\",\"fields\":null}}"));
    }


    @Test
    void testFetchBill() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_fetchbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testFetchBill2() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_fetchbill")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testGenrateBill() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }


    @Test
    void testGenrateBill2() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testSearch() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }

    @Test
    void testSearch2() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying to access has been"
                                        + " depricated, Access the V2 API's\",\"fields\":null}}"));
    }

    @Test
    void testSearch3() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":\"400"
                                        + " BAD_REQUEST\"},\"error\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying"
                                        + " to access has been depricated, Access the V2 API's\",\"fields\":null}}"));
    }

    @Test
    void testSearch4() throws Exception {
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bill/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.billController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":400,\"message\":\"EG_BS_API_ERROR\",\"description\":\"The API you are trying to access has been"
                                        + " depricated, Access the V2 API's\",\"fields\":null}}"));
    }
}

