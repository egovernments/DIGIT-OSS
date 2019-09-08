package org.egov.infra.indexer.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.infra.indexer.custom.pgr.PGRCustomDecorator;
import org.egov.infra.indexer.custom.pgr.PGRIndexObject;
import org.egov.infra.indexer.custom.pgr.ServiceResponse;
import org.egov.infra.indexer.service.IndexerService;
import org.egov.infra.indexer.util.IndexerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PGRCustomIndexMessageListener implements MessageListener<String, String> {

	@Autowired
	private IndexerService indexerService;

	@Autowired
	private IndexerUtils indexerUtils;

	@Autowired
	private PGRCustomDecorator pgrCustomDecorator;

	@Override
	/**
	 * Messages listener which acts as consumer. This message listener is injected
	 * inside a kafkaContainer. This consumer is a start point to the following
	 * index jobs: 1. Re-index 2. Legacy Index 3. PGR custom index 4. PT custom
	 * index 5. Core indexing
	 */
	public void onMessage(ConsumerRecord<String, String> data) {
		log.info("Topic: " + data.topic());
		ObjectMapper mapper = indexerUtils.getObjectMapper();
		try {
			ServiceResponse serviceResponse = mapper.readValue(data.value(), ServiceResponse.class);
			PGRIndexObject indexObject = pgrCustomDecorator.dataTransformationForPGR(serviceResponse);
			indexerService.esIndexer(data.topic(), mapper.writeValueAsString(indexObject));
		} catch (Exception e) {
			log.error("Couldn't parse pgrindex request: ", e);
		}
	}

}
