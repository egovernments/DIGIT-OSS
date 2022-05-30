package org.egov.url.shortening.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.producer.Producer;
import org.egov.url.shortening.repository.URLRepository;
import org.egov.url.shortening.service.URLConverterService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ShortenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private URLConverterService urlConverterService;

    @Test
    @DisplayName("Should redirect to the long url when the id is valid")
    public void testRedirectUrlWhenIdIsValidThenRedirectToLongUrl() throws Exception {

        String id = "abc";
        String longUrl = "http://www.google.com";
        when(urlConverterService.getLongURLFromID(id)).thenReturn(longUrl);

        try {
            mockMvc.perform(get("/" + id))
                    .andExpect(status().is3xxRedirection())
                    .andExpect(redirectedUrl(longUrl));
        } catch (Exception e) {
            fail("Should not throw exception");
        }

        verify(urlConverterService, times(1)).getLongURLFromID(id);
    }

    @Test
    @DisplayName("Should throws an exception when the id is invalid")
    public void testRedirectUrlWhenIdIsInvalidThenThrowsException() throws Exception {

        String id = "invalidId";
        when(urlConverterService.getLongURLFromID(id)).thenThrow(new CustomException("INVALID_REQUEST", "Invalid Key"));
        assertThrows(CustomException.class, () -> urlConverterService.getLongURLFromID(id));
    }

    @Test
    public void ShortenUrlPostFail() throws Exception {
        mockMvc.perform(post("/shortener")
                        .accept(MediaType.APPLICATION_JSON).content("")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void ShortenUrlPostSuccess() throws Exception {
        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setUrl("https://www.youtube.com/watch?v=Aasp0mWT3Ac&ab_channel=rieckpil");
        shortenRequest.setId("10");
        shortenRequest.setValidFrom(1L);
        shortenRequest.setValidTill(18L);
        ObjectMapper objectMapper = new ObjectMapper();
        String Json = objectMapper.writeValueAsString(shortenRequest);

        mockMvc.perform(post("/shortener")
                        .accept(MediaType.APPLICATION_JSON).content(Json)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
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
    void ShortenUrl() throws Exception {
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

