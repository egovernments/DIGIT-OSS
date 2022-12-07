package org.egov.waterconnection.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.waterconnection.service.DiffService;
import org.egov.waterconnection.service.WaterServiceImpl;
import org.egov.waterconnection.web.models.SearchCriteria;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class EditWorkFlowNotificationConsumer {
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private WaterServiceImpl waterServiceImpl;
	
	@Autowired
	private DiffService diffService;
	
	
	/**
	 * Consumes the water connection record and send the edit notification
	 * 
	 * @param record Received Topic Record
	 * @param topic Name of the Topic
	 */
	@KafkaListener(topics = { "${ws.editnotification.topic}"})
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			WaterConnectionRequest waterConnectionRequest = mapper.convertValue(record, WaterConnectionRequest.class);
			SearchCriteria criteria = SearchCriteria.builder().applicationNumber(Collections.singleton(waterConnectionRequest.getWaterConnection().getApplicationNo()))
					.tenantId(waterConnectionRequest.getWaterConnection().getTenantId()).build();
			List<WaterConnection> waterConnections = waterServiceImpl.search(criteria,
					waterConnectionRequest.getRequestInfo());
			WaterConnection searchResult = waterConnections.get(0);
			if (!waterConnectionRequest.isOldDataEncryptionRequest())
				diffService.checkDifferenceAndSendEditNotification(waterConnectionRequest, searchResult);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}

}
