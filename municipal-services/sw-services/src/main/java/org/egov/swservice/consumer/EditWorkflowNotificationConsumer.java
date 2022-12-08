package org.egov.swservice.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.swservice.service.DiffService;
import org.egov.swservice.service.SewerageService;
import org.egov.swservice.service.SewerageServiceImpl;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.web.models.OwnerInfo;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.egov.swservice.util.SWConstants.*;

@Slf4j
@Service
public class EditWorkflowNotificationConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SewerageServiceImpl sewarageServiceImpl;

	@Autowired
	private DiffService diffService;

	@Autowired
	private SewerageService sewerageService;

	@Autowired
	private EncryptionDecryptionUtil encryptionDecryptionUtil;

	/**
	 * Consumes the sewerage connection record and send the edit notification
	 * 
	 * @param record - Received record from Kafka
	 * @param topic - Received Topic Name
	 */
	@KafkaListener(topics = { "${sw.editnotification.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			SewerageConnectionRequest sewerageConnectionRequest = mapper.convertValue(record,
					SewerageConnectionRequest.class);
			SewerageConnection sewerageConnection = sewerageConnectionRequest.getSewerageConnection();
			SearchCriteria criteria = SearchCriteria.builder().applicationNumber(Collections.singleton(sewerageConnection.getApplicationNo()))
					.tenantId(sewerageConnection.getTenantId()).isInternalCall(Boolean.TRUE).build();
			List<SewerageConnection> sewerageConnections = sewerageService.search(criteria,
					sewerageConnectionRequest.getRequestInfo());
			SewerageConnection searchResult = sewerageConnections.get(0);

			if (!sewerageConnectionRequest.isOldDataEncryptionRequest())
				diffService.checkDifferenceAndSendEditNotification(sewerageConnectionRequest, searchResult);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic);
			log.error(builder.toString(), ex);
		}
	}

}
