package org.egov.tracer.kafka;

import org.egov.tracer.config.TracerConfiguration;
import org.egov.tracer.config.TracerProperties;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.SystemOutRule;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TracerConfiguration.class, TestConfiguration.class})
public class KafkaListenerLoggingAspectTest {

    private static final String TEST_CORRELATION_ID = "testCorrelationId";
    @Rule
    public final SystemOutRule systemOutRule = new SystemOutRule().enableLog();

    @Autowired
    private KafkaListenerWithOnlyPayloadAnnotatedHashMap kafkaListenerWithOnlyPayloadAnnotatedHashMap;

    @Autowired
    private KafkaListenerStringPayloadWithTopicHeaderAnnotation kafkaListenerStringPayloadWithTopicHeaderAnnotation;

    @Autowired
    private KafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation
        kafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation;

    @Autowired
    private KafkaListenerStringPayloadWithNonTopicHeaderAnnotation
        kafkaListenerStringPayloadWithNonTopicHeaderAnnotation;

    @Autowired
    private TracerProperties tracerProperties;

    @Before
    public void before() {
        systemOutRule.clearLog();
    }

    @Test
    public void test_should_retrieve_correlation_id_from_hash_map_payload_and_set_to_context() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("correlationId", TEST_CORRELATION_ID);
        payload.put("RequestInfo", requestInfo);

        kafkaListenerWithOnlyPayloadAnnotatedHashMap.bar(payload);

    }

    @Test
    public void test_should_set_context_with_random_correlation_id_when_hash_map_payload_does_not_have_correlation_id_field() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("foo", "abc");
        payload.put("RequestInfo", requestInfo);

        kafkaListenerWithOnlyPayloadAnnotatedHashMap.bar(payload);

    }

    @Test
    @Ignore
    public void test_simple_log_message_should_mention_topic_name_is_unavailable_when_topic_header_annotation_is_not_present() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("foo", "abc");
        payload.put("RequestInfo", requestInfo);
        when(tracerProperties.isRequestLoggingEnabled()).thenReturn(false);

        kafkaListenerWithOnlyPayloadAnnotatedHashMap.bar(payload);

        assertTrue(systemOutRule.getLog().contains("Received message from topic: <NOT-AVAILABLE>"));
    }

    @Test
    @Ignore
    public void test_detail_message_should_print_unavailable_topic_name_and_stringified_payload() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("foo", "abc");
        payload.put("RequestInfo", requestInfo);
        when(tracerProperties.isRequestLoggingEnabled()).thenReturn(true);

        kafkaListenerWithOnlyPayloadAnnotatedHashMap.bar(payload);

        final String expectedBody = "{\"RequestInfo\":{\"foo\":\"abc\"}}";
        final String expectedMessage = "Received message from topic: <NOT-AVAILABLE> with body " + expectedBody;
        assertTrue(systemOutRule.getLog().contains(expectedMessage));
    }

    @Test
    public void test_should_retrieve_correlation_id_from_string_payload_and_set_to_context() {
        final String payload = "{\"RequestInfo\": { \"correlationId\": \"testCorrelationId\"}}";

        kafkaListenerStringPayloadWithTopicHeaderAnnotation.bar(payload, "actualTopic");

    }

    @Test
    public void test_should_set_random_correlation_id_to_context_when_string_payload_does_not_have_correlation_id_field() {
        final String payload = "{\"RequestInfo\": { \"foo\": \"bar\"}}";

        kafkaListenerStringPayloadWithTopicHeaderAnnotation.bar(payload, "actualTopic");

    }

    @Test
    @Ignore
    public void test_should_print_detailed_log_with_stringified_body_and_topic_name() {
        final String payload = "{\"RequestInfo\": { \"foo\": \"bar\"}}";
        when(tracerProperties.isRequestLoggingEnabled()).thenReturn(true);
        kafkaListenerStringPayloadWithTopicHeaderAnnotation.bar(payload, "actualTopic");

        final String expectedMessage = "Received message from topic: actualTopic with body " + payload;
        assertTrue(systemOutRule.getLog().contains(expectedMessage));
    }

    @Test
    @Ignore
    public void test_should_set_random_correlation_id_when_payload_parameter_is_not_annotated() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("foo", "abc");
        payload.put("RequestInfo", requestInfo);

        kafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation.bar(payload);

    }

    @Test
    @Ignore
    public void test_should_print_detailed_log_with_unavailable_body_and_unavailable_topic_name() {
        final HashMap<String, Object> payload = new HashMap<>();
        final HashMap<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("foo", "abc");
        payload.put("RequestInfo", requestInfo);

        kafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation.bar(payload);

        final String expectedMessage = "Received message from topic: <NOT-AVAILABLE> with body <NOT-AVAILABLE>";
        assertTrue(systemOutRule.getLog().contains(expectedMessage));
    }

    @Test
    @Ignore
    public void test_should_print_detailed_log_with_stringified_body_and_unavailable_topic_name() {
        final String payload = "{\"RequestInfo\": { \"foo\": \"bar\"}}";
        when(tracerProperties.isRequestLoggingEnabled()).thenReturn(true);

        kafkaListenerStringPayloadWithNonTopicHeaderAnnotation.bar(payload, 3);

        final String expectedMessage = "Received message from topic: <NOT-AVAILABLE> with body " + payload;
        assertTrue(systemOutRule.getLog().contains(expectedMessage));
    }

}

@Configuration
class TestConfiguration {

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return mock(KafkaTemplate.class);
    }

    @Bean
    public KafkaListenerWithOnlyPayloadAnnotatedHashMap kafkaListenerWithOnlyHashMapPayload() {
        return new KafkaListenerWithOnlyPayloadAnnotatedHashMap();
    }

    @Bean
    public KafkaListenerStringPayloadWithTopicHeaderAnnotation kafkaListenerStringPayloadWithAnnotation() {
        return new KafkaListenerStringPayloadWithTopicHeaderAnnotation();
    }

    @Bean
    public KafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation
    kafkaListenerWithPayloadNotHavingPayloadAnnotation() {
        return new KafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation();
    }

    @Bean
    public KafkaListenerStringPayloadWithNonTopicHeaderAnnotation
    kafkaListenerStringPayloadWithNonTopicHeaderAnnotation() {
        return new KafkaListenerStringPayloadWithNonTopicHeaderAnnotation();
    }

    @Bean
    public TracerProperties tracerProperties() {
        final TracerProperties tracerProperties = mock(TracerProperties.class);
        when(tracerProperties.isRequestLoggingEnabled()).thenReturn(true);
        return tracerProperties;
    }
}

class KafkaListenerWithOnlyPayloadAnnotatedHashMap {

    @KafkaListener(topics = "${my.topics1}")
    public void bar(@Payload HashMap<String, Object> payload) {

    }
}

class KafkaListenerStringPayloadWithTopicHeaderAnnotation {

    @KafkaListener(topics = "${my.topics2}")
    public void bar(@Payload String payload, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

    }
}

class KafkaListenerWithoutPayloadAnnotationAndWithoutTopicHeaderAnnotation {

    @KafkaListener(topics = "${my.topics1}")
    public void bar(HashMap<String, Object> payload) {

    }
}

class KafkaListenerStringPayloadWithNonTopicHeaderAnnotation {

    @KafkaListener(topics = "${my.topics2}")
    public void bar(@Payload String payload, @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition) {

    }
}

