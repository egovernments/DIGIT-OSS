package org.egov.waterconnection.consumer;

import org.egov.waterconnection.service.MeterReadingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.service.WaterService;
import org.egov.waterconnection.service.WaterServiceImpl;
import org.egov.waterconnection.service.WorkflowNotificationService;
import org.slf4j.MDC;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.OwnerInfo;
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

@Service
@Slf4j
public class WorkflowNotificationConsumer {
	
	@Autowired
	WorkflowNotificationService workflowNotificationService;

	@Autowired
	private MeterReadingService meterReadingService;

	@Autowired
	WaterService waterService;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WaterServiceImpl waterServiceImpl;

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

			WaterConnection waterConnection = waterConnectionRequest.getWaterConnection();
			String applicationStatus = waterConnection.getApplicationStatus();
			if (!WCConstants.NOTIFICATION_ENABLE_FOR_STATUS.contains(waterConnection.getProcessInstance().getAction() + "_" + applicationStatus)) {
				log.info("Notification Disabled For State :" + waterConnection.getProcessInstance().getAction() + "_" + applicationStatus);
				return;
			}
			List<Role> roles = waterConnectionRequest.getRequestInfo().getUserInfo().getRoles();
			boolean isCitizenRole = false;
			for(Role role : roles){
				if(role.getCode().equals(CITIZEN_ROLE_CODE)) {
					isCitizenRole = true;
				}
			}
			if(!isCitizenRole) {
				waterConnection.setConnectionHolders(encryptionDecryptionUtil.decryptObject(waterConnection.getConnectionHolders(),
						WNS_OWNER_PLAIN_DECRYPTION_MODEL, OwnerInfo.class, waterConnectionRequest.getRequestInfo()));
				waterConnectionRequest.setWaterConnection(encryptionDecryptionUtil.decryptObject(waterConnection,
						WNS_PLUMBER_PLAIN_DECRYPTION_MODEL, WaterConnection.class, waterConnectionRequest.getRequestInfo()));
			}

			if (!waterConnectionRequest.isOldDataEncryptionRequest())
				workflowNotificationService.process(waterConnectionRequest, topic);
		} catch (Exception ex) {
			StringBuilder builder = new StringBuilder("Error while listening to value: ").append(record)
					.append("on topic: ").append(topic).append(". Exception :").append(ex.getMessage());
			log.error(builder.toString(), ex);
		}
	}

}
