package org.egov.telemetry.deduplicator;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KeyValueMapper;
import org.apache.kafka.streams.kstream.Transformer;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.Stores;
import org.apache.kafka.streams.state.WindowStore;
import org.apache.kafka.streams.state.WindowStoreIterator;
import org.json.JSONObject;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

@Slf4j
public class TelemetryDeduplicator {

    private static String storeName = "eventId-store";
    /**
     * Discards duplicate records from the input stream.
     *
     * Duplicate records are detected based on an event ID;  in this simplified example, the record
     * value is the event ID.  The transformer remembers known event IDs in an associated window state
     * store, which automatically purges/expires event IDs from the store after a certain amount of
     * time has passed to prevent the store from growing indefinitely.
     *
     * Note: This code is for demonstration purposes and was not tested for production usage.
     */
    private static class DeduplicationTransformer<K, V, E> implements Transformer<K, V, KeyValue<K, V>> {

        private ProcessorContext context;

        /**
         * Key: event ID
         * Value: timestamp (event-time) of the corresponding event when the event ID was seen for the
         * first time
         */
        private WindowStore<E, Long> eventIdStore;

        private final long leftDurationMs;
        private final long rightDurationMs;

        private final KeyValueMapper<K, V, E> idExtractor;

        /**
         * @param maintainDurationPerEventInMs how long to "remember" a known event (or rather, an event
         *                                     ID), during the time of which any incoming duplicates of
         *                                     the event will be dropped, thereby de-duplicating the
         *                                     input.
         * @param idExtractor extracts a unique identifier from a record by which we de-duplicate input
         *                    records; if it returns null, the record will not be considered for
         *                    de-duping but forwarded as-is.
         */
        DeduplicationTransformer(long maintainDurationPerEventInMs, KeyValueMapper<K, V, E> idExtractor) {
            if (maintainDurationPerEventInMs < 1) {
                throw new IllegalArgumentException("maintain duration per event must be >= 1");
            }
            leftDurationMs = maintainDurationPerEventInMs / 2;
            rightDurationMs = maintainDurationPerEventInMs - leftDurationMs;
            this.idExtractor = idExtractor;
        }

        @Override
        @SuppressWarnings("unchecked")
        public void init(final ProcessorContext context) {
            this.context = context;
            eventIdStore = (WindowStore<E, Long>) context.getStateStore(storeName);
        }

        public KeyValue<K, V> transform(final K key, final V value) {
            E eventId = idExtractor.apply(key, value);
            if (eventId == null) {
                return KeyValue.pair(key, value);
            } else {
                KeyValue<K, V> output;
                if (isDuplicate(eventId)) {
                    output = null;
                    updateTimestampOfExistingEventToPreventExpiry(eventId, context.timestamp());
                } else {
                    output = KeyValue.pair(key, value);
                    rememberNewEvent(eventId, context.timestamp());
                }
                return output;
            }
        }

        private boolean isDuplicate(final E eventId) {
            long eventTime = context.timestamp();
            WindowStoreIterator<Long> timeIterator = eventIdStore.fetch(
                    eventId,
                    eventTime - leftDurationMs,
                    eventTime + rightDurationMs);
            boolean isDuplicate = timeIterator.hasNext();
            timeIterator.close();
            return isDuplicate;
        }

        private void updateTimestampOfExistingEventToPreventExpiry(final E eventId, long newTimestamp) {
            eventIdStore.put(eventId, newTimestamp, newTimestamp);
        }

        private void rememberNewEvent(final E eventId, long timestamp) {
            eventIdStore.put(eventId, timestamp, timestamp);
        }

        @Override
        public KeyValue<K, V> punctuate(final long timestamp) {
            // our windowStore segments are closed automatically
            return null;
        }

        @Override
        public void close() {
            // Note: The store should NOT be closed manually here via `eventIdStore.close()`!
            // The Kafka Streams API will automatically close stores when necessary.
        }

    }

    public void shouldRemoveDuplicatesFromTheInput(Properties streamsConfiguration, String inputTopic,
                                                   String outputTopic, Integer deDupStorageTime, String streamName) {

        StreamsBuilder builder = new StreamsBuilder();

        streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);
        streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.ByteArray().getClass().getName());
        streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

        long maintainDurationPerEventInMs = TimeUnit.MINUTES.toMillis(deDupStorageTime);

        // The number of segments has no impact on "correctness".
        // Using more segments implies larger overhead but allows for more fined grained record expiration
        // Note: the specified retention time is a _minimum_ time span and no strict upper time bound
        int numberOfSegments = 3;

        // retention period must be at least window size -- for this use case, we don't need a longer retention period
        // and thus just use the window size as retention time
        long retentionPeriod = maintainDurationPerEventInMs;

        StoreBuilder<WindowStore<String, Long>> dedupStoreBuilder = Stores.windowStoreBuilder(
                Stores.persistentWindowStore(storeName,
                        retentionPeriod,
                        numberOfSegments,
                        maintainDurationPerEventInMs,
                        false
                ),
                Serdes.String(),
                Serdes.Long());


        builder.addStateStore(dedupStoreBuilder);


        KStream<byte[], String> input = builder.stream(inputTopic);
        KStream<byte[], String> deduplicated = input.transform(
                () -> new DeduplicationTransformer<>(maintainDurationPerEventInMs, (key, value) -> RemoveMetaData.getMD5(String.valueOf(value))),
                storeName);
        deduplicated.to(outputTopic);

        KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfiguration);
        streams.cleanUp();
        streams.start();
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

        log.info("Stream : " + streamName + " started. From : " + inputTopic + ", To : " + outputTopic);

    }


    private static class RemoveMetaData {
        public static String getMD5(String value) {
            JSONObject jsonObject = new JSONObject(value);
            jsonObject.remove("syncts");                        //Remove Timestamp (added by server)
            jsonObject.remove("mid");                           //Remove MessageId (added by server)
            String timeRemovedValue = jsonObject.toString();

            return DigestUtils.md5Hex(timeRemovedValue).toUpperCase();
        }
    }

}
