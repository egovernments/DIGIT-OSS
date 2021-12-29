package org.egov.access;

import static org.mockito.Mockito.mock;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class TestConfiguration {

    @Bean
    @SuppressWarnings("unchecked")
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return mock(KafkaTemplate.class);
    }
    
    @Bean
    public MultiStateInstanceUtil multiStateInstanceUtil() {
    	return mock(MultiStateInstanceUtil.class);
    }

}
