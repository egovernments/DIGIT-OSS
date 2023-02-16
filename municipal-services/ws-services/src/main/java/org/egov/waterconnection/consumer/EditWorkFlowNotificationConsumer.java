package org.egov.waterconnection.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.waterconnection.service.DiffService;
import org.egov.waterconnection.service.WaterServiceImpl;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.OwnerInfo;
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

import static org.egov.waterconnection.constants.WCConstants.*;

@Slf4j
@Service
public class EditWorkFlowNotificationConsumer {
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private WaterServiceImpl waterServiceImpl;
	
	@Autowired
	private DiffService diffService;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

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
			WaterConnection waterConnection = waterConnectionRequest.getWaterConnection();
			SearchCriteria criteria = SearchCriteria.builder().applicationNumber(Collections.singleton(waterConnection.getApplicationNo()))
					.tenantId(waterConnectionRequest.getWaterConnection().getTenantId()).isInternalCall(Boolean.TRUE).build();
			List<WaterConnection> waterConnections = waterServiceImpl.search(criteria,
					waterConnectionRequest.getRequestInfo());
			WaterConnection searchResult = waterConnections.get(0);

			if (!waterConnectionRequest.isOldDataEncryptionRequest())
				diffService.checkDifferenceAndSendEditNotification(waterConnectionRequest);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}

}
