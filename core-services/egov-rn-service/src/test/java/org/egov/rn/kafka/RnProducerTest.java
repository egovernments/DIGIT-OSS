package org.egov.rn.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RnProducerTest {

    @Mock
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    private ObjectMapper objectMapper;

    @InjectMocks
    private RnProducer rnProducer;


    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        rnProducer = new RnProducer(kafkaTemplate, objectMapper);
    }

    @Test
    @DisplayName("should send message on the given kafka topic")
    void shouldSendMessageOnTheGivenKafkaTopic() {
        assertDoesNotThrow(() -> rnProducer.send("some_topic", "string"));
    }
}