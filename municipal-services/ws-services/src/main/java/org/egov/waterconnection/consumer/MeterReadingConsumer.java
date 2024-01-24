package org.egov.waterconnection.consumer;

import java.util.HashMap;

import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.service.MeterReadingService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.waterconnection.constants.WCConstants.TENANTID_MDC_STRING;

@Service
@Slf4j
public class MeterReadingConsumer {

	@Autowired
	private MeterReadingService meterReadingService;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Water connection object
	 * 
	 * @param record
	 * @param topic
	 */
	@KafkaListener(topicPattern = "${ws.meterreading.create.topic.pattern}")
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			log.info("Received request to add Meter Reading on topic - " + topic);
			WaterConnectionRequest waterConnectionRequest = mapper.convertValue(record, WaterConnectionRequest.class);
			String tenantId = waterConnectionRequest.getWaterConnection().getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);

			if (!StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionType())
					&& WCConstants.METERED_CONNECTION
							.equalsIgnoreCase(waterConnectionRequest.getWaterConnection().getConnectionType())) {
				meterReadingService.process(waterConnectionRequest, topic);
			}
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}
}
