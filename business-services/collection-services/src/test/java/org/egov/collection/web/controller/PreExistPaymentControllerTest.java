package org.egov.collection.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.service.PreExistPaymentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {PreExistPaymentController.class})
@ExtendWith(SpringExtension.class)
class PreExistPaymentControllerTest {
    @MockBean
    private PaymentRepository paymentRepository;

    @Autowired
    private PreExistPaymentController preExistPaymentController;

    @MockBean
    private PreExistPaymentService preExistPaymentService;

    @Test
    void testUpdate() throws Exception {
        when(this.paymentRepository.fetchIfsccode()).thenReturn(new ArrayList<>());
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/preexistpayments/_update");
        MockMvcBuilders.standaloneSetup(this.preExistPaymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdate2() throws Exception {
        doNothing().when(this.preExistPaymentService).updatePaymentBankDetails((String) any());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("?");
        when(this.paymentRepository.fetchIfsccode()).thenReturn(stringList);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/preexistpayments/_update");
        MockMvcBuilders.standaloneSetup(this.preExistPaymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdate3() throws Exception {
        doNothing().when(this.preExistPaymentService).updatePaymentBankDetails((String) any());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("?");
        stringList.add("?");
        when(this.paymentRepository.fetchIfsccode()).thenReturn(stringList);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/preexistpayments/_update");
        MockMvcBuilders.standaloneSetup(this.preExistPaymentController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void testUpdate4() throws Exception {
        doNothing().when(this.preExistPaymentService).updatePaymentBankDetails((String) any());

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("?");
        when(this.paymentRepository.fetchIfsccode()).thenReturn(stringList);
        MockHttpServletRequestBuilder postResult = MockMvcRequestBuilders.post("/preexistpayments/_update");
        postResult.contentType("https://example.org/example");
        MockMvcBuilders.standaloneSetup(this.preExistPaymentController)
                .build()
                .perform(postResult)
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}

