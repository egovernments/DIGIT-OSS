package org.egov.telemetry.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


@Slf4j
@Getter
public class AppProperties {

    private String kafkaBootstrapServerConfig;
    private Integer numberOfPartitions;
    private Short replicationFactor;

    private String telemetryRawInput;
    private String telemetryValidatedMessages;
    private String telemetryDedupedMessages;
    private String telemetryUnbundledMessages;
    private String telemetryEnrichedMessages;
    private String telemetrySecorFinalMessages;
    private String telemetryElasticsearchFinalMessages;

    private String streamNameTelemetryValidator;
    private String streamNameTelemetryDeduplicator;
    private String streamNameTelemetryUnbundling;
    private String streamNameTelemetryEnrichment;
    private String streamNameTelemetrySecorFinalPush;
    private String streamNameTelemetryElasticsearchFinalPush;

    private Integer deDupStorageTime; //In Minutes

    public AppProperties() {
        kafkaBootstrapServerConfig = System.getenv("BOOTSTRAP_SERVER_CONFIG");

        if(System.getenv("NUMBER_OF_PARTITIONS") != null)
            numberOfPartitions = Integer.parseInt(System.getenv("NUMBER_OF_PARTITIONS"));
        if(System.getenv("REPLICATION_FACTOR") != null)
            replicationFactor = Short.parseShort(System.getenv("REPLICATION_FACTOR"));

        telemetryRawInput = System.getenv("TELEMETRY_RAW_INPUT");
        telemetryValidatedMessages = System.getenv("TELEMETRY_VALIDATED_MESSAGES");
        telemetryDedupedMessages = System.getenv("TELEMETRY_DEDUPED_MESSAGES");
        telemetryUnbundledMessages = System.getenv("TELEMETRY_UNBUNDLED_MESSAGES");
        telemetryEnrichedMessages = System.getenv("TELEMETRY_ENRICHED_MESSAGES");
        telemetrySecorFinalMessages = System.getenv("TELEMETRY_SECOR_FINAL_MESSAGES");
        telemetryElasticsearchFinalMessages = System.getenv("TELEMETRY_ELASTICSEARCH_FINAL_MESSAGES");

        streamNameTelemetryValidator = System.getenv("STREAM_NAME_TELEMETRY_VALIDATOR");
        streamNameTelemetryDeduplicator = System.getenv("STREAM_NAME_TELEMETRY_DEDUPLICATOR");
        streamNameTelemetryUnbundling = System.getenv("STREAM_NAME_TELEMETRY_UNBUNDLING");
        streamNameTelemetryEnrichment = System.getenv("STREAM_NAME_TELEMETRY_ENRICHMENT");
        streamNameTelemetrySecorFinalPush = System.getenv("STREAM_NAME_TELEMETRY_SECOR_FINAL_PUSH");
        streamNameTelemetryElasticsearchFinalPush = System.getenv("STREAM_NAME_TELEMETRY_ELASTICSEARCH_FINAL_PUSH");

        if(System.getenv("DEDUP_STORAGE_TIME") != null)
            deDupStorageTime = Integer.parseInt(System.getenv("DEDUP_STORAGE_TIME"));

        Properties properties = new Properties();
        InputStream inputStream = null;
        try {
            inputStream = getClass().getClassLoader().getResourceAsStream("application.properties");
            properties.load(inputStream);
        } catch (IOException e) {
            log.error("application.properties not found");
        } finally {
            IOUtils.closeQuietly(inputStream);
        }

        if(kafkaBootstrapServerConfig == null)
          kafkaBootstrapServerConfig = properties.getProperty("BOOTSTRAP_SERVER_CONFIG");

        if(numberOfPartitions == null)
            if(properties.getProperty("NUMBER_OF_PARTITIONS") != null)
                numberOfPartitions = Integer.parseInt(properties.getProperty("NUMBER_OF_PARTITIONS"));

        if(replicationFactor == null)
            if(properties.getProperty("REPLICATION_FACTOR") != null)
                replicationFactor = Short.parseShort(properties.getProperty("REPLICATION_FACTOR"));

        if(telemetryRawInput == null)
            telemetryRawInput = properties.getProperty("TELEMETRY_RAW_INPUT");

        if(telemetryValidatedMessages == null)
            telemetryValidatedMessages = properties.getProperty("TELEMETRY_VALIDATED_MESSAGES");

        if(telemetryDedupedMessages == null)
            telemetryDedupedMessages = properties.getProperty("TELEMETRY_DEDUPED_MESSAGES");

        if(telemetryUnbundledMessages == null)
            telemetryUnbundledMessages = properties.getProperty("TELEMETRY_UNBUNDLED_MESSAGES");

        if(telemetryEnrichedMessages == null)
            telemetryEnrichedMessages = properties.getProperty("TELEMETRY_ENRICHED_MESSAGES");

        if(telemetrySecorFinalMessages == null)
            telemetrySecorFinalMessages = properties.getProperty("TELEMETRY_SECOR_FINAL_MESSAGES");

        if(telemetryElasticsearchFinalMessages == null)
            telemetryElasticsearchFinalMessages = properties.getProperty("TELEMETRY_ELASTICSEARCH_FINAL_MESSAGES");


        if(streamNameTelemetryValidator == null)
            streamNameTelemetryValidator = properties.getProperty("STREAM_NAME_TELEMETRY_VALIDATOR");

        if(streamNameTelemetryDeduplicator == null)
            streamNameTelemetryDeduplicator = properties.getProperty("STREAM_NAME_TELEMETRY_DEDUPLICATOR");

        if(streamNameTelemetryUnbundling == null)
            streamNameTelemetryUnbundling = properties.getProperty("STREAM_NAME_TELEMETRY_UNBUNDLING");

        if(streamNameTelemetryEnrichment == null)
            streamNameTelemetryEnrichment = properties.getProperty("STREAM_NAME_TELEMETRY_ENRICHMENT");

        if(streamNameTelemetrySecorFinalPush == null)
            streamNameTelemetrySecorFinalPush = properties.getProperty("STREAM_NAME_TELEMETRY_SECOR_FINAL_PUSH");

        if(streamNameTelemetryElasticsearchFinalPush == null)
            streamNameTelemetryElasticsearchFinalPush = properties.getProperty("STREAM_NAME_TELEMETRY_ELASTICSEARCH_FINAL_PUSH");


        if(deDupStorageTime == null)
            if(properties.getProperty("DEDUP_STORAGE_TIME") != null)
                deDupStorageTime = Integer.parseInt(properties.getProperty("DEDUP_STORAGE_TIME"));

    }

}