package org.egov.wscalculation.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.util.NotificationUtil;
import org.egov.wscalculation.web.models.Category;
import org.egov.wscalculation.web.models.DemandNotificationObj;
import org.egov.wscalculation.web.models.EmailRequest;
import org.egov.wscalculation.web.models.NotificationReceiver;
import org.egov.wscalculation.web.models.SMSRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.minidev.json.JSONArray;

@Service
public class DemandNotificationService {

	@Autowired
	private NotificationUtil util;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private MasterDataService masterDataService;

	@Autowired
	private WSCalculationConfiguration config;

	public void process(DemandNotificationObj notificationObj, String topic) {
		if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
			List<SMSRequest> smsRequests = new LinkedList<>();
			enrichSMSRequest(notificationObj, smsRequests, topic);
			if (!CollectionUtils.isEmpty(smsRequests))
				util.sendSMS(smsRequests);
		}
		if (config.getIsEmailEnabled() != null && config.getIsEmailEnabled()) {
			List<EmailRequest> emailRequests = new LinkedList<>();
			enrichEmailRequest(notificationObj, emailRequests, topic);
		}
	}

	@SuppressWarnings("unused")
	private void enrichSMSRequest(DemandNotificationObj notificationObj, List<SMSRequest> smsRequest, String topic) {
		String tenantId = notificationObj.getTenantId();
		String localizationMessage = util.getLocalizationMessages(tenantId, notificationObj.getRequestInfo());
		String messageTemplate = util.getCustomizedMsgForSMS(topic, localizationMessage);
		List<NotificationReceiver> receiverList = new ArrayList<>();
		enrichNotificationReceivers(receiverList, notificationObj);
		receiverList.forEach(receiver -> {
			String message = util.getAppliedMsg(receiver, messageTemplate, notificationObj);
			SMSRequest sms = SMSRequest.builder().mobileNumber(receiver.getMobileNumber()).message(message).category(Category.TRANSACTION).build();
			smsRequest.add(sms);
		});
	}
	
	@SuppressWarnings("unused")
	private void enrichNotificationReceivers(List<NotificationReceiver> receiverList,
			DemandNotificationObj notificationObj) {
		try {
			JSONArray receiver = masterDataService.getMasterListOfReceiver(notificationObj.getRequestInfo(),
					notificationObj.getTenantId());
			receiverList.addAll(mapper.readValue(receiver.toJSONString(),
					mapper.getTypeFactory().constructCollectionType(List.class, NotificationReceiver.class)));
		} catch (IOException e) {
			throw new CustomException("PARSING_ERROR", " Notification Receiver List Can Not Be Parsed!!");
		}
	}
	
	@SuppressWarnings("unused")
	private void enrichEmailRequest(DemandNotificationObj notificationObj, List<EmailRequest> emailRequest, String topic) {
		// Commenting out this method - As of now, egov-notification-mail service also reads from SMS Kafka Topic to
		// send out the email notification - Will remove the implementation if this change is permanent.

//		String tenantId = notificationObj.getTenantId();
//		String localizationMessage = util.getLocalizationMessages(tenantId, notificationObj.getRequestInfo());
//		String emailBody = util.getCustomizedMsg(topic, localizationMessage);
//		List<NotificationReceiver> receiverList = new ArrayList<>();
//		enrichNotificationReceivers(receiverList, notificationObj);
//		receiverList.forEach(receiver -> {
//			String message = util.getAppliedMsg(receiver, messageTemplate, notificationObj);
//			SMSRequest sms = new SMSRequest(receiver.getMobileNumber(), message);
//			smsRequest.add(sms);
//		});
	}

}
