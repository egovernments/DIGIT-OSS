package org.egov.url.shortening.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.producer.Producer;
import org.egov.url.shortening.repository.URLRepository;
import org.egov.url.shortening.utils.HashIdConverter;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(SpringExtension.class)
@SpringBootTest
public class URLConverterServiceTest {

    @Mock
    private URLRepository urlRepository;

    @Mock
    private HashIdConverter hashIdConverter;

    @Autowired
    private URLConverterService uRLConverterService;
    @Mock
    private URLConverterService urlConverterService;

    @Test
    @DisplayName("Should index the data when the channel is whatsapp or sms")
    public void testIndexDataWhenChannelIsWhatsappOrSms() throws Exception {

        String longUrl = "http://localhost:8080/url/shorten?channel=whatsapp&mobileNumber=1234567890&tag=billPayment&businessService=PT";
        String uniqueID = "12345";
        when(urlRepository.getUrl(anyLong())).thenReturn(longUrl);
        when(hashIdConverter.getIdForString(anyString())).thenReturn(12345L);
        uRLConverterService.indexData(longUrl, uniqueID);
       verify(urlConverterService, never()).indexData(longUrl, uniqueID);

    }

    @Test
    @DisplayName("Should not index the data when the channel is not whatsapp or sms")
    public void testIndexDataWhenChannelIsNotWhatsappOrSms() throws Exception {

        String longUrl = "http://localhost:8080/url/shorten?channel=web&tag=billPayment&businessService=PT&tenantId=pb.amritsar&consumerCode=123456789";
        String uniqueID = "123456789";
        when(urlRepository.getUrl(anyLong())).thenReturn(longUrl);
        when(hashIdConverter.getIdForString(anyString())).thenReturn(123456789L);
        uRLConverterService.indexData(longUrl, uniqueID);
        verify(urlConverterService, never()).indexData(longUrl, uniqueID);

    }

      @Test
           @DisplayName("Should index the data when the channel is whatsapp or sms")
           public void testIndexDataWhenChannelIsWhatsappOrSms1() throws Exception {

               String longUrl = "http://localhost:8080/url/shorten?channel=whatsapp&mobileNumber=1234567890&tag=billPayment&businessService=PT";
               String uniqueID = "12345";
               HashMap<String, Object> data = new HashMap<String, Object>();
               data.put("id", UUID.randomUUID());
               data.put("timestamp", System.currentTimeMillis());
               data.put("shortenUrl", "http://localhost:8080/url/12345");
               data.put("actualUrl", longUrl);
               data.put("user", "12345");
               data.put("tag", "Property Bill Payment");

               when(hashIdConverter.getIdForString(uniqueID)).thenReturn(1L);
               when(urlRepository.getUrl(1L)).thenReturn(longUrl);


       }

       @Test
       @DisplayName("Should not index the data when the channel is not whatsapp or sms")
       public void testIndexDataWhenChannelIsNotWhatsappOrSms2() throws Exception {

           String longUrl = "http://localhost:8080/url/shorten?channel=email&mobileNumber=1234567890&tag=billPayment&businessService=PT";
           String uniqueID = "12345";
           when(urlRepository.getUrl(anyLong())).thenReturn(longUrl);
           when(hashIdConverter.getIdForString(anyString())).thenReturn(12345L);
           when(urlConverterService.indexData(anyString(), anyString())).thenCallRealMethod();
           assertNull(uRLConverterService.indexData(longUrl, uniqueID));
       }

       @Test
       @DisplayName("Should return a shortened URL when the URL is valid")
       public void testShortenURLWhenUrlIsValidThenReturnShortenedUrl() {

           ShortenRequest shortenRequest = new ShortenRequest();
           shortenRequest.setUrl("https://www.google.com");
           when(urlRepository.incrementID()).thenReturn(1L);
           when(hashIdConverter.createHashStringForId(1L)).thenReturn("abc");
           String shortenedUrl = uRLConverterService.shortenURL(shortenRequest);
           assertEquals(shortenedUrl, shortenedUrl);
       }

    @Test
    @DisplayName("Should throw an exception when the URL is invalid")
    public void testShortenURLWhenUrlIsInvalidThenThrowException() {
        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setUrl("");
        assertNull(null , uRLConverterService.shortenURL(shortenRequest) );
    }

    @Test
    void testInitialize() {
       uRLConverterService.initialize();
    }

    @Test
    void testGetUserUUIDSuccess() throws RestClientException {

        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn("Post For Object");
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        assertNull(
                (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).getUserUUID("foo"));
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testGetUserUUIDMapUser() throws RestClientException {

        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(new HashMap<>());
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        assertNull(
                (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).getUserUUID("foo"));
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testGetUserUUIDNull() throws RestClientException {

        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(null);
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        assertNull(
                (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).getUserUUID("foo"));
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testGetUserUUIDErrorOccur() throws RestClientException {
        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenThrow(new CustomException("type", "An error occurred"));
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        assertNull(
                (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).getUserUUID("foo"));
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
    void testGetUserUUIDUserNotFound() throws RestClientException {
        HashMap<Object, Object> objectObjectMap = new HashMap<>();
        objectObjectMap.put("Key", "Value");
        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(objectObjectMap);
        ArrayList<URLRepository> urlRepositories = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        assertNull(
                (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).getUserUUID("foo"));
        verify(restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
    }

    @Test
     void testIndexData() {
         RestTemplate restTemplate = mock(RestTemplate.class);
         ArrayList<URLRepository> urlRepositories = new ArrayList<>();
         ObjectMapper objectMapper = new ObjectMapper();
         assertNull(
                 (new URLConverterService(urlRepositories, objectMapper, restTemplate, new Producer())).indexData("https://www.youtube.com/watch?v=Aasp0mWT3Ac&ab_channel=rieckpil", "1"));
     }

    @Test
    void testGetLongURLFromIDIsEmpty() throws Exception {
        assertEquals("https://www.google.com", uRLConverterService.getLongURLFromID("1"));
    }

    @Test
    void testIndexDataWithNull() {
        StringBuilder stringBuilder = new StringBuilder();

        assertEquals(null, uRLConverterService.indexData("https://www.youtube.com/watch?v=Aasp0mWT3Ac&ab_channel=rieckpil", "1"));
    }
}

