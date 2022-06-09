package org.egov.collection.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.collection.service.BankAccountMappingService;
import org.egov.collection.util.CollectionMastersRequestValidator;
import org.egov.collection.web.contract.BankAccountServiceMapping;
import org.egov.collection.web.contract.BankAccountServiceMappingReq;
import org.egov.collection.web.contract.factory.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
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

@ContextConfiguration(classes = {BankAccountServiceMappingController.class})
@ExtendWith(SpringExtension.class)
class BankAccountServiceMappingControllerTest {
    @MockBean
    private BankAccountMappingService bankAccountMappingService;

    @Autowired
    private BankAccountServiceMappingController bankAccountServiceMappingController;

    @MockBean
    private CollectionMastersRequestValidator collectionMastersRequestValidator;

    @Test
    void testCreate() throws Exception {
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(new ErrorResponse());

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"responseInfo\":null,\"error\":null}"));
    }

    @Test
    void testCreate2() throws Exception {
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(null);

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        when(this.bankAccountMappingService.createBankAccountServiceMappingAsync((BankAccountServiceMappingReq) any()))
                .thenReturn(bankAccountServiceMappingReq);

        BankAccountServiceMappingReq bankAccountServiceMappingReq1 = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq1.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq1.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq1);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[],\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324"
                                        + "\",\"msgId\":null,\"status\":\"200 OK\"}}"));
    }

    @Test
    void testCreate3() throws Exception {
        ResponseInfo responseInfo = new ResponseInfo();
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(new ErrorResponse(responseInfo, new Error()));

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        when(this.bankAccountMappingService.createBankAccountServiceMappingAsync((BankAccountServiceMappingReq) any()))
                .thenReturn(bankAccountServiceMappingReq);

        BankAccountServiceMappingReq bankAccountServiceMappingReq1 = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq1.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq1.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq1);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":0,\"message\":null,\"description\":null,\"fields\":null}}"));
    }

    @Test
    void testCreate4() throws Exception {
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(null);

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new BankAccountServiceMapping());

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(bankAccountServiceMappingList);
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        when(this.bankAccountMappingService.createBankAccountServiceMappingAsync((BankAccountServiceMappingReq) any()))
                .thenReturn(bankAccountServiceMappingReq);

        BankAccountServiceMappingReq bankAccountServiceMappingReq1 = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq1.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq1.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq1);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[{\"businessDetails\":null,\"bankAccount\":null,\"bank\":null,\"bankBranch\":null"
                                        + ",\"tenantId\":null}],\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\""
                                        + ":null,\"status\":\"200 OK\"}}"));
    }

    @Test
    void testCreate5() throws Exception {
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(null);

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(null);
        when(this.bankAccountMappingService.createBankAccountServiceMappingAsync((BankAccountServiceMappingReq) any()))
                .thenReturn(bankAccountServiceMappingReq);

        BankAccountServiceMappingReq bankAccountServiceMappingReq1 = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq1.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq1.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq1);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[],\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\""
                                        + ",\"msgId\":\"\",\"status\":\"200 OK\"}}"));
    }

    @Test
    void testCreate6() throws Exception {
        when(this.collectionMastersRequestValidator.validateBankAccountServiceRequest((BankAccountServiceMappingReq) any()))
                .thenReturn(null);

        BankAccountServiceMappingReq bankAccountServiceMappingReq = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq.setBankAccountServiceMapping(new ArrayList<>());
        bankAccountServiceMappingReq.setRequestInfo(new RequestInfo());
        when(this.bankAccountMappingService.createBankAccountServiceMappingAsync((BankAccountServiceMappingReq) any()))
                .thenReturn(bankAccountServiceMappingReq);

        ArrayList<BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new BankAccountServiceMapping());

        BankAccountServiceMappingReq bankAccountServiceMappingReq1 = new BankAccountServiceMappingReq();
        bankAccountServiceMappingReq1.setBankAccountServiceMapping(bankAccountServiceMappingList);
        bankAccountServiceMappingReq1.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(bankAccountServiceMappingReq1);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testSearch() throws Exception {
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ErrorResponse());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"responseInfo\":null,\"error\":null}"));
    }

    @Test
    void testSearch2() throws Exception {
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(null);
        when(this.bankAccountMappingService
                .searchBankAccountService((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[],\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324"
                                        + "\",\"msgId\":null,\"status\":\"200 OK\"}}"));
    }

    @Test
    void testSearch3() throws Exception {
        ResponseInfo responseInfo = new ResponseInfo();
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ErrorResponse(responseInfo, new Error()));
        when(this.bankAccountMappingService
                .searchBankAccountService((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"responseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":null,\"msgId\":null,\"status\":null},\"error"
                                        + "\":{\"code\":0,\"message\":null,\"description\":null,\"fields\":null}}"));
    }

    @Test
    void testSearch4() throws Exception {
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(null);

        ArrayList<org.egov.collection.model.BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new org.egov.collection.model.BankAccountServiceMapping());
        when(this.bankAccountMappingService
                .searchBankAccountService((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(bankAccountServiceMappingList);

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[{\"businessDetails\":null,\"bankAccount\":null,\"bank\":null,\"bankBranch\":null"
                                        + ",\"tenantId\":null}],\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\""
                                        + ":null,\"status\":\"200 OK\"}}"));
    }

    @Test
    void testSearch5() throws Exception {
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(null);
        when(this.bankAccountMappingService
                .searchBankAccountService((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(null);
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[],\"ResponseInfo\":{\"apiId\":\"\",\"ver\":\"\",\"ts\":null,\"resMsgId\":\"uief87324\""
                                        + ",\"msgId\":\"\",\"status\":\"200 OK\"}}"));
    }

    @Test
    void testSearch6() throws Exception {
        when(this.collectionMastersRequestValidator
                .validateBankAccountSearchRequest((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(null);

        ArrayList<org.egov.collection.model.BankAccountServiceMapping> bankAccountServiceMappingList = new ArrayList<>();
        bankAccountServiceMappingList.add(new org.egov.collection.model.BankAccountServiceMapping());
        bankAccountServiceMappingList.add(new org.egov.collection.model.BankAccountServiceMapping());
        when(this.bankAccountMappingService
                .searchBankAccountService((org.egov.collection.model.BankAccountServiceMappingSearchCriteria) any()))
                .thenReturn(bankAccountServiceMappingList);

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/bankAccountServiceMapping/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.bankAccountServiceMappingController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"BankAccountServiceMapping\":[{\"businessDetails\":null,\"bankAccount\":null,\"bank\":null,\"bankBranch\":null"
                                        + ",\"tenantId\":null},{\"businessDetails\":null,\"bankAccount\":null,\"bank\":null,\"bankBranch\":null,\"tenantId"
                                        + "\":null}],\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"200"
                                        + " OK\"}}"));
    }
}

