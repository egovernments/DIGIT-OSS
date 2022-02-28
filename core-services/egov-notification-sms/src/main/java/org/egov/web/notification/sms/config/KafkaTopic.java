package org.egov.web.notification.sms.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopic {

    @Value("${kafka.topics.sms.bounce}")
    private String TOPIC;

    @Bean
    public NewTopic createNewTopic() {
        return TopicBuilder.name(TOPIC)
                .build();
    }
}
