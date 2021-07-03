package com.ingestpipeline.consumer;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

/**
 * The configurations for the Kafka Consumers are fed from this Config Class
 * @author Darshan Nagesh
 *
 */
@PropertySource(value= {"classpath:application.properties"})
@Configuration
@EnableKafka
public class ConsumerConfigurations {
	
	@Autowired
	org.springframework.core.env.Environment env;

    @Value("${spring.kafka.bootstrap.servers}")
    private String serverConfig;

    @Value("${kafka.consumer.config.auto_commit}")
    private Boolean enableAutoCommit;

    @Value("${kafka.consumer.config.auto_commit_interval}")
    private String autoCommitInterval;

    @Value("${kafka.consumer.config.session_timeout}")
    private String sessionTimeout;

    @Value("${kafka.consumer.config.group_id}")
    private String groupId;

    @Value("${kafka.consumer.config.auto_offset_reset}")
    private String autoOffsetReset;

    @Value("${spring.kafka.consumer.value-deserializer}")
    private String valueDeserializer; 
    
    @Value("${spring.kafka.consumer.key-deserializer}")
    private String keyDeserializer;


    public ConsumerFactory<String, Map> kafkaConsumerFactory() {
        JsonDeserializer<Map> deserializer = new JsonDeserializer<>(Map.class);
        //deserializer.setRemoveTypeHeaders(false);
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeMapperForKey(true);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, serverConfig);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Map> incomingKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Map> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(kafkaConsumerFactory());
        return factory;
    }

    
    
    /*@Bean
    KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory() {
        System.out.println("kafkaListenerContainerFactory");
        final ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setPollTimeout(3000);
        return factory;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        System.out.println("consumerFactory");
        return new DefaultKafkaConsumerFactory<>(consumerConfigs());
    }

    @Bean
    public Map<String, Object> consumerConfigs() {
        // TODO - Load configs from env vars
        final Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, serverConfig);
        propsMap.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, enableAutoCommit);
        propsMap.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, autoCommitInterval);
        propsMap.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, sessionTimeout);
        propsMap.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, autoOffsetReset);
        propsMap.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        propsMap.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        propsMap.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, HashMapDeserializer.class);
*//*        propsMap.put(JsonDeserializer., "*");
*//*        return propsMap;
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, IncomingData> incomingKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, IncomingData> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(taskConsumerFactory());
        return factory;
    }
    
    public ConsumerFactory<String, IncomingData> taskConsumerFactory() {
    	Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "task-group-notify");
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), new JsonDeserializer<>(IncomingData.class));
    }
*/
    /*
     * @Bean public TransactionPersistConsumer listener() { return new TransactionPersistConsumer(); }
     */
}