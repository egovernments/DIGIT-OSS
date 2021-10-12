package org.egov.swservice.consumer;

import java.util.HashMap;

import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.service.DiffService;
import org.egov.swservice.service.SewerageServiceImpl;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.swservice.util.SWConstants.TENANTID_MDC_STRING;

@Slf4j
@Service
public class EditWorkflowNotificationConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SewerageServiceImpl sewarageServiceImpl;

	@Autowired
	private DiffService diffService;

	/**
	 * Consumes the sewerage connection record and send the edit notification
	 * 
	 * @param record - Received record from Kafka
	 * @param topic - Received Topic Name
	 */
	@KafkaListener(topicPattern = "${sw.kafka.consumer.topic.pattern}")
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			SewerageConnectionRequest sewerageConnectionRequest = mapper.convertValue(record,
					SewerageConnectionRequest.class);
			String tenantId = sewerageConnectionRequest.getSewerageConnection().getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);
			SewerageConnection searchResult = sewarageServiceImpl.getConnectionForUpdateRequest(
					sewerageConnectionRequest.getSewerageConnection().getTenantId(),sewerageConnectionRequest.getSewerageConnection().getId(),
					sewerageConnectionRequest.getRequestInfo());
			diffService.checkDifferenceAndSendEditNotification(sewerageConnectionRequest, searchResult);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}

}
