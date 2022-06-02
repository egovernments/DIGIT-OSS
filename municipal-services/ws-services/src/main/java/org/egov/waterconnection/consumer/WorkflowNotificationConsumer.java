package org.egov.waterconnection.consumer;

import java.util.HashMap;

import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.service.MeterReadingService;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.service.WorkflowNotificationService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import static org.egov.waterconnection.constants.WCConstants.TENANTID_MDC_STRING;

@Service
@Slf4j
public class WorkflowNotificationConsumer {
	
	@Autowired
	WorkflowNotificationService workflowNotificationService;
 
	@Autowired
	private MeterReadingService meterReadingService;
	
	@Autowired
	private ObjectMapper mapper;

	/**
	 * Consumes the water connection record and send notification
	 * 
	 * @param record
	 * @param topic
	 */
	@KafkaListener(topicPattern = "${ws.kafka.consumer.topic.pattern}")
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			WaterConnectionRequest waterConnectionRequest = mapper.convertValue(record, WaterConnectionRequest.class);
			String tenantId = waterConnectionRequest.getWaterConnection().getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);

			if ( topic.contains("create-meter-reading") && !StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionType())
					&& WCConstants.METERED_CONNECTION
					.equalsIgnoreCase(waterConnectionRequest.getWaterConnection().getConnectionType())) {
				log.info("Received request to add Meter Reading on topic - " + topic);
				meterReadingService.process(waterConnectionRequest, topic);
			}
			else
				workflowNotificationService.process(waterConnectionRequest, topic);

		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}

}
