package org.egov.infra.persist.consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {PersisterProducerConfig.class, KafkaProperties.class})
@ExtendWith(SpringExtension.class)
class PersisterProducerConfigTest {
    @Autowired
    private KafkaProperties kafkaProperties;

    @Autowired
    private PersisterProducerConfig persisterProducerConfig;

    @Test
    void testProducerConfigs() {
        assertEquals(3, this.persisterProducerConfig.producerConfigs().size());
    }

    @Test
    void testProducerFactory() {
        assertTrue(this.persisterProducerConfig
                .producerFactory() instanceof org.springframework.kafka.core.DefaultKafkaProducerFactory);
    }

    @Test
    void testKafkaTemplate() {

        this.persisterProducerConfig.kafkaTemplate();
    }
}

