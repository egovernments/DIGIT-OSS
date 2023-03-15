package org.egov.url.shortening.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.producer.Producer;
import org.egov.url.shortening.repository.URLRepository;
import org.egov.url.shortening.service.URLConverterService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;



class ShortenControllerTest {

    @Autowired
    private ShortenController shortenController;

    @Mock
    private MockMvc mockMvc;
    @Mock
    private URLConverterService urlConverterService;


    @Test
    @DisplayName("Should throws an exception when the id is invalid")
    public void testRedirectUrlWhenIdIsInvalidThenThrowsException() {
        assertThrows(Exception.class, () -> {
            shortenController.redirectUrl("invalidId", null);
        });
    }



    @Test
    void ShortenUrlSetUrl() throws Exception {
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        RestTemplate restTemplate = mock(RestTemplate.class);
        ShortenController shortenController = new ShortenController(
                new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer()));
        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setUrl("https://example.org/example");

    }

    @Test
    void testShortenUrlpostSucess() throws Exception {

        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        RestTemplate restTemplate = mock(RestTemplate.class);
        ShortenController shortenController = new ShortenController(
                new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer()));

        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setUrl("Shortening {}");
        assertThrows(CustomException.class, () -> shortenController.shortenUrl(shortenRequest));
    }
}

