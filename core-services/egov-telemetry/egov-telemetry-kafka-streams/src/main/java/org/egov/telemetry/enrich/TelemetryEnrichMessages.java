package org.egov.telemetry.enrich;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KeyValueMapper;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Properties;
import java.util.TimeZone;

@Slf4j
public class TelemetryEnrichMessages {

    private String getOutputKey(JSONObject jsonObject) {
        return jsonObject.getString("mid");
    }

    private Long getTimestamp(JSONObject jsonObject) {
        return jsonObject.getLong("ets");
    }

    private void addTimestampToMessage(JSONObject jsonObject) {
        Date date = new Date(Long.valueOf(getTimestamp(jsonObject)));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        jsonObject.put("@timestamp", formatter.format(date));
    }

    public void enrichMessages(Properties streamsConfiguration, String inputTopic, String outputTopic,
                               String streamName) {
        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_TIMESTAMP_EXTRACTOR_CLASS_CONFIG,
                TelemetryEventTimestampExtractor.class);

        StreamsBuilder builder = new StreamsBuilder();

        KStream<String, String> inputStream = builder.stream(inputTopic);

        inputStream.map(new KeyValueMapper<String, String, KeyValue<?, ?>>() {
            @Override
            public KeyValue<?, ?> apply(String key, String value) {
                JSONObject jsonObject = new JSONObject(value);
                String outputKey = getOutputKey(jsonObject);
                addTimestampToMessage(jsonObject);
                return KeyValue.pair(outputKey, jsonObject.toString());
            }
        }).to(outputTopic);

        final KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfiguration);
        streams.cleanUp();
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

        log.info("Stream : " + streamName + " started. From : " + inputTopic + ", To : " + outputTopic);

    }

}

