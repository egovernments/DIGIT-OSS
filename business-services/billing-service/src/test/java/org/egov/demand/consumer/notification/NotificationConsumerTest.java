package org.egov.demand.consumer.notification;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import java.util.HashMap;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.Bill;

import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillRequestV2;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {NotificationConsumer.class})
@ExtendWith(SpringExtension.class)
class NotificationConsumerTest {
    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private NotificationConsumer notificationConsumer;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private RestTemplate restTemplate;


    @Test
    void testListenVonvertValue() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    @Test
    void testListenBillRequest() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new BillRequest());
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }

    @Test
    void testListenWithNull() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(null);
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    @Test
    void testListenwithcanclebillWithValue() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");
        this.notificationConsumer.listen(new HashMap<>(), "${kafka.topics.cancel.bill.topic.name}");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }

    @Test
    void testListenCancleBillwithNull() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(null);
        this.notificationConsumer.listen(new HashMap<>(), "${kafka.topics.cancel.bill.topic.name}");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    @Test
    void testListenBillWithRequest() throws IllegalArgumentException {
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new BillRequestV2());
        this.notificationConsumer.listen(new HashMap<>(), "${kafka.topics.cancel.bill.topic.name}");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    @Test
    void testListen() throws IllegalArgumentException {
        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = new BillRequest(new RequestInfo(), billList);

        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(billRequest);
        this.notificationConsumer.listen(new HashMap<>(), "Topic");
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }
}

