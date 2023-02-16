package org.egov.collection.notification.consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import org.egov.collection.model.Payment;

import org.egov.collection.model.PaymentRequest;

import org.egov.collection.producer.CollectionProducer;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {NotificationConsumer.class})
@ExtendWith(SpringExtension.class)
class NotificationConsumerTest {
    @MockBean
    private CollectionProducer collectionProducer;

    @Autowired
    private NotificationConsumer notificationConsumer;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    void testListen() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
        assertEquals("${coll.notification.fallback.locale}", this.notificationConsumer.getFallBackLocale());
        assertEquals("${coll.notification.ui.redirect.url}", this.notificationConsumer.getUiRedirectUrl());
        assertEquals("${coll.notification.ui.host}", this.notificationConsumer.getUiHost());
        assertEquals("${kafka.topics.notification.sms.key}", this.notificationConsumer.getSmsTopickey());
        assertEquals("${kafka.topics.notification.sms}", this.notificationConsumer.getSmsTopic());
        assertEquals("${egov.mdms.search.endpoint}", this.notificationConsumer.getMdmsUrl());
        assertEquals("${egov.mdms.host}", this.notificationConsumer.getMdmsHost());
        assertEquals("${egov.localization.host}", this.notificationConsumer.getLocalizationHost());
        assertEquals("${egov.localization.search.endpoint}", this.notificationConsumer.getLocalizationEndpoint());
    }

    @Test
    void testListen2() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new PaymentRequest());
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
        assertEquals("${coll.notification.fallback.locale}", this.notificationConsumer.getFallBackLocale());
        assertEquals("${coll.notification.ui.redirect.url}", this.notificationConsumer.getUiRedirectUrl());
        assertEquals("${coll.notification.ui.host}", this.notificationConsumer.getUiHost());
        assertEquals("${kafka.topics.notification.sms.key}", this.notificationConsumer.getSmsTopickey());
        assertEquals("${kafka.topics.notification.sms}", this.notificationConsumer.getSmsTopic());
        assertEquals("${egov.mdms.search.endpoint}", this.notificationConsumer.getMdmsUrl());
        assertEquals("${egov.mdms.host}", this.notificationConsumer.getMdmsHost());
        assertEquals("${egov.localization.host}", this.notificationConsumer.getLocalizationHost());
        assertEquals("${egov.localization.search.endpoint}", this.notificationConsumer.getLocalizationEndpoint());
    }

    @Test
    void testListen3() throws IllegalArgumentException {
        RequestInfo requestInfo = new RequestInfo();
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any()))
                .thenReturn(new PaymentRequest(requestInfo, new Payment()));
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }

    @Test
    void testListen4() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(null);
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
        assertEquals("${coll.notification.fallback.locale}", this.notificationConsumer.getFallBackLocale());
        assertEquals("${coll.notification.ui.redirect.url}", this.notificationConsumer.getUiRedirectUrl());
        assertEquals("${coll.notification.ui.host}", this.notificationConsumer.getUiHost());
        assertEquals("${kafka.topics.notification.sms.key}", this.notificationConsumer.getSmsTopickey());
        assertEquals("${kafka.topics.notification.sms}", this.notificationConsumer.getSmsTopic());
        assertEquals("${egov.mdms.search.endpoint}", this.notificationConsumer.getMdmsUrl());
        assertEquals("${egov.mdms.host}", this.notificationConsumer.getMdmsHost());
        assertEquals("${egov.localization.host}", this.notificationConsumer.getLocalizationHost());
        assertEquals("${egov.localization.search.endpoint}", this.notificationConsumer.getLocalizationEndpoint());
    }

    @Test
    void testListen5() throws IllegalArgumentException, RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any())).thenReturn(new HashMap<>());

        Payment payment = new Payment();
        payment.setTenantId("42");
        PaymentRequest paymentRequest = new PaymentRequest(new RequestInfo(), payment);

        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(paymentRequest);
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<Map<Object, Object>>) any(),
                (Object[]) any());
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }
}

