package org.egov.wscalculation.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.web.models.DemandNotificationObj;
import org.egov.wscalculation.web.models.EmailRequest;
import org.egov.wscalculation.web.models.EventRequest;
import org.egov.wscalculation.web.models.NotificationReceiver;
import org.egov.wscalculation.web.models.SMSRequest;
import org.egov.wscalculation.producer.WSCalculationProducer;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class NotificationUtil {

	@Autowired
	private WSCalculationConfiguration config;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private WSCalculationProducer producer;

	/**
	 * Returns the uri for the localization call
	 * 
	 * @param tenantId
	 *            TenantId demand Notification Obj
	 * @return The uri for localization search call
	 */
	public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

		if (config.getIsLocalizationStateLevel())
			tenantId = tenantId.split("\\.")[0];

		String locale = WSCalculationConstant.NOTIFICATION_LOCALE;
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(WSCalculationConstant.MODULE);

		return uri;
	}
	
	/**
	 * Fetches messages from localization service
	 * 
	 * @param tenantId
	 *            tenantId of the tradeLicense
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return Localization messages for the module
	 */
	public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
		@SuppressWarnings("rawtypes")
	
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
				requestInfo);
		return new JSONObject(responseMap).toString();
	}
	
	/**
	 * Extracts message for the specific code
	 * 
	 * @param notificationCode The code for which message is required
	 * @param localizationMessage The localization messages
	 * @return message for the specific code
	 */
	private String getMessageTemplate(String notificationCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", notificationCode);
		String message = null;
		try {
			Object messageObj = JsonPath.parse(localizationMessage).read(path);
			message = ((ArrayList<String>) messageObj).get(0);
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}
	
	public String getCustomizedMsgForSMS(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandsSaved())) {
			messageString = getMessageTemplate(WSCalculationConstant.DEMAND_SUCCESS_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandsFailure())) {
			messageString = getMessageTemplate(WSCalculationConstant.DEMAND_FAILURE_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(WSCalculationConstant.WATER_CONNECTION_BILL_GENERATION_SMS_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}
	
	public String getCustomizedMsgForInApp(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(WSCalculationConstant.WATER_CONNECTION_BILL_GENERATION_APP_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}
	
	/**
	 * 
	 * @param receiver - Notification Receiver
	 * @param message, - Notification Message
	 * @param obj - Notification Demand Details
	 * @return - Returns the proper message
	 */
	public String getAppliedMsg(NotificationReceiver receiver, String message, DemandNotificationObj obj) {
		message = message.replace("<First Name>", receiver.getFirstName() == null ? "" : receiver.getFirstName());
		message = message.replace("<Last Name>", receiver.getLastName() == null ? "" : receiver.getLastName());
		message = message.replace("<service name>", receiver.getServiceName() == null ? "" : receiver.getServiceName());
		message = message.replace("<ULB Name>", receiver.getUlbName() == null ? "" : receiver.getUlbName());
		message = message.replace("<billing cycle>", obj.getBillingCycle() == null ? "" : obj.getBillingCycle());
		return message;
	}
	
	
	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * @param smsRequestList The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(smsRequestList))
				 log.info("Messages from localization couldn't be fetched!");
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.debug(" Messages: " + smsRequest.getMessage());
			}
		}
	}
	/**
	 * Send the SMSRequest on the EmailNotification kafka topic
	 * @param emailRequestList The list of EmailRequest to be sent
	 */
	public void sendEmail(List<EmailRequest> emailRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(emailRequestList))
				log.info("Messages from localization couldn't be fetched!");
			emailRequestList.forEach(emailRequest -> {
				producer.push(config.getEmailNotifyTopic(), emailRequest);
				log.info("Email To : " + emailRequest.getEmail() + " Body: " + emailRequest.getBody()+" Subject: "+ emailRequest.getSubject());
			});
		}
	}
	
	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request Event Request Object
	 */
	public void sendEventNotification(EventRequest request) {
		producer.push(config.getSaveUserEventsTopic(), request);
	}
}
