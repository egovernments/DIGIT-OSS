package org.egov.swservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.User;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.swservice.util.SWConstants.*;

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
			User userInfoCopy = request.getRequestInfo().getUserInfo();
			User userInfo = notificationUtil.getInternalMicroserviceUser(request.getSewerageConnection().getTenantId());
			request.getRequestInfo().setUserInfo(userInfo);

			Property property = validateProperty.getOrValidateProperty(request);
			List<String> configuredChannelNames =  notificationUtil.fetchChannelList(request.getRequestInfo(), request.getSewerageConnection().getTenantId(), SEWERAGE_SERVICE_BUSINESS_ID, request.getSewerageConnection().getProcessInstance().getAction());

			request.getRequestInfo().setUserInfo(userInfoCopy);

			if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {

				if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
					EventRequest eventRequest = getEventRequest(request, property);
					if (eventRequest != null) {
						notificationUtil.sendEventNotification(eventRequest, property.getTenantId());
					}
				}
			}
			if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {

				if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
					List<SMSRequest> smsRequests = getSmsRequest(request, property);
					if (!CollectionUtils.isEmpty(smsRequests)) {
						notificationUtil.sendSMS(smsRequests, request.getSewerageConnection().getTenantId());
					}
				}
			}
		} catch (Exception ex) {
			log.error("Exception while trying to process edit notification.", ex);
		}
	}

	private EventRequest getEventRequest(SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();

		String code = SW_EDIT_IN_APP;
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& servicesUtil.isModifyConnectionRequestForNotification(sewerageConnectionRequest)) {
			code = SWConstants.SW_MODIFY_IN_APP;
		}
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && servicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest)) {
			code = SW_DISCONNECT_EDIT_INAPP;
		}

		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = SWConstants.DEFAULT_OBJECT_EDIT_APP_MSG;
			if (code.equalsIgnoreCase(SWConstants.SW_MODIFY_IN_APP))
				message = SWConstants.DEFAULT_OBJECT_MODIFY_APP_MSG;
		}

		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();

		Set<String> ownersMobileNumbers = new HashSet<>();
		//Send the notification to all owners
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				ownersMobileNumbers.add(owner.getMobileNumber());
		});

		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					ownersMobileNumbers.add(holder.getMobileNumber());
				}
			});
		}

		for (String mobileNumber : ownersMobileNumbers) {
			UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUsername(mobileNumber, sewerageConnectionRequest.getRequestInfo(), sewerageConnectionRequest.getSewerageConnection().getTenantId());
			if (!CollectionUtils.isEmpty(userDetailResponse.getUser())) {
				OwnerInfo user = userDetailResponse.getUser().get(0);
				mobileNumbersAndNames.put(user.getMobileNumber(), user.getName());
				mapOfPhoneNoAndUUIDs.put(user.getMobileNumber(), user.getUuid());
			} else {
				log.info("No User for mobile {} skipping event", mobileNumber);
			}
		}

		//Send the notification to applicant
		if (!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber())) {
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
			mapOfPhoneNoAndUUIDs.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid());
		}

		Map<String, String> mobileNumberAndMesssage = workflowNotificationService
				.getMessageForMobileNumber(mobileNumbersAndNames, sewerageConnectionRequest, message, property);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMesssage.keySet());

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
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();

		String code = SWConstants.SW_EDIT_SMS;
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& servicesUtil.isModifyConnectionRequestForNotification(sewerageConnectionRequest)) {
			code = SW_MODIFY_SMS;
		}
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && servicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest)) {
			code = SW_DISCONNECT_EDIT_SMS;
		}

		String message = notificationUtil.getCustomizedMsg(code, localizationMessage);
		if (message == null) {
			log.info("No localized message found!!, Using default message");
			message = SWConstants.DEFAULT_OBJECT_EDIT_SMS_MSG;
			if (code.equalsIgnoreCase(SWConstants.SW_MODIFY_SMS)) {
				message = SWConstants.DEFAULT_OBJECT_MODIFY_SMS_MSG;
			}
		}
			Set<String> ownersUuids = new HashSet<>();
			property.getOwners().forEach(owner -> {
					if (owner.getUuid() != null)
					{
						ownersUuids.add(owner.getUuid());
					}
				});
			//send the notification to the connection holders
			if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
				sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
					if (!org.apache.commons.lang.StringUtils.isEmpty(holder.getUuid())) {
						ownersUuids.add(holder.getUuid());
					}
				});
			}
			UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUUID(ownersUuids,sewerageConnectionRequest.getRequestInfo(),sewerageConnectionRequest.getSewerageConnection().getTenantId());
			Map<String, String> mobileNumbersAndNames = new HashMap<>();
			for(OwnerInfo user:userDetailResponse.getUser())
			{
				mobileNumbersAndNames.put(user.getMobileNumber(),user.getName());
			}
			//Send the notification to applicant
			if(!org.apache.commons.lang.StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
			{
				mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
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
