package org.egov.swservice.consumer;

import java.util.HashMap;

import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.service.PdfFileStoreService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.swservice.util.SWConstants.TENANTID_MDC_STRING;

@Service
@Slf4j
public class FileStoreIdsConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private PdfFileStoreService pdfService;

	/**
	 * Sewerage connection object
	 * 
	 * @param record - Received record from Kafka
	 * @param topic - Received Topic Name
	 */
	@KafkaListener(topicPattern = "${sw.kafka.filestore.topic.pattern}")
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			SewerageConnectionRequest sewerageConnectionRequest = mapper.convertValue(record,
					SewerageConnectionRequest.class);
			String tenantId = sewerageConnectionRequest.getSewerageConnection().getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);

			pdfService.process(sewerageConnectionRequest, topic);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}
}