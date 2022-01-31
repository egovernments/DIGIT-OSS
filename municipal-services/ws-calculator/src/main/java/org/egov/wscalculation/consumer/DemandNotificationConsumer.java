package org.egov.wscalculation.consumer;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;

import org.egov.wscalculation.web.models.DemandNotificationObj;
import org.egov.wscalculation.service.DemandNotificationService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.egov.wscalculation.constants.WSCalculationConstant.TENANTID_MDC_STRING;

@Service
@Slf4j
public class DemandNotificationConsumer {

	@Autowired
	private DemandNotificationService notificationService;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * 
	 * @param request Topic Message
	 * @param topic - Topic Name
	 */
	@KafkaListener(topics = { "${ws.calculator.demand.successful.topic}", "${ws.calculator.demand.failed}" })
	public void listen(final HashMap<String, Object> request, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		DemandNotificationObj notificationObj;
		try {
			notificationObj = mapper.convertValue(request, DemandNotificationObj.class);
			String tenantId = notificationObj.getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);
			notificationService.process(notificationObj, topic);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + request + " on topic: " + topic + ": " + e);
		}
	}
}
