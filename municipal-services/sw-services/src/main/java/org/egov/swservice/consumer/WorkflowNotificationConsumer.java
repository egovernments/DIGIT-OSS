package org.egov.swservice.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.swservice.service.SewerageService;
import org.egov.swservice.service.WorkflowNotificationService;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.web.models.OwnerInfo;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import static org.egov.swservice.util.SWConstants.WNS_OWNER_DECRYPTION_MODEL;

@Service
@Slf4j
public class WorkflowNotificationConsumer {

	@Autowired
	WorkflowNotificationService workflowNotificationService;

	@Autowired
	private SewerageService sewerageService;

	@Autowired
	private EncryptionDecryptionUtil encryptionDecryptionUtil;
	@Autowired
	private ObjectMapper mapper;

	/**
	 * Consumes the sewerage connection record and send notification
	 * 
	 * @param record - Received record from Kafka Topic
	 *
	 * @param topic - Received Topic Name
	 */

	@KafkaListener(topics = { "${egov.sewarageservice.createconnection.topic}", "${egov.sewarageservice.updateconnection.topic}",
			"${egov.sewerageservice.updatesewerageconnection.workflow.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			SewerageConnectionRequest sewerageConnectionRequest = mapper.convertValue(record,
					SewerageConnectionRequest.class);
			String applicationStatus = sewerageConnectionRequest.getSewerageConnection().getApplicationStatus();
			if (!SWConstants.NOTIFICATION_ENABLE_FOR_STATUS.contains(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()+"_"+applicationStatus)) {
				log.info("Workflow Notification Disabled For State :" + sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()+"_"+applicationStatus);
				return;
			}
			sewerageConnectionRequest.getSewerageConnection().setConnectionHolders(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders(), WNS_OWNER_DECRYPTION_MODEL, OwnerInfo.class, sewerageConnectionRequest.getRequestInfo()));
			workflowNotificationService.process(sewerageConnectionRequest, topic);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic).append(". Exception :").append(ex.getMessage());
			log.error(builder.toString(), ex);
		}
	}

}
