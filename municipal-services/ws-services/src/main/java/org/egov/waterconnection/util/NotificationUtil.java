package org.egov.waterconnection.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.web.models.EventRequest;
import org.egov.waterconnection.web.models.SMSRequest;
import org.egov.waterconnection.producer.WaterConnectionProducer;
import org.egov.waterconnection.repository.ServiceRequestRepository;
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
	private WSConfiguration config;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private WaterConnectionProducer producer;
	
	
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

		String locale = WCConstants.NOTIFICATION_LOCALE;
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];
		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(WCConstants.MODULE);

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
	public String getMessageTemplate(String notificationCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", notificationCode);
		String message = null;
		try {
			ArrayList<String> messageObj = (ArrayList<String>) JsonPath.parse(localizationMessage).read(path);
			if(messageObj != null && messageObj.size() > 0) {
				message = messageObj.get(0);
			}
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}
	
	
	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * @param smsRequestList The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(smsRequestList)) {
				log.info("Messages from localization couldn't be fetched!");
				return;
			}
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.info("Messages: " + smsRequest.getMessage());
			}
		}
	}
	
	/**
	 * 
	 * @param applicationStatus
	 * @param localizationMessage
	 * @return message template
	 */
	public String getCustomizedMsgForSMS(String action, String applicationStatus, String localizationMessage, int reqType) {
		StringBuilder builder = new StringBuilder();
		if(reqType == WCConstants.UPDATE_APPLICATION){
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");
		}
		if(reqType == WCConstants.MODIFY_CONNECTION){
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");
		}
		return getMessageTemplate(builder.toString(), localizationMessage);
	}

	/**
	 * 
	 * @param applicationStatus
	 * @param localizationMessage
	 * @return In app message template
	 */
	public String getCustomizedMsgForInApp(String action, String applicationStatus, String localizationMessage, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_APP_MESSAGE");
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_APP_MESSAGE");
		}
		return getMessageTemplate(builder.toString(), localizationMessage);
	}
	
	/**
	 * 
	 * @param code Code name to fetch the localisation value
	 * @param localizationMessage Localisation message
	 * @return In app message template
	 */
	public String getCustomizedMsg(String code, String localizationMessage) {
		return getMessageTemplate(code, localizationMessage);
	}
	
	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request EventRequest Object
	 */
	public void sendEventNotification(EventRequest request) {
		log.info("Event: " + request.toString());
		producer.push(config.getSaveUserEventsTopic(), request);
	}
	

}
