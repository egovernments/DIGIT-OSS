package org.egov.web.controllers;

import org.junit.Test;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.egov.TestConfiguration;

import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
* API tests for ApportionController
*/
@Ignore
@RunWith(SpringRunner.class)
@WebMvcTest(ApportionController.class)
@Import(TestConfiguration.class)
public class ApportionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void apportionPostSuccess() throws Exception {
        mockMvc.perform(post("/apportion/_apportion").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void apportionPostFailure() throws Exception {
        mockMvc.perform(post("/apportion/_apportion").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

}
