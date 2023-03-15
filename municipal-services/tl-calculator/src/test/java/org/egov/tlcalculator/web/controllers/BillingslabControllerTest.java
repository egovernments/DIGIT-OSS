package org.egov.tlcalculator.web.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
* API tests for BillingslabApiController
*/
@Ignore
@RunWith(SpringRunner.class)
@WebMvcTest(BillingslabController.class)
public class BillingslabControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void billingslabCreatePostSuccess() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_create").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void billingslabCreatePostFailure() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_create").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void billingslabSearchPostSuccess() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_search").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void billingslabSearchPostFailure() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_search").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void billingslabUpdatePostSuccess() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_update").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void billingslabUpdatePostFailure() throws Exception {
        mockMvc.perform(post("/tl-calculator//billingslab/_update").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

}
