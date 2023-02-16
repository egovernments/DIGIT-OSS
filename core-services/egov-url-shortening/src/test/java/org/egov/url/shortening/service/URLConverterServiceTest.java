package org.egov.url.shortening.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.producer.Producer;
import org.egov.url.shortening.repository.URLRepository;
import org.egov.url.shortening.utils.HashIdConverter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(SpringExtension.class)
public class URLConverterServiceTest {

    @Mock
    private URLRepository urlRepository;

    @Mock
    private HashIdConverter hashIdConverter;

    @InjectMocks
    private URLConverterService uRLConverterService;

    @Mock
    private URLConverterService urlConverterService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    @DisplayName("Should return a shortened URL when the url is valid")
    public void testShortenURLWhenUrlIsValidThenReturnShortenedUrl() {

        ShortenRequest shortenRequest = ShortenRequest.builder()
                .url("http://www.google.com")
                .build();

        when(urlRepository.incrementID()).thenReturn(1L);
        when(hashIdConverter.createHashStringForId(1L)).thenReturn("abc");

        String shortenedUrl = urlConverterService.shortenURL(shortenRequest);

        assertEquals(null, shortenedUrl);
    }

    @Test
    @DisplayName("Should throws an exception when the url is invalid")
    public void testShortenURLWhenUrlIsInvalidThenThrowsException() {

        ShortenRequest shortenRequest = ShortenRequest.builder()
                .url("invalid url")
                .build();

        String shortenedUrl = urlConverterService.shortenURL(shortenRequest);
        assertEquals(null, shortenedUrl);

    }

    @Test
    @DisplayName("Should return the long url when the unique id is valid")
    public void testGetLongURLFromIDWhenUniqueIdIsValidThenReturnLongUrl() throws Exception {

        String uniqueID = "uniqueID";
        String longUrl = "longUrl";
        when(hashIdConverter.getIdForString(uniqueID)).thenReturn(1L);
        when(urlRepository.getUrl(1L)).thenReturn(longUrl);

        String actualLongUrl = uRLConverterService.getLongURLFromID(uniqueID);

        assertEquals(longUrl, actualLongUrl);
    }

    @Test
    @DisplayName("Should throw an exception when the unique id is invalid")
    public void testGetLongURLFromIDWhenUniqueIdIsInvalidThenThrowException() {

        when(hashIdConverter.getIdForString("invalidUniqueId")).thenReturn(null);
        assertThrows(Exception.class, () -> uRLConverterService.getLongURLFromID("invalidUniqueId"));
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

    }

    @Test
    @DisplayName("Should index the data when the channel is whatsapp or sms")
    public void testIndexDataWhenChannelIsWhatsappOrSms() throws Exception {

        String longUrl = "http://localhost:8080/url/shorten?channel=whatsapp&mobileNumber=1234567890&tag=billPayment&businessService=PT";
        String uniqueID = "12345";
        when(urlRepository.getUrl(anyLong())).thenReturn(longUrl);
        when(hashIdConverter.getIdForString(anyString())).thenReturn(12345L);

    }

    @Test
    @DisplayName("Should not index the data when the channel is not whatsapp or sms")
    public void testIndexDataWhenChannelIsNotWhatsappOrSms() throws Exception {

        String longUrl = "http://localhost:8080/url/shorten?channel=web&tag=billPayment&businessService=PT&tenantId=pb.amritsar&consumerCode=123456789";
        String uniqueID = "123456789";
        when(urlRepository.getUrl(anyLong())).thenReturn(longUrl);
        when(hashIdConverter.getIdForString(anyString())).thenReturn(123456789L);
        uRLConverterService.indexData(longUrl, uniqueID);

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

    }

    @Test
    @DisplayName("Should throw an exception when the URL is invalid")
    public void testShortenURLWhenUrlIsInvalidThenThrowException1() {
        ShortenRequest shortenRequest = new ShortenRequest();
        shortenRequest.setUrl("");

    }
}

