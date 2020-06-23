package org.egov.chat.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.errors.TopicExistsException;
import org.egov.chat.config.ApplicationProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

@Component
@Slf4j
public class KafkaTopicCreater {

    @Value("${kafka.topics.partition.count}")
    private int numPartitions;

    @Value("${kafka.topics.replication.factor}")
    private short replicationFactor;

    @Autowired
    private ApplicationProperties applicationProperties;

    public void createTopic(String topicName) {
        Properties properties = new Properties();
        properties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, applicationProperties.getKafkaHost());

        AdminClient adminClient = KafkaAdminClient.create(properties);


        List<NewTopic> newTopics = Collections.singletonList(new NewTopic(topicName, numPartitions, replicationFactor));

        CreateTopicsResult createTopicsResult = adminClient.createTopics(newTopics);

        Map<String, KafkaFuture<Void>> kafkaFutures = createTopicsResult.values();
        for (NewTopic newTopic : newTopics) {
            try {
                kafkaFutures.get(newTopic.name()).get();
                log.info("Topic created : " + newTopic.name());
            } catch (InterruptedException | ExecutionException e) {
                if (e.getCause() instanceof TopicExistsException) {
                    log.info("Topic already exists : " + newTopic.name());
                } else {
                    log.error("Error while creating topic : " + newTopic.name(), e);
                    throw new RuntimeException(e.getMessage(), e);
                }
            }
        }
    }
}
