package org.egov.telemetry;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.errors.TopicExistsException;
import org.apache.kafka.streams.StreamsConfig;
import org.egov.telemetry.config.AppProperties;
import org.egov.telemetry.deduplicator.TelemetryDeduplicator;
import org.egov.telemetry.enrich.TelemetryEnrichMessages;
import org.egov.telemetry.formatchecker.TelemetryFormatChecker;
import org.egov.telemetry.sink.TelemetryFinalStream;
import org.egov.telemetry.unbundle.TelemetryUnbundleBatches;

import java.util.HashSet;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Slf4j
public class Main {

    public static void main(String args[]) throws Exception {
        checkIfFilesExists();

        AppProperties appProperties = new AppProperties();

        createTopics(appProperties);

        Properties streamsConfiguration = new Properties();
        streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, appProperties.getKafkaBootstrapServerConfig());
        streamsConfiguration.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");


        TelemetryFormatChecker telemetryFormatChecker = new TelemetryFormatChecker();
        telemetryFormatChecker.validateInputMessages(streamsConfiguration, appProperties.getTelemetryRawInput(),
                appProperties.getTelemetryValidatedMessages(), appProperties.getStreamNameTelemetryValidator());

        TelemetryDeduplicator telemetryDeduplicator = new TelemetryDeduplicator();
        telemetryDeduplicator.shouldRemoveDuplicatesFromTheInput(streamsConfiguration,
                appProperties.getTelemetryValidatedMessages(), appProperties.getTelemetryDedupedMessages(),
                appProperties.getDeDupStorageTime(), appProperties.getStreamNameTelemetryDeduplicator());

        TelemetryFinalStream telemetryFinalStream = new TelemetryFinalStream();
        telemetryFinalStream.pushFinalMessages(streamsConfiguration, appProperties.getTelemetryDedupedMessages(),
                appProperties.getTelemetrySecorFinalMessages(), appProperties.getStreamNameTelemetrySecorFinalPush());

        TelemetryUnbundleBatches telemetryUnbundleBatches = new TelemetryUnbundleBatches();
        telemetryUnbundleBatches.unbundleBatches(streamsConfiguration, appProperties.getTelemetryDedupedMessages(),
                appProperties.getTelemetryUnbundledMessages(), appProperties.getStreamNameTelemetryUnbundling());

        TelemetryEnrichMessages telemetryEnrichMessages = new TelemetryEnrichMessages();
        telemetryEnrichMessages.enrichMessages(streamsConfiguration, appProperties.getTelemetryUnbundledMessages(),
                appProperties.getTelemetryEnrichedMessages(), appProperties.getStreamNameTelemetryEnrichment());

        telemetryFinalStream.pushFinalMessages(streamsConfiguration, appProperties.getTelemetryEnrichedMessages(),
                appProperties.getTelemetryElasticsearchFinalMessages(), appProperties.getStreamNameTelemetryElasticsearchFinalPush());

    }

    private static void checkIfFilesExists() throws Exception {
        if(Main.class.getClassLoader().getResource("application.properties") == null)
            throw new Exception("Properties File Not Found");
        if(Main.class.getClassLoader().getResource("telemetryMessageSchema.json") == null)
            throw new Exception("Schema File Not Found");
    }

    private static void createTopics(AppProperties appProperties) {
        int numPartitions = appProperties.getNumberOfPartitions();
        short replicationFactor = appProperties.getReplicationFactor();

        Properties properties = new Properties();
        properties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, appProperties.getKafkaBootstrapServerConfig());

        AdminClient adminClient = KafkaAdminClient.create(properties);

        Set<String> telemetryTopics = new HashSet<>();
        telemetryTopics.add(appProperties.getTelemetryRawInput());
        telemetryTopics.add(appProperties.getTelemetryValidatedMessages());
        telemetryTopics.add(appProperties.getTelemetryDedupedMessages());
        telemetryTopics.add(appProperties.getTelemetryUnbundledMessages());
        telemetryTopics.add(appProperties.getTelemetryEnrichedMessages());
        telemetryTopics.add(appProperties.getTelemetrySecorFinalMessages());
        telemetryTopics.add(appProperties.getTelemetryElasticsearchFinalMessages());

        Set<String> allTopics;
        try {
            ListTopicsResult listTopicsResult = adminClient.listTopics();
            allTopics = listTopicsResult.names().get();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error fetching topic names from KafkaAdmin");
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage(), e);
        }

        telemetryTopics.removeAll(allTopics);

        Set<NewTopic> newTopics = telemetryTopics.stream()
                .map(topic -> new NewTopic(topic, numPartitions, replicationFactor)).collect(Collectors.toSet());

        CreateTopicsResult createTopicsResult = adminClient.createTopics(newTopics);

        Map<String, KafkaFuture<Void>> kafkaFutures = createTopicsResult.values();
        for(NewTopic newTopic : newTopics) {
            try {
                kafkaFutures.get(newTopic.name()).get();
                log.info("Topic created : " + newTopic.name());
            } catch (InterruptedException | ExecutionException e) {
                if (e.getCause() instanceof TopicExistsException) {
                    log.info("Topic already exists : " + newTopic.name());
                } else {
                    log.error("Error while creating topic : " + newTopic.name());
                    log.error(e.getMessage());
                    throw new RuntimeException(e.getMessage(), e);
                }
            }
        }

    }

}
