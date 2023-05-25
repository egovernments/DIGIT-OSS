package org.egov.enc.web.controllers;

import org.junit.Test;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.egov.enc.TestConfiguration;

import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
* API tests for CryptoApiController
*/
@Ignore
@RunWith(SpringRunner.class)
@WebMvcTest(CryptoApiController.class)
@Import(TestConfiguration.class)
public class CryptoApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void cryptoV1DecryptPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_decrypt").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void cryptoV1DecryptPostFailure() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_decrypt").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void cryptoV1EncryptPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_encrypt").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void cryptoV1EncryptPostFailure() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_encrypt").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void cryptoV1SignPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_sign").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void cryptoV1SignPostFailure() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_sign").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

    @Test
    public void cryptoV1VerifyPostSuccess() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_verify").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isOk());
    }

    @Test
    public void cryptoV1VerifyPostFailure() throws Exception {
        mockMvc.perform(post("/egov-enc-service/crypto/v1/_verify").contentType(MediaType
        .APPLICATION_JSON_UTF8))
        .andExpect(status().isBadRequest());
    }

}
