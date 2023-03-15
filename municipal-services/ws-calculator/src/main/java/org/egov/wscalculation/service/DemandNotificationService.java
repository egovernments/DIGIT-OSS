package org.egov.wscalculation.service;

import java.io.IOException;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.util.NotificationUtil;
import org.egov.wscalculation.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.minidev.json.JSONArray;

import static org.egov.wscalculation.constants.WSCalculationConstant.*;

@Slf4j
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
		List<String> configuredChannelNames =  util.fetchChannelList(notificationObj.getRequestInfo(), notificationObj.getTenantId(), SERVICE_FIELD_VALUE_WS, ACTION_FOR_DEMAND);
//		List<String> configuredChannelNames = Arrays.asList(new String[] {"SMS","EMAIL"});
		log.info("channel list ->"+configuredChannelNames.toString());
		if (configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
		if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
			List<SMSRequest> smsRequests = new LinkedList<>();
			enrichSMSRequest(notificationObj, smsRequests, topic);
			if (!CollectionUtils.isEmpty(smsRequests)) {
				log.info("Sms Notification Demand :: -> ");
				util.sendSMS(smsRequests);
			}
		}
		}
			if (configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
				if (config.getIsEmailEnabled() != null && config.getIsEmailEnabled()) {
			List<EmailRequest> emailRequests = new LinkedList<>();
			enrichEmailRequest(notificationObj, emailRequests, topic);
			if (!CollectionUtils.isEmpty(emailRequests)) {
				log.info("Email Notification Demand :: -> ");
				util.sendEmail(emailRequests);
			}
		}}
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
		String tenantId = notificationObj.getTenantId();
		String localizationMessage = util.getLocalizationMessages(tenantId, notificationObj.getRequestInfo());
		String customizedMsg = util.getCustomizedMsgForEmail(topic, localizationMessage);
		List<NotificationReceiver> receiverList = new ArrayList<>();
		enrichNotificationReceivers(receiverList, notificationObj);
		receiverList.forEach(receiver -> {
			String message = util.getAppliedMsg(receiver, customizedMsg, notificationObj);
			String subject = message.substring(message.indexOf("<h2>")+4,message.indexOf("</h2>"));
			String body = message.substring(message.indexOf("</h2>")+4);
			Email emailobj = Email.builder().emailTo(Collections.singleton(receiver.getEmailId())).isHTML(true).body(body).subject(subject).build();
			EmailRequest email = new EmailRequest(notificationObj.getRequestInfo(),emailobj);
			emailRequest.add(email);
		});
	}

}
