package org.egov.pt.consumer;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.converter.StringJsonMessageConverter;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer2;
import org.springframework.kafka.support.serializer.JsonDeserializer;

@Configuration
class KafkaConsumerConfig {

	@Autowired
	private KafkaTemplate<String, Object> kafkatemplate;
	
    @Value("${kafka.config.bootstrap_server_config}")
    private String bootstrapServers;

    Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "egov-location");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        //props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer2.class);
        //props.put(ErrorHandlingDeserializer2.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class);
        //props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, Object.class);
        return props;
    }

    ConsumerFactory<String, Object> consumerFactory() {
       // return new DefaultKafkaConsumerFactory<>(consumerConfigs(), new StringDeserializer(), new ErrorHandlingDeserializer2(new JsonDeserializer(Object.class)));
    	return new DefaultKafkaConsumerFactory<>(consumerConfigs(), new StringDeserializer(), new ErrorHandlingDeserializer2<Object>(new JsonDeserializer<Object>(Object.class)));
    }

    @Bean
    KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, Object>> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        //factory.setReplyTemplate(kafkatemplate);
        // Comment the RecordFilterStrategy if Filtering is not required        
        //factory.setRecordFilterStrategy(record -> record.value().contains("ignored"));
        return factory;
    }
}