package org.egov.infra.persist.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.infra.persist.service.PersistService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {PersisterBatchListner.class})
@ExtendWith(SpringExtension.class)
class PersisterBatchListnerTest {
    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private PersistService persistService;

    @Autowired
    private PersisterBatchListner persisterBatchListner;


    //@Test
    void testOnMessage() {

        this.persisterBatchListner.onMessage(new ArrayList<>());
    }

    //@Test
    void testOnMessage2() throws JsonProcessingException {
        doNothing().when(this.persistService).persist((String) any(), (java.util.List<String>) any());
        when(this.objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<ConsumerRecord<String, Object>> consumerRecordList = new ArrayList<>();
        consumerRecordList.add(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        this.persisterBatchListner.onMessage(consumerRecordList);
        verify(this.persistService).persist((String) any(), (java.util.List<String>) any());
        verify(this.objectMapper).writeValueAsString((Object) any());
    }

    //@Test
    void testOnMessage3() throws JsonProcessingException {
        doNothing().when(this.persistService).persist((String) any(), (java.util.List<String>) any());
        when(this.objectMapper.writeValueAsString((Object) any())).thenThrow(mock(JsonProcessingException.class));

        ArrayList<ConsumerRecord<String, Object>> consumerRecordList = new ArrayList<>();
        consumerRecordList.add(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        this.persisterBatchListner.onMessage(consumerRecordList);
        verify(this.objectMapper).writeValueAsString((Object) any());
    }

    //@Test
    void testOnMessage4() throws JsonProcessingException {
        doNothing().when(this.persistService).persist((String) any(), (java.util.List<String>) any());
        when(this.objectMapper.writeValueAsString((Object) any())).thenReturn("42");

        ArrayList<ConsumerRecord<String, Object>> consumerRecordList = new ArrayList<>();
        consumerRecordList.add(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        consumerRecordList.add(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        this.persisterBatchListner.onMessage(consumerRecordList);
        verify(this.persistService).persist((String) any(), (java.util.List<String>) any());
        verify(this.objectMapper, atLeast(1)).writeValueAsString((Object) any());
    }
}

