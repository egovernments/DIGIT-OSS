package org.egov.waterconnection.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.util.NotificationUtil;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.validator.ValidateProperty;
import org.egov.waterconnection.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.waterconnection.constants.WCConstants.*;

@Service
@Slf4j
public class EditNotificationService {

	@Autowired
	private WSConfiguration config;

	@Autowired
	private NotificationUtil notificationUtil;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WorkflowNotificationService workflowNotificationService;
	
	@Autowired
	private ValidateProperty validateProperty;
	
	@Autowired
	private WaterServicesUtil waterServicesUtil;
	

	public void sendEditNotification(WaterConnectionRequest request) {
		try {
			String applicationStatus = request.getWaterConnection().getApplicationStatus();
			List<String> configuredChannelNames =  notificationUtil.fetchChannelList(request.getRequestInfo(), request.getWaterConnection().getTenantId(), WATER_SERVICE_BUSINESS_ID, request.getWaterConnection().getProcessInstance().getAction());

			Property property = validateProperty.getOrValidateProperty(request);

			if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
				if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
					EventRequest eventRequest = getEventRequest(request, property);
					if (eventRequest != null) {
						notificationUtil.sendEventNotification(eventRequest);
					}
				}
			}
			if(configuredChannelNames.contains(CHANNEL_NAME_SMS)){
				if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(request, property);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}}
		} catch (Exception ex) {
			log.error("Exception when trying to send notification. ", ex);
		}
	}

	private EventRequest getEventRequest(WaterConnectionRequest waterConnectionRequest, Property property) {
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), waterConnectionRequest.getRequestInfo());
		String code = WCConstants.WS_EDIT_IN_APP;
		if ((!waterConnectionRequest.getWaterConnection().getProcessInstance().getAction().equalsIgnoreCase(WCConstants.ACTIVATE_CONNECTION))
				&& waterServicesUtil.isModifyConnectionRequest(waterConnectionRequest)) {
			   code = WCConstants.WS_MODIFY_IN_APP;
		}
		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = notificationUtil.getCustomizedMsg(DEFAULT_OBJECT_EDIT_APP_MSG, localizationMessage);
			if(code.equalsIgnoreCase(WCConstants.WS_MODIFY_IN_APP))
				message = notificationUtil.getCustomizedMsg(DEFAULT_OBJECT_MODIFY_APP_MSG, localizationMessage);
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();

			//Send the notification to all owners
			property.getOwners().forEach(owner -> {
				if (owner.getMobileNumber() != null)
					mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
			});

			//send the notification to the connection holders
			if(!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
				waterConnectionRequest.getWaterConnection().getConnectionHolders().forEach(holder -> {
					if (!StringUtils.isEmpty(holder.getMobileNumber())) {
						mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
					}
				});
			}
			//Send the notification to applicant
			if(!org.apache.commons.lang.StringUtils.isEmpty(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
			{
				mobileNumbersAndNames.put(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), waterConnectionRequest.getRequestInfo().getUserInfo().getName());
			}

		Map<String, String> mobileNumberAndMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames, waterConnectionRequest, message, property);
		Set<String> mobileNumbers = mobileNumberAndMessage.keySet().stream().collect(Collectors.toSet());
		Map<String, String> mapOfPhoneNoAndUUIDs = workflowNotificationService.
				fetchUserUUIDs(mobileNumbers, waterConnectionRequest.getRequestInfo(),
				property.getTenantId());
		if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}
		List<Event> events = new ArrayList<>();
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhoneNoAndUUIDs.get(mobile) || null == mobileNumberAndMessage.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhoneNoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			Action action = workflowNotificationService.getActionForEventNotification(mobileNumberAndMessage, mobile,
					waterConnectionRequest, property);
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMessage.get(mobile)).eventType(WCConstants.USREVENTS_EVENT_TYPE)
					.name(WCConstants.USREVENTS_EVENT_NAME).postedBy(WCConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP).recepient(recepient).eventDetails(null).actions(action).build());
		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(waterConnectionRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}

	}

	private List<SMSRequest> getSmsRequest(WaterConnectionRequest waterConnectionRequest, Property property) {
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), waterConnectionRequest.getRequestInfo());
		String code = WCConstants.WS_EDIT_SMS;
		if ((!waterConnectionRequest.getWaterConnection().getProcessInstance().getAction().equalsIgnoreCase(WCConstants.ACTIVATE_CONNECTION))
				&& waterServicesUtil.isModifyConnectionRequest(waterConnectionRequest)) {
			code = WCConstants.WS_MODIFY_SMS;
		}
		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = notificationUtil.getCustomizedMsg(DEFAULT_OBJECT_EDIT_SMS_MSG, localizationMessage);
			if(code.equalsIgnoreCase(WCConstants.WS_MODIFY_SMS))
				message = notificationUtil.getCustomizedMsg(DEFAULT_OBJECT_MODIFY_SMS_MSG, localizationMessage);
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();

			//Send the notification to all owners
			property.getOwners().forEach(owner -> {
				if (owner.getMobileNumber() != null)
					mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
			});

			//send the notification to the connection holders
			if(!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
				waterConnectionRequest.getWaterConnection().getConnectionHolders().forEach(holder -> {
					if (!StringUtils.isEmpty(holder.getMobileNumber())) {
						mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
					}
				});
			}
			//Send the notification to applicant
			if(!org.apache.commons.lang.StringUtils.isEmpty(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
			{
				mobileNumbersAndNames.put(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), waterConnectionRequest.getRequestInfo().getUserInfo().getName());
			}

		Map<String, String> mobileNumberAndMessage = workflowNotificationService
				.getMessageForMobileNumber(mobileNumbersAndNames, waterConnectionRequest, message, property);
		List<SMSRequest> smsRequest = new ArrayList<>();
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.NOTIFICATION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}
}
