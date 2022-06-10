package org.egov.infra.persist.consumer;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {StoppingErrorHandler.class})
@ExtendWith(SpringExtension.class)
class StoppingErrorHandlerTest {
    @MockBean
    private KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry;

    @Autowired
    private StoppingErrorHandler stoppingErrorHandler;

    @Test
    void testHandle() {
        doNothing().when(this.kafkaListenerEndpointRegistry).stop();
        Exception thrownException = new Exception("An error occurred");
        this.stoppingErrorHandler.handle(thrownException, new ConsumerRecord<>("Topic", 1, 1L, "Key", "Value"));
        verify(this.kafkaListenerEndpointRegistry).stop();
    }
}

