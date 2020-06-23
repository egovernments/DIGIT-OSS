package org.egov.chat.config;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.connect.json.JsonDeserializer;
import org.apache.kafka.connect.json.JsonSerializer;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.errors.LogAndContinueExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class KafkaStreamsConfig {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Value("${kafka.consumer.poll.ms}")
    private Integer kafkaConsumerPollMs;
    @Value("${kafka.producer.linger.ms}")
    private Integer kafkaProducerLingerMs;

    private static Properties defaultStreamConfiguration;
    private static Serde<JsonNode> jsonSerde;


    public void startStream(StreamsBuilder builder, Properties streamConfiguration) {
        final KafkaStreams streams = new KafkaStreams(builder.build(), streamConfiguration);
        streams.cleanUp();
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
    }

    public Properties getDefaultStreamConfiguration() {
        if (defaultStreamConfiguration == null)
            initDefaultStreamConfiguration();
        return (Properties) defaultStreamConfiguration.clone();
    }

    private void initDefaultStreamConfiguration() {
        defaultStreamConfiguration = new Properties();
        defaultStreamConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, applicationProperties.getKafkaHost());
        defaultStreamConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        defaultStreamConfiguration.put(StreamsConfig.DEFAULT_DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG,
                LogAndContinueExceptionHandler.class.getName());
        defaultStreamConfiguration.put(StreamsConfig.POLL_MS_CONFIG, kafkaConsumerPollMs);
        defaultStreamConfiguration.put(ProducerConfig.LINGER_MS_CONFIG, kafkaProducerLingerMs);
    }

    public Serde<JsonNode> getJsonSerde() {
        if (jsonSerde == null)
            initJsonSerde();
        return jsonSerde;
    }

    private void initJsonSerde() {
        Serializer<JsonNode> jsonSerializer = new JsonSerializer();
        Deserializer<JsonNode> jsonDeserializer = new JsonDeserializer();
        jsonSerde = Serdes.serdeFrom(jsonSerializer, jsonDeserializer);
    }
}
