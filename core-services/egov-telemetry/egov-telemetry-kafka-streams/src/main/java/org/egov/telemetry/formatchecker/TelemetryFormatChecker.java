package org.egov.telemetry.formatchecker;

import lombok.extern.slf4j.Slf4j;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import org.apache.commons.io.IOUtils;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.egov.telemetry.utils.ValidationUtils;

import java.io.IOException;
import java.util.Properties;

@Slf4j
public class TelemetryFormatChecker {

    private boolean isValid(String jsonData) {
        try {
            String schema = IOUtils.toString(getClass().getClassLoader().getResourceAsStream("telemetryMessageSchema.json"));
            return ValidationUtils.isJsonValid(schema, jsonData);
        } catch (IOException e) {
            log.error("Not able to read Telemetry Message Schema");
        } catch (ProcessingException e) {
            log.error("Not able to validate JSON Schema");
        }
        return false;
    }

    public void validateInputMessages(Properties streamsConfiguration, String inputTopic, String outputTopicSuccess,
                                      String streamName) {
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

        StreamsBuilder builder = new StreamsBuilder();

        KStream<String, String> inputStream = builder.stream(inputTopic);
        KStream<String, String>[] branches = inputStream.branch(
                (key, value) -> isValid(value)
        );

        branches[0].mapValues((value) -> value).to(outputTopicSuccess);

        final KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfiguration);
        streams.cleanUp();
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

        log.info("Stream : " + streamName + " started. From : " + inputTopic + ", To : " + outputTopicSuccess);

    }


}
