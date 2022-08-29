package org.egov.rn.kafka;

import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class ProducerTest {

    @Mock
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private Producer producer;


    @BeforeEach
    void setUp() {
        producer = new Producer(kafkaTemplate);
    }

    @Test
    @DisplayName("should send message on the given kafka topic")
    void shouldSendMessageOnTheGivenKafkaTopic() {
        assertDoesNotThrow(() -> producer.send("some_topic", new Object()));
    }
}