package org.egov.telemetry.sink;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.ValueMapper;

import java.util.Properties;


@Slf4j
public class TelemetryFinalStream {

    public void pushFinalMessages(Properties streamsConfiguration, String inputTopic, String outputTopic,
                                  String streamName) {
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

        StreamsBuilder builder = new StreamsBuilder();

        KStream<String, String> inputStream = builder.stream(inputTopic);

        inputStream.mapValues(new ValueMapper<String, String>() {
            @Override
            public String apply(String value) {
                log.info("Message pushed to " + outputTopic);
                return value;
            }
        }).to(outputTopic);

        final KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfiguration);
        streams.cleanUp();
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

        log.info("Stream : " + streamName + " started. From : " + inputTopic + ", To : " + outputTopic);

    }

}
