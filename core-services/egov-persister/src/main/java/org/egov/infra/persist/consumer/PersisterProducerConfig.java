package org.egov.infra.persist.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.Map;

@Configuration
public class PersisterProducerConfig {

	@Autowired
	private KafkaProperties kafkaProperties;

	@Bean
	public Map<String, Object> producerConfigs() {
		Map<String, Object> props = kafkaProperties.buildProducerProperties();

		return props;
	}

	@Bean
	public ProducerFactory<?, ?> producerFactory() {
		return new DefaultKafkaProducerFactory<>(producerConfigs());
	}

	@Bean
	public KafkaTemplate<?, ?> kafkaTemplate() {
		return new KafkaTemplate<>(producerFactory());
	}


}
