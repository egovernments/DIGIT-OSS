package org.egov.pg.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.TestConfiguration;
import org.egov.pg.models.TaxAndPayment;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.GatewayService;
import org.egov.pg.service.TransactionService;
import org.egov.pg.web.models.TransactionCriteria;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.pg.web.models.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Map;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * API tests for PaymentsApiController
 */
@RunWith(SpringRunner.class)
@WebMvcTest
@Import(TestConfiguration.class)
public class TransactionsApiControllerTest {

    private User user;
    private RequestInfo requestInfo;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private GatewayService gatewayService;

    private ObjectMapper mapper = new ObjectMapper();

    @Before
    public void setUp() {
        user = User.builder().userName("USER001").mobileNumber("9XXXXXXXXX").name("XYZ").tenantId("pb").emailId("").build();
        requestInfo = new RequestInfo("", "", 0L, "", "", "", "", "", "", null);

    }


    @Test
    public void paymentsV1AvailableGatewaysPostSuccess() throws Exception {
        when(gatewayService.getActiveGateways()).thenReturn(Collections.singleton("PAYTM"));

        mockMvc.perform(post("/gateway/v1/_search").contentType(MediaType
                .APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());
    }

    @Test
    public void transactionsV1CreatePostSuccess() throws Exception {
        TaxAndPayment taxAndPayment = TaxAndPayment.builder()
                .amountPaid(new BigDecimal("100"))
                .businessService("PT")
                .taxAmount(new BigDecimal("100"))
                .build();
        Transaction transaction = Transaction.builder().txnAmount("100.00")
                .txnId("ABC231")
                .billId("ORDER001")
                .productInfo("Property Tax Payment")
                .gateway("AXIS")
                .module("PT")
                .tenantId("pb")
                .consumerCode("PT-21055")
                .taxAndPayments(Collections.singletonList(taxAndPayment))
                .callbackUrl("http://2a91377b.ngrok.io/pg-service/payments/v1/_update")
                .user(user).build();

        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, transaction);

        when(transactionService.initiateTransaction(any(TransactionRequest.class))).thenReturn(transaction);

        mockMvc.perform(post("/transaction/v1/_create").contentType(MediaType
                .APPLICATION_JSON_UTF8).content(mapper.writeValueAsString(transactionRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void transactionsV1CreatePostFailure() throws Exception {
        Transaction transaction = Transaction.builder().txnAmount("100.00")
                .txnId("ABC231")
                .billId("ORDER001")
                .productInfo("Property Tax Payment")
                .gateway("AXIS")
                .module("PT")
                .tenantId("pb")
                .callbackUrl("http://2a91377b.ngrok.io/pg-service/payments/v1/_update")
                .user(user).build();
        when(transactionService.initiateTransaction(any(TransactionRequest.class))).thenReturn(transaction);

        mockMvc.perform(post("/transaction/v1/_create").contentType(MediaType
                .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void transactionsV1SearchPostSuccess() throws Exception {
        when(transactionService.getTransactions(any(TransactionCriteria.class))).thenReturn(Collections.singletonList
                (new Transaction()));

        mockMvc.perform(post("/transaction/v1/_search").param("txnId", "PT_001").contentType
                (MediaType
                        .APPLICATION_JSON_UTF8).content(mapper.writeValueAsString(requestInfo)))
                .andExpect(status().isOk());
    }

    @Test
    public void transactionsV1SearchPostFailure() throws Exception {
        when(transactionService.getTransactions(any(TransactionCriteria.class))).thenReturn(Collections.singletonList
                (new Transaction()));

        mockMvc.perform(post("/transaction/v1/_search").contentType(MediaType
                .APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void transactionsV1UpdatePostSuccess() throws Exception {
        when(transactionService.updateTransaction(any(RequestInfo.class), any(Map.class)))
                .thenReturn
                        (Collections.emptyList());

        mockMvc.perform(post("/transaction/v1/_update").contentType(MediaType
                .APPLICATION_JSON_UTF8).content(mapper.writeValueAsString(requestInfo)))
                .andExpect(status().isOk());
    }

}
