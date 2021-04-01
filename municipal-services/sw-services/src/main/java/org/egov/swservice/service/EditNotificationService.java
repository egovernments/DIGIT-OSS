package org.egov.swservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.Action;
import org.egov.swservice.web.models.Category;
import org.egov.swservice.web.models.Event;
import org.egov.swservice.web.models.EventRequest;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.Recepient;
import org.egov.swservice.web.models.SMSRequest;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EditNotificationService {

	@Autowired
	private SWConfiguration config;

	@Autowired
	private NotificationUtil notificationUtil;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WorkflowNotificationService workflowNotificationService;
	
	@Autowired
	private ValidateProperty validateProperty;
	
	@Autowired
	private SewerageServicesUtil servicesUtil;


	public void sendEditNotification(SewerageConnectionRequest request) {
		try {
			Property property = validateProperty.getOrValidateProperty(request);
			
			if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEventRequest(request, property);
				if (eventRequest != null) {
					notificationUtil.sendEventNotification(eventRequest);
				}
			}
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(request, property);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}
		} catch (Exception ex) {
			log.error("Exception while trying to process edit notification.", ex);
		}
	}

	private EventRequest getEventRequest(SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		String code = SWConstants.SW_EDIT_IN_APP;
		if ((!sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& servicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)) {
			code = SWConstants.SW_MODIFY_IN_APP;
		}
		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = SWConstants.DEFAULT_OBJECT_EDIT_APP_MSG;
			if (code.equalsIgnoreCase(SWConstants.SW_MODIFY_IN_APP))
				message = SWConstants.DEFAULT_OBJECT_MODIFY_APP_MSG;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		Map<String, String> mobileNumberAndMesssage = workflowNotificationService
				.getMessageForMobileNumber(mobileNumbersAndNames, sewerageConnectionRequest, message, property);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMesssage.keySet());
		Map<String, String> mapOfPhoneNoAndUUIDs = workflowNotificationService.fetchUserUUIDs(mobileNumbers,
				sewerageConnectionRequest.getRequestInfo(), property.getTenantId());
		if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}
		List<Event> events = new ArrayList<>();
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhoneNoAndUUIDs.get(mobile) || null == mobileNumberAndMesssage.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhoneNoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			Action action = workflowNotificationService.getActionForEventNotification(mobileNumberAndMesssage, mobile,
					sewerageConnectionRequest, property);
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMesssage.get(mobile)).eventType(SWConstants.USREVENTS_EVENT_TYPE)
					.name(SWConstants.USREVENTS_EVENT_NAME).postedBy(SWConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP).recepient(recepient).eventDetails(null).actions(action).build());
		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}

	}

	private List<SMSRequest> getSmsRequest(SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		String code = SWConstants.SW_EDIT_SMS;
		if ((!sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& servicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)) {
			code = SWConstants.SW_MODIFY_SMS;
		}
		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = SWConstants.DEFAULT_OBJECT_EDIT_SMS_MSG;
			if (code.equalsIgnoreCase(SWConstants.SW_MODIFY_SMS)) {
				message = SWConstants.DEFAULT_OBJECT_MODIFY_SMS_MSG;
			}
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		Map<String, String> mobileNumberAndMessage = workflowNotificationService
				.getMessageForMobileNumber(mobileNumbersAndNames, sewerageConnectionRequest, message, property);
		List<SMSRequest> smsRequest = new ArrayList<>();
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}
}
