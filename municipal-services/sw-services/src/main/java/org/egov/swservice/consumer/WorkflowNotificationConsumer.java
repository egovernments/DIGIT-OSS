package org.egov.swservice.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.swservice.service.SewerageService;
import org.egov.swservice.service.WorkflowNotificationService;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.web.models.OwnerInfo;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import static org.egov.swservice.util.SWConstants.*;

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
			SewerageConnection sewerageConnection = sewerageConnectionRequest.getSewerageConnection();
			String applicationStatus = sewerageConnection.getApplicationStatus();
			if (!SWConstants.NOTIFICATION_ENABLE_FOR_STATUS.contains(sewerageConnection.getProcessInstance().getAction()+"_"+applicationStatus)) {
				log.info("Workflow Notification Disabled For State :" + sewerageConnection.getProcessInstance().getAction()+"_"+applicationStatus);
				return;
			}
			List<Role> roles = sewerageConnectionRequest.getRequestInfo().getUserInfo().getRoles();
			boolean isCitizenRole = false;
			for(Role role : roles){
				if(role.getCode().equals(CITIZEN_ROLE_CODE)) {
					isCitizenRole = true;
				}
			}
			if(!isCitizenRole) {
				sewerageConnection.setConnectionHolders(encryptionDecryptionUtil.decryptObject(sewerageConnection.getConnectionHolders(),
						WNS_OWNER_PLAIN_DECRYPTION_MODEL, OwnerInfo.class, sewerageConnectionRequest.getRequestInfo()));
				sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnection,
						WNS_PLUMBER_PLAIN_DECRYPTION_MODEL, SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));
			}
			if (!sewerageConnectionRequest.isOldDataEncryptionRequest())
				workflowNotificationService.process(sewerageConnectionRequest, topic);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic).append(". Exception :").append(ex.getMessage());
			log.error(builder.toString(), ex);
		}
	}

}
