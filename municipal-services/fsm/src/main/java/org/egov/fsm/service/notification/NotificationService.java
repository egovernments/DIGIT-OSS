package org.egov.fsm.service.notification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.service.UserService;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.NotificationUtil;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.notification.Event;
import org.egov.fsm.web.model.notification.EventRequest;
import org.egov.fsm.web.model.notification.Recepient;
import org.egov.fsm.web.model.notification.SMSRequest;
import org.egov.fsm.web.model.notification.Source;
import org.egov.fsm.web.model.user.UserDetailResponse;
import org.egov.fsm.web.model.workflow.Action;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.egov.fsm.util.FSMUtil;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NotificationService {

	@Autowired
	private FSMConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private NotificationUtil util;

	@Autowired
	private UserService userService;
	
	@Autowired
	private FSMUtil fsmUtil;


	@Autowired
	public NotificationService(FSMConfiguration config, ServiceRequestRepository serviceRequestRepository) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
	}

	/**
	 * Creates and send the sms based on the fsmRequest
	 * 
	 * @param request
	 *            The fsmRequest listenend on the kafka topic
	 */
	public void process(FSMRequest fsmRequest) {
		List<SMSRequest> smsRequests = new LinkedList<>();
		if (null != config.getIsSMSEnabled()) {
			if (config.getIsSMSEnabled()) {
				enrichSMSRequest(fsmRequest, smsRequests);
				if (!CollectionUtils.isEmpty(smsRequests))
					util.sendSMS(smsRequests, config.getIsSMSEnabled());
			}
		}
		if (null != config.getIsUserEventsNotificationEnabled()) {
			if (config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEvents(fsmRequest);
				if (null != eventRequest)
					util.sendEventNotification(eventRequest);
			}
		}
	}

	/**
	 * Creates and registers an event at the egov-user-event service at defined
	 * trigger points as that of sms notifs.
	 * 
	 * Assumption - The fsmRequest received will always contain only one fsm.
 	 * 
	 * @param request
	 * @return
	 */
	public EventRequest getEvents(FSMRequest fsmRequest) {

		List<Event> events = new ArrayList<>();
		FSM fsmApplication = fsmRequest.getFsm();
		List<SMSRequest> smsRequests = new LinkedList<>();
		enrichSMSRequest(fsmRequest, smsRequests);
		
		Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
		Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, fsmRequest.getRequestInfo(),
				fsmRequest.getFsm().getTenantId());

		Map<String, String> mobileNumberToMsg = smsRequests.stream()
				.collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
		
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			Action action = null;

			events.add(Event.builder().tenantId(fsmApplication.getTenantId()).description(mobileNumberToMsg.get(mobile))
					.eventType(FSMConstants.USREVENTS_EVENT_TYPE).name(FSMConstants.USREVENTS_EVENT_NAME)
					.postedBy(FSMConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP)
					.recepient(recepient)
					.eventDetails(null).actions(action).build());
		}

		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(fsmRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}

	}

	/**
	 * Fetches UUIDs of CITIZENs based on the phone number.
	 * 
 	 * @param mobileNumbers
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	private Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {

		Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		for (String mobileNo : mobileNumbers) {
			userSearchRequest.put("userName", mobileNo);
			try {
				Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
				if (null != user) {
					String uuid = JsonPath.read(user, "$.user[0].uuid");
					mapOfPhnoAndUUIDs.put(mobileNo, uuid);
				} else {
					log.error("Service returned null while fetching user for username - " + mobileNo);
				}
			} catch (Exception e) {
				log.error("Exception while fetching user for username - " + mobileNo);
				log.error("Exception trace: ", e);
				continue;
			}
		}
		return mapOfPhnoAndUUIDs;
	}

	/**
	 * Enriches the smsRequest with the customized messages
	 * 
	 * @param request
	 *            The fsmRequest from kafka topic
	 * @param smsRequests
	 *            List of SMSRequets
	 */
	private void enrichSMSRequest(FSMRequest fsmRequest, List<SMSRequest> smsRequests) {
		String tenantId = fsmRequest.getFsm().getTenantId();
		FSM fsm =fsmRequest.getFsm();
		String localizationMessages = util.getLocalizationMessages(tenantId, fsmRequest.getRequestInfo());
		String messageCode =  null;
		
		if(!FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY.equalsIgnoreCase(fsm.getPaymentPreference()) &&
				fsm.getApplicationStatus().equalsIgnoreCase(FSMConstants.WF_STATUS_PENDING_APPL_FEE_PAYMENT) && 
				fsm.getSource() != null && fsm.getSource().equalsIgnoreCase(FSMConstants.APPLICATION_CHANNEL_TELEPONE)) {
			messageCode=FSMConstants.SMS_NOTIFICATION_PREFIX +FSMConstants.WF_STATUS_CREATED+"_"+FSMConstants.WF_ACTION_CREATE;
			
			/*
			 * bug SAN-1088- Getting 2 sms for pay now application creation
			 */
			
			String message = util.getCustomizedMsg(fsmRequest, localizationMessages,messageCode);
			Map<String, String> mobileNumberToOwner = getUserList(fsmRequest);
			
			smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));
		}
		
		String localizationMessageKey = FSMConstants.SMS_NOTIFICATION_PREFIX + fsm.getApplicationStatus()
				+ (fsmRequest.getWorkflow() == null ? "" : "_" + fsmRequest.getWorkflow().getAction());
		
		if(FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY.equalsIgnoreCase(fsm.getPaymentPreference())) {
			log.info("Entered the FSM_PAYMENT_PREFERENCE_POST_PAY Block:: ");
			if(FSMConstants.FSM_SMS_DSO_INPROGRESS_DSO_ACCEPT.equalsIgnoreCase(localizationMessageKey)) {
				messageCode=FSMConstants.SMS_NOTIFICATION_POST_PAY_PREFIX + fsm.getApplicationStatus()
				+ (fsmRequest.getWorkflow() == null ? "" : "_" + fsmRequest.getWorkflow().getAction());
			}
			if(FSMConstants.FSM_SMS_CREATED_CREATE.equalsIgnoreCase(localizationMessageKey)) {
				messageCode=FSMConstants.SMS_NOTIFICATION_POST_PAY_PREFIX + fsm.getApplicationStatus()
				+ (fsmRequest.getWorkflow() == null ? "" : "_" + fsmRequest.getWorkflow().getAction());
			}
			
		} /*
			 * else { messageCode=localizationMessageKey; }
			 */
		log.info("Printing the value of before final messageCode:: "+ messageCode);
		if(null==messageCode) {
			messageCode=localizationMessageKey;
		}
		/*
		 * bug SAN-1088- Getting 2 sms for pay now application creation
		 * message code for pre_pay
		 */
		if(!FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY.equalsIgnoreCase(fsm.getPaymentPreference()) &&
				fsm.getApplicationStatus().equalsIgnoreCase(FSMConstants.WF_STATUS_PENDING_APPL_FEE_PAYMENT)){
			
			messageCode=FSMConstants.SMS_NOTIFICATION_PREFIX + fsm.getApplicationStatus()
			+ (fsmRequest.getWorkflow() == null ? "" : "_" + FSMConstants.WF_ACTION_SUBMIT);
		}
		log.info("Printing the value of final messageCode:: "+ messageCode);
		
		String message = util.getCustomizedMsg(fsmRequest, localizationMessages,messageCode);
		log.info("Printing the value of final getCustomizedMsg:: "+ message);
		
		Map<String, String> mobileNumberToOwner = getUserList(fsmRequest);
		HashMap<String,String> fsmAddtlDtls = (HashMap<String,String> )fsmRequest.getFsm().getAdditionalDetails();
		if(fsmAddtlDtls !=null && fsmAddtlDtls.get("payerMobileNumber") !=null  && fsmAddtlDtls.get("payerName") != null && mobileNumberToOwner.get(fsmAddtlDtls.get("payerMobileNumber")) == null) {
			mobileNumberToOwner.put(fsmAddtlDtls.get("payerMobileNumber"),  fsmAddtlDtls.get("payerName"));
		}
		smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));
	}

	/**
	 * To get the Users to whom we need to send the sms notifications or event
	 * notifications.
	 * 
	 * @param fsmRequest
	 * @return
	 */
	private Map<String, String> getUserList(FSMRequest fsmRequest) {
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = fsmRequest.getFsm().getTenantId().split("\\.")[0];
		String stakeUUID = fsmRequest.getFsm().getAccountId();
		List<String> ownerId = new ArrayList<String>();
		ownerId.add(stakeUUID);
		FSMSearchCriteria fsSearchCriteria = new FSMSearchCriteria();
		fsSearchCriteria.setOwnerIds(ownerId);
		fsSearchCriteria.setTenantId(tenantId);
		UserDetailResponse userDetailResponse = userService.getUser(fsSearchCriteria, fsmRequest.getRequestInfo());
		
		mobileNumberToOwner.put(userDetailResponse.getUser().get(0).getMobileNumber(),
				userDetailResponse.getUser().get(0).getName());
		

		return mobileNumberToOwner;
	}

	/**
	 * Creates and send the SMS if vehicle capacity has been updated
	 * @param request
	 */
	public void process(FSMRequest fsmRequest,FSM oldFSM) {
		FSM newFSM=fsmRequest.getFsm();
		log.info("Old Vehicle Capacity:: " + oldFSM.getVehicleCapacity());
		log.info("New Vehicle Capacity:: " + newFSM.getVehicleCapacity());
		log.info("Old No of trips :: " + oldFSM.getNoOfTrips());
		log.info("New No of trips :: " + newFSM.getNoOfTrips());

		if(null!=oldFSM.getVehicleCapacity() && null!=newFSM.getVehicleCapacity() 
				&& ( (!newFSM.getVehicleCapacity().equalsIgnoreCase(oldFSM.getVehicleCapacity())) ||
						(!newFSM.getNoOfTrips().equals(oldFSM.getNoOfTrips()))
					)
		  ) {

			log.info("Vehicle Capacity or no of trips is updated sending SMS here::");

			String tenantId = fsmRequest.getFsm().getTenantId();
			String localizationMessages = util.getLocalizationMessages(tenantId, fsmRequest.getRequestInfo());
			String messageCode =  FSMConstants.FSM_SMS_CITIZEN_NO_OF_TRIPS_VEHICLE_CAPACITY_CHANGE;

			List<SMSRequest> smsRequests = new LinkedList<>();
			String message = util.getCustomizedMsg(fsmRequest, localizationMessages,messageCode);
			log.info("SMS message to be sent:: "+ message);
			Map<String, String> mobileNumberToOwner = getUserList(fsmRequest);
			smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));

			List<Event> events = new ArrayList<>();
			Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
			Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, fsmRequest.getRequestInfo(),
					fsmRequest.getFsm().getTenantId());
			Map<String, String> mobileNumberToMsg = smsRequests.stream()
					.collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));

			for (String mobile : mobileNumbers) {

				List<String> toUsers = new ArrayList<>();
				toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
				Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
				Action action = null;

				events.add(Event.builder().tenantId(fsmRequest.getFsm().getTenantId()).description(mobileNumberToMsg.get(mobile))
						.eventType(FSMConstants.USREVENTS_EVENT_TYPE).name(FSMConstants.USREVENTS_EVENT_NAME)
						.postedBy(FSMConstants.USREVENTS_EVENT_POSTEDBY)
						.source(Source.WEBAPP)
						.recepient(recepient)
						.eventDetails(null).actions(action).build());
			}


			/* Commenting out the SMS code as only notification is required for SAN-1024
			 * if (null != config.getIsSMSEnabled()) { if (config.getIsSMSEnabled()) { if
			 * (!CollectionUtils.isEmpty(smsRequests)) util.sendSMS(smsRequests,
			 * config.getIsSMSEnabled()); } }
			 */

			if (null != config.getIsUserEventsNotificationEnabled()) {
				if (config.getIsUserEventsNotificationEnabled()) {
					EventRequest eventRequest = EventRequest.builder().requestInfo(fsmRequest.getRequestInfo()).events(events).build();
					if (null != eventRequest)
						util.sendEventNotification(eventRequest);
				}
			}

		}else {
			log.info("Vehicle Capacity or no of trips is is not updated not sending SMS here::");
		}
	}
}
