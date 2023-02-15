package org.egov.swcalculation.consumer;

import java.util.HashMap;

import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.web.models.DemandNotificationObj;
import org.egov.swcalculation.service.SewerageDemandNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DemandNotificationConsumer {

	private SewerageDemandNotificationService notificationService;

	@Autowired
	SWCalculationConfiguration sWCalculationConfiguration;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	public DemandNotificationConsumer(SewerageDemandNotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@KafkaListener(topics = { "${sw.calculator.demand.successful.topic}", "${sw.calculator.demand.failed.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			DemandNotificationObj demandNotificationObj = mapper.convertValue(record, DemandNotificationObj.class);
			String tenantId= demandNotificationObj.getTenantId();
			if (sWCalculationConfiguration.getIsLocalizationStateLevel())
				tenantId = tenantId.split("\\.")[0];
			demandNotificationObj.setTenantId(tenantId);

//			notificationService.process(demandNotificationObj, topic);
		} catch (final Exception e) {
			StringBuilder builder = new StringBuilder();
			builder.append("Error while listening to value: ").append(record).append(" on topic: ").append(topic)
					.append(": ").append(e);
			log.error("KAFKA_ERROR: ", builder.toString());
		}
	}

}
