package com.ingestpipeline.service;

import com.ingestpipeline.model.TopicContextConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ingestpipeline.model.ErrorWrapper;
import com.ingestpipeline.model.IncomingData;
import com.ingestpipeline.model.TopicContext;
import com.ingestpipeline.producer.IngestProducer;
import com.ingestpipeline.util.ApplicationProperties;
import com.ingestpipeline.util.ConfigLoader;
import com.ingestpipeline.util.Constants;

import java.util.HashMap;
import java.util.Map;

/**
 * This is a Service Implementation for all the actions which are with respect to Elastic Search 
 * @author Darshan Nagesh
 *
 */
@Service(Constants.Qualifiers.INGEST_SERVICE)
public class IngestServiceImpl implements IngestService {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(IngestServiceImpl.class);
	public static final String INTENT = "INGEST"; 

	@Autowired
	private IngestProducer ingestProducer;
	
	@Autowired
	private ApplicationProperties applicationProperties; 
	
	@Autowired
	private ConfigLoader configLoader; 
	
	@Autowired
	private DigressService digressService;

	@Autowired
	private ObjectMapper mapper;

	private Map<String, TopicContext> topicContextMap = new HashMap<>();
	public void loadTopicsConfig(){
		TopicContextConfig topicContextConf = null;
		try {
			topicContextConf = mapper.readValue(configLoader.get(TOPIC_CONTEXT_CONFIG), TopicContextConfig.class);
			for (TopicContext topicCxt : topicContextConf.getTopicContexts()){

				topicContextMap.put(topicCxt.getTopic(), topicCxt);
			}
			LOGGER.info("topicContexts ## "+topicContextMap);

		} catch (Exception e) {
			LOGGER.error("Encountered an error while reading Topic to Context Configuration" + e.getMessage());
		}
	}
	
	@Override
	public Boolean ingestToPipeline(Object incomingData) {
		LOGGER.info("Fetching the Incoming Data Config for the data received");
		String topic = "";
		String key = "";
		try { 
			if (applicationProperties.getPipelineRules().get(Constants.PipelineRules.VALIDATE_DATA)) {
				topic = applicationProperties.getTransactionIngestTopic();
				key = applicationProperties.getTransactionIngestKey();
			} else if (applicationProperties.getPipelineRules().get(Constants.PipelineRules.TRANSFORM_DATA)) {
				topic = applicationProperties.getTransactionValidationTopic();
				key = applicationProperties.getTransactionValidationKey();
			} else if (applicationProperties.getPipelineRules().get(Constants.PipelineRules.ENRICH_DATA)) {
				topic = applicationProperties.getTransactionTransformationTopic();
				key = applicationProperties.getTransactionTransformationKey();
			}
		} catch (Exception e) { 
			LOGGER.error("Encountered an Exception while Pushing the Data to pipeline on Ingest Service " + e.getMessage());
			ErrorWrapper errorWrapper = errorHandover(incomingData); 
			ingestProducer.pushToPipeline(errorWrapper, Constants.KafkaTopics.ERROR_INTENT, null);
		}
		ingestProducer.pushToPipeline(incomingData, topic, null);
		return true;
	}
	
	private ErrorWrapper errorHandover(Object incomingData) { 
		ErrorWrapper errorWrapper = new ErrorWrapper(); 
		errorWrapper.setErrorCode(INTENT);
		errorWrapper.setErrorMessage(Constants.ErrorMessages.errorCodeMessageMap.get(INTENT));
		errorWrapper.setIncomingData(incomingData);
		return errorWrapper; 
	}

	@Override
	public IncomingData getContextForIncomingTopic(String topicName) {
		ObjectMapper mapper = new ObjectMapper();
		TopicContext topicContext = null;
		IncomingData incomingData = null; 
/*      try {
        	topicContext = mapper.readValue(configLoader.get(TOPIC_CONTEXT_CONFIG), TopicContext.class);
		} catch (Exception e) {
			LOGGER.error("Encountered an error while reading Topic to Context Configuration" + e.getMessage());
		}*/
        if(topicContextMap.size()>0 ) {
        	incomingData = new IncomingData();
        	TopicContext topicCxt = topicContextMap.get(topicName);
        	incomingData.setDataContext(topicCxt.getDataContext());
			incomingData.setDataContextVersion(topicCxt.getDataContextVersion());
			LOGGER.info("###Context Set##");
        }
		return incomingData;
	}
}
