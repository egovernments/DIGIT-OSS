package org.egov.wf.web.controllers;

import org.junit.Test;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
* API tests for WorkflowController
*/
@Ignore
@RunWith(SpringRunner.class)
@WebMvcTest(WorkflowController.class)

public class WorkflowControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void v1ProcessTransitionPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-wf/v1/process/_transition").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void v1ProcessTransitionPostFailure() throws Exception {
        mockMvc.perform(post("/egov-wf/v1/process/_transition").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void v1SearchPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-wf/v1/_search").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void v1SearchPostFailure() throws Exception {
        mockMvc.perform(post("/egov-wf/v1/_search").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

}
