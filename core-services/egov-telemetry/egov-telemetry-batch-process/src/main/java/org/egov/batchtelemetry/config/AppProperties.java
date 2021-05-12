package org.egov.batchtelemetry.config;


import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

@Getter
@Slf4j
public class AppProperties {

    private Long sessionTimeout;

    private String kafkaBootstrapServer;
    private String outputKafkaTopic;

    private String esURL;
    private String esHost;
    private String esPort;
    private String esNodesWANOnly;
    private String timezone;

    private String inputTelemetryIndex;
    private String outputTelemetrySessionsIndex;



    public AppProperties() {

        if(System.getenv("SESSION_TIMEOUT") != null)
            sessionTimeout = TimeUnit.MINUTES.toMillis(Long.valueOf(System.getenv("SESSION_TIMEOUT")));

        kafkaBootstrapServer = System.getenv("KAFKA_BOOTSTRAP_SERVER_CONFIG");
        outputKafkaTopic = System.getenv("KAFKA_OUTPUT_TOPIC");

        esURL = System.getenv("ES_URL");
        esHost = System.getenv("ES_HOST");
        esPort = System.getenv("ES_PORT");
        esNodesWANOnly = System.getenv("ES_NODE_WAN_ONLY");
        timezone = System.getenv("ID_TIMEZONE");

        inputTelemetryIndex = System.getenv("ES_INPUT_TELEMETRY_INDEX");
        outputTelemetrySessionsIndex = System.getenv("ES_OUTPUT_TELEMETRY_BATCH_INDEX");

        Properties properties = new Properties();
        InputStream inputStream = null;
        try {
            inputStream = getClass().getClassLoader().getResourceAsStream("application.properties");
            properties.load(inputStream);
        } catch (IOException e) {
            log.error("Error reading application.properties");
        } finally {
            IOUtils.closeQuietly(inputStream);
        }

        if(sessionTimeout == null)
            sessionTimeout = TimeUnit.MINUTES.toMillis(Long.valueOf(properties.getProperty("SESSION_TIMEOUT")));

        if(kafkaBootstrapServer == null)
            kafkaBootstrapServer = properties.getProperty("KAFKA_BOOTSTRAP_SERVER_CONFIG");
        if(outputKafkaTopic == null)
            outputKafkaTopic = properties.getProperty("KAFKA_OUTPUT_TOPIC");

        if(esURL == null)
            esURL = properties.getProperty("ES_URL");
        if(esHost == null)
            esHost = properties.getProperty("ES_HOST");
        if(esPort == null)
            esPort = properties.getProperty("ES_PORT");
        if(esNodesWANOnly == null)
            esNodesWANOnly = properties.getProperty("ES_NODE_WAN_ONLY");

        if(inputTelemetryIndex == null)
            inputTelemetryIndex = properties.getProperty("ES_INPUT_TELEMETRY_INDEX");
        if(outputTelemetrySessionsIndex == null)
            outputTelemetrySessionsIndex = properties.getProperty("ES_OUTPUT_TELEMETRY_BATCH_INDEX");

        if(timezone == null)
            timezone = properties.getProperty("ID_TIMEZONE");

    }

}
