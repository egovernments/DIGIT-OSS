package com.ingestpipeline.service;

import org.springframework.stereotype.Service;

import com.ingestpipeline.model.IncomingData;

@Service
public interface IngestService {
	
	static final String TOPIC_CONTEXT_CONFIG = "TopicContextConfiguration.json"; 
	Boolean ingestToPipeline(Object incomingData);
	IncomingData getContextForIncomingTopic(String topicName) ;
	
}
