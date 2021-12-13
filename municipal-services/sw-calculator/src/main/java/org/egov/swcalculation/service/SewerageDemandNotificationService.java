package org.egov.swcalculation.service;

import java.io.IOException;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.util.SWCalculationUtil;
import org.egov.swcalculation.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.minidev.json.JSONArray;

import static org.egov.swcalculation.constants.SWCalculationConstant.*;

@Service
public class SewerageDemandNotificationService {

	@Autowired
	SWCalculationUtil util;

	@Autowired
	ObjectMapper mapper;

	@Autowired
	MasterDataService masterDataService;

	@Autowired
	SWCalculationConfiguration config;

	public void process(DemandNotificationObj notificationObj, String topic) {
		List<String> configuredChannelNames =  util.fetchChannelList(notificationObj.getRequestInfo(), notificationObj.getTenantId(), SERVICE_FIELD_VALUE_SW, ACTION_FOR_DEMAND);
//		List<String> configuredChannelNames = Arrays.asList(new String[] {"SMS","EMAIL"});
		if (configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = new LinkedList<>();
				enrichSMSRequest(notificationObj, smsRequests, topic);
				if (!CollectionUtils.isEmpty(smsRequests))
					util.sendSMS(smsRequests);
			}
		}
		if (configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
			if (config.getIsMailEnabled() != null && config.getIsMailEnabled()) {
				List<EmailRequest> emailRequests = new LinkedList<>();
				enrichEmailRequest(notificationObj, emailRequests, topic);
				if (!CollectionUtils.isEmpty(emailRequests)) {
					util.sendEmail(emailRequests);
				}
			}
		}
	}

	@SuppressWarnings("unused")
	private void enrichSMSRequest(DemandNotificationObj notificationObj, List<SMSRequest> smsRequest, String topic) {
		String tenantId = notificationObj.getTenantId();
		String localizationMessage = util.getLocalizationMessages(tenantId, notificationObj.getRequestInfo());
		String messageTemplate = util.getCustomizedMsg(topic, localizationMessage);
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
			throw new CustomException("PARSING_ERROR", "Notification Receiver List Can Not Be Parsed!!");
		}
	}

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
