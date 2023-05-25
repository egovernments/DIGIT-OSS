package com.ingestpipeline.util;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource(value = { "classpath:config/config.properties" }, ignoreResourceNotFound = true)
@Order(0)
public class ApplicationProperties {

    @Value("${kafka.transaction.ingest.topic}")
    private String transactionIngestTopic;

    @Value("${kafka.transaction.ingest.key}")
    private String transactionIngestKey;
    
    @Value("${kafka.transaction.validation.topic}")
    private String transactionValidationTopic;

    @Value("${kafka.transaction.validation.key}")
    private String transactionValidationKey;

    @Value("${kafka.transaction.transformation.topic}")
    private String transactionTransformationTopic;
    
    @Value("${kafka.transaction.transformation.key}")
    private String transactionTransformationKey;
    
    @Value("${kafka.transaction.enrichment.topic}")
    private String transactionEnrichmentTopic;
    
    @Value("${kafka.transaction.enrichment.key}")
    private String transactionEnrichmentKey;
    
    @Value("${schema.transaction.validation}")
    private String transactionValidationSchema;
    
    @Value("${schema.transaction.transformation}")
    private String transactionTransformSchema;
    
    @Value("${schema.transaction.enrichment}")
    private String transactionEnrichmentSchema;
    
    @Value("${transformation.config.location}")
	private static String transformationConfigLocations;
    
    @Value("#{${pipelinerules}}") 
    private Map<String, Boolean> pipelineRules;
    
    @Autowired
    private Environment environment;
    
    public static String getTransformationConfigLocations() {
		return transformationConfigLocations;
	}

	public static void setTransformationConfigLocations(String transformationConfigLocations) {
		ApplicationProperties.transformationConfigLocations = transformationConfigLocations;
	}
    
	public String getTransactionValidationSchema() {
		return transactionValidationSchema;
	}

	public void setTransactionValidationSchema(String transactionValidationSchema) {
		this.transactionValidationSchema = transactionValidationSchema;
	}

	public String getTransactionTransformSchema() {
		return transactionTransformSchema;
	}

	public void setTransactionTransformSchema(String transactionTransformSchema) {
		this.transactionTransformSchema = transactionTransformSchema;
	}

	public String getTransactionEnrichmentSchema() {
		return transactionEnrichmentSchema;
	}

	public void setTransactionEnrichmentSchema(String transactionEnrichmentSchema) {
		this.transactionEnrichmentSchema = transactionEnrichmentSchema;
	}

	public Map<String, Boolean> getPipelineRules() {
		return pipelineRules;
	}

	public void setPipelineRules(Map<String, Boolean> pipelineRules) {
		this.pipelineRules = pipelineRules;
	}

	public String getTransactionIngestTopic() {
		return transactionIngestTopic;
	}

	public void setTransactionIngestTopic(String transactionIngestTopic) {
		this.transactionIngestTopic = transactionIngestTopic;
	}

	public String getTransactionIngestKey() {
		return transactionIngestKey;
	}

	public void setTransactionIngestKey(String transactionIngestKey) {
		this.transactionIngestKey = transactionIngestKey;
	}

	public String getTransactionValidationTopic() {
		return transactionValidationTopic;
	}

	public void setTransactionValidationTopic(String transactionValidationTopic) {
		this.transactionValidationTopic = transactionValidationTopic;
	}

	public String getTransactionValidationKey() {
		return transactionValidationKey;
	}

	public void setTransactionValidationKey(String transactionValidationKey) {
		this.transactionValidationKey = transactionValidationKey;
	}

	public String getTransactionTransformationTopic() {
		return transactionTransformationTopic;
	}

	public void setTransactionTransformationTopic(String transactionTransformationTopic) {
		this.transactionTransformationTopic = transactionTransformationTopic;
	}

	public String getTransactionTransformationKey() {
		return transactionTransformationKey;
	}

	public void setTransactionTransformationKey(String transactionTransformationKey) {
		this.transactionTransformationKey = transactionTransformationKey;
	}

	public String getTransactionEnrichmentTopic() {
		return transactionEnrichmentTopic;
	}

	public void setTransactionEnrichmentTopic(String transactionEnrichmentTopic) {
		this.transactionEnrichmentTopic = transactionEnrichmentTopic;
	}

	public String getTransactionEnrichmentKey() {
		return transactionEnrichmentKey;
	}

	public void setTransactionEnrichmentKey(String transactionEnrichmentKey) {
		this.transactionEnrichmentKey = transactionEnrichmentKey;
	}
}
