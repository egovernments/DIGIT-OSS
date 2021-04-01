package org.egov.infra.persist.consumer;


import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.egov.infra.persist.web.contract.TopicMap;
import org.egov.tracer.KafkaConsumerErrorHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer2;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@Configuration
@EnableKafka
@PropertySource("classpath:application.properties")
@Slf4j
public class PersisterConsumerConfig {

    @Autowired
    private StoppingErrorHandler stoppingErrorHandler;

    @Autowired
    private PersisterMessageListener indexerMessageListener;

    @Autowired
    private TopicMap topicMap;

    @Autowired
    private KafkaProperties kafkaProperties;

    @Autowired
    private KafkaConsumerErrorHandler kafkaConsumerErrorHandler;

    private Set<String> topics = new HashSet<>();

    @PostConstruct
    public void setTopics(){
        topicMap.getTopicMap().keySet().forEach(topic -> {
                    if(!topic.contains("-batch")){
                        topics.add(topic);
                    }
               });
        log.info("Topics subscribed for single listner: "+topics.toString());
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = kafkaProperties.buildConsumerProperties();

        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "15000");

        JsonDeserializer jsonDeserializer = new JsonDeserializer<>(Object.class,false);

        ErrorHandlingDeserializer2<String> errorHandlingDeserializer
                = new ErrorHandlingDeserializer2<>(jsonDeserializer);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), errorHandlingDeserializer);
    }

    @Bean
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties();
        factory.setConcurrency(3);
        factory.getContainerProperties().setPollTimeout(30000);
        factory.setErrorHandler(kafkaConsumerErrorHandler);

        log.info("Custom KafkaListenerContainerFactory built...");
        return factory;

    }

    @Bean
    public KafkaMessageListenerContainer<String, String> container() throws Exception {
        ContainerProperties properties = new ContainerProperties(this.topics.toArray(new String[topics.size()]));
        // set more properties
     //   properties.setPauseEnabled(true);
     //   properties.setPauseAfter(0);
     //   properties.setGenericErrorHandler(kafkaConsumerErrorHandler);
        properties.setMessageListener(indexerMessageListener);

        log.info("Custom KafkaListenerContainer built...");

        return new KafkaMessageListenerContainer<>(consumerFactory(), properties);
    }

    @Bean
    public boolean startContainer(){
        KafkaMessageListenerContainer<String, String> container = null;
        try {
            container = container();
        } catch (Exception e) {
            log.error("Container couldn't be started: ",e);
            return false;
        }
        container.start();
        log.info("Custom KakfaListenerContainer STARTED...");
        return true;

    }

    public boolean pauseContainer(){
        KafkaMessageListenerContainer<String, String> container = null;
        try {
            container = container();
        } catch (Exception e) {
            log.error("Container couldn't be started: ",e);
            return false;
        }
        container.stop();
        log.info("Custom KakfaListenerContainer STOPPED...");

        return true;
    }

    public boolean resumeContainer(){
        KafkaMessageListenerContainer<String, String> container = null;
        try {
            container = container();
        } catch (Exception e) {
            log.error("Container couldn't be started: ",e);
            return false;
        }
        container.start();
        log.info("Custom KakfaListenerContainer STARTED...");

        return true;
    }

}