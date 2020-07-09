package org.egov.waterconnection.consumer;

import java.util.HashMap;

import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.service.PdfFileStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileStoreIdsConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private PdfFileStoreService pdfService;

	/**
	 * Water connection object
	 * 
	 * @param record Received Topic Record in HashMap format
	 * @param topic Name of the Topic
	 */
	@KafkaListener(topics = { "${ws.consume.filestoreids.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			WaterConnectionRequest waterConnectionRequest = mapper.convertValue(record, WaterConnectionRequest.class);
			pdfService.process(waterConnectionRequest, topic);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}
}
