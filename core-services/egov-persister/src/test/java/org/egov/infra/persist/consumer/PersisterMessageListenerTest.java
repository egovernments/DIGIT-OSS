package org.egov.infra.persist.consumer;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

@ContextConfiguration(classes = {PersisterMessageListener.class})
@ExtendWith(SpringExtension.class)
class PersisterMessageListenerTest {
    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private PersistService persistService;

    @Autowired
    private PersisterMessageListener persisterMessageListener;

    //@Test
    void testOnMessage() throws JsonProcessingException {
        doNothing().when(this.persistService).persist((String) any(), (String) any());
        when(this.objectMapper.writeValueAsString((Object) any())).thenReturn("42");
        this.persisterMessageListener.onMessage(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        verify(this.persistService).persist((String) any(), (String) any());
        verify(this.objectMapper).writeValueAsString((Object) any());
    }

    //@Test
    void testOnMessage2() throws JsonProcessingException {
        doNothing().when(this.persistService).persist((String) any(), (String) any());
        when(this.objectMapper.writeValueAsString((Object) any())).thenThrow(mock(JsonProcessingException.class));
        this.persisterMessageListener.onMessage(new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        verify(this.persistService).persist((String) any(), (String) any());
        verify(this.objectMapper).writeValueAsString((Object) any());
    }
}

