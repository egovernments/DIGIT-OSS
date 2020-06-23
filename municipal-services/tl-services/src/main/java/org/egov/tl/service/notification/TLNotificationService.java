package org.egov.tl.service.notification;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.util.*;
import org.egov.tl.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.tl.util.BPAConstants.NOTIFICATION_APPROVED;
import static org.egov.tl.util.TLConstants.*;


@Slf4j
@Service
public class TLNotificationService {


    private TLConfiguration config;

    private ServiceRequestRepository serviceRequestRepository;

    private NotificationUtil util;

	private BPANotificationUtil bpaNotificationUtil;

	private TLRenewalNotificationUtil tlRenewalNotificationUtil;

	@Autowired
	public TLNotificationService(TLConfiguration config, ServiceRequestRepository serviceRequestRepository, NotificationUtil util, BPANotificationUtil bpaNotificationUtil,TLRenewalNotificationUtil tlRenewalNotificationUtil) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.util = util;
		this.bpaNotificationUtil = bpaNotificationUtil;
		this.tlRenewalNotificationUtil = tlRenewalNotificationUtil;
	}

    /**
     * Creates and send the sms based on the tradeLicenseRequest
     * @param request The tradeLicenseRequest listenend on the kafka topic
     */
    public void process(TradeLicenseRequest request){

        String businessService = request.getLicenses().isEmpty()?null:request.getLicenses().get(0).getBusinessService();
		if (businessService == null)
			businessService = businessService_TL;
		switch(businessService)
		{
			case businessService_TL:
				List<SMSRequest> smsRequestsTL = new LinkedList<>();
				if(null != config.getIsTLSMSEnabled()) {
					if(config.getIsTLSMSEnabled()) {
						enrichSMSRequest(request,smsRequestsTL);
						if(!CollectionUtils.isEmpty(smsRequestsTL))
							util.sendSMS(smsRequestsTL,true);
					}
				}
				if(null != config.getIsUserEventsNotificationEnabledForTL()) {
					if(config.getIsUserEventsNotificationEnabledForTL()) {
						EventRequest eventRequest = getEventsForTL(request);
						if(null != eventRequest)
							util.sendEventNotification(eventRequest);
					}
				}
				break;

			case businessService_BPA:
				List<SMSRequest> smsRequestsBPA = new LinkedList<>();
				if (null != config.getIsBPASMSEnabled()) {
					if (config.getIsBPASMSEnabled()) {
						enrichSMSRequest(request, smsRequestsBPA);
						if (!CollectionUtils.isEmpty(smsRequestsBPA))
							util.sendSMS(smsRequestsBPA, true);
					}
				}
				if(null != config.getIsUserEventsNotificationEnabledForBPA()) {
					if(config.getIsUserEventsNotificationEnabledForBPA()) {
						EventRequest eventRequest = getEventsForBPA(request, false, null);
						if(null != eventRequest)
							util.sendEventNotification(eventRequest);
					}
				}
				break;
		}
    }

    /**
     * Enriches the smsRequest with the customized messages
     * @param request The tradeLicenseRequest from kafka topic
     * @param smsRequests List of SMSRequets
     */
    private void enrichSMSRequest(TradeLicenseRequest request,List<SMSRequest> smsRequests){
        String tenantId = request.getLicenses().get(0).getTenantId();
        for(TradeLicense license : request.getLicenses()){
			String businessService = license.getBusinessService();
			if (businessService == null)
				businessService = businessService_TL;
			String message = null;
			String applicationType = String.valueOf(license.getApplicationType());
			if (businessService.equals(businessService_TL)) {
				if(applicationType.equals(APPLICATION_TYPE_RENEWAL)){
					String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
					message = tlRenewalNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}
				else{
					String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
					message = util.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}

			}
			if(businessService.equals(businessService_BPA)){
				String localizationMessages = bpaNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
				message = bpaNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
			if(businessService.equals(businessService_DIRECT_RENEWAL) || businessService.equals(businessService_EDIT_RENEWAL)){
				String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
				message = tlRenewalNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
            if(message==null) continue;

            Map<String,String > mobileNumberToOwner = new HashMap<>();

            license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                if(owner.getMobileNumber()!=null)
                    mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
            });
            smsRequests.addAll(util.createSMSRequest(message,mobileNumberToOwner));
        }
    }
    
    /**
     * Creates and registers an event at the egov-user-event service at defined trigger points as that of sms notifs.
     * 
     * Assumption - The TradeLicenseRequest received will always contain only one TradeLicense.
     * 
     * @param request
     * @return
     */
    private EventRequest getEventsForTL(TradeLicenseRequest request) {
    	List<Event> events = new ArrayList<>();
        String tenantId = request.getLicenses().get(0).getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId,request.getRequestInfo());
        for(TradeLicense license : request.getLicenses()){
			String message = null;
			String applicationType = String.valueOf(license.getApplicationType());
			String businessService = license.getBusinessService();
			if(businessService.equals(businessService_TL)){
				if(applicationType.equals(APPLICATION_TYPE_RENEWAL))
					message = tlRenewalNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				else
					message = util.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
			
            if(message == null) continue;
            Map<String,String > mobileNumberToOwner = new HashMap<>();
            license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                if(owner.getMobileNumber()!=null)
                    mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
            });
            List<SMSRequest> smsRequests = util.createSMSRequest(message,mobileNumberToOwner);
        	Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
        	Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
    		if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
    			log.info("UUID search failed!");
    			continue;
    		}
            Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));		
            for(String mobile: mobileNumbers) {
    			if(null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
    				log.error("No UUID/SMS for mobile {} skipping event", mobile);
    				continue;
    			}
    			List<String> toUsers = new ArrayList<>();
    			toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
    			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
    			List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
    			Action action = null;
    			if(payTriggerList.contains(license.getStatus())) {
                    List<ActionItem> items = new ArrayList<>();
        			String actionLink = config.getPayLink().replace("$mobile", mobile)
        						.replace("$applicationNo", license.getApplicationNumber())
        						.replace("$tenantId", license.getTenantId())
        						.replace("$businessService", license.getBusinessService());
        			actionLink = config.getUiAppHost() + actionLink;
        			ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
        			items.add(item);
        			action = Action.builder().actionUrls(items).build();
    			}

				
				events.add(Event.builder().tenantId(license.getTenantId()).description(mobileNumberToMsg.get(mobile))
						.eventType(TLConstants.USREVENTS_EVENT_TYPE).name(TLConstants.USREVENTS_EVENT_NAME)
						.postedBy(TLConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
						.eventDetails(null).actions(action).build());
    			
    		}
        }
        if(!CollectionUtils.isEmpty(events)) {
    		return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
        }else {
        	return null;
        }
		
    }

	public EventRequest getEventsForBPA(TradeLicenseRequest request, boolean isStatusPaid, String paidMessage) {
		List<Event> events = new ArrayList<>();
		String tenantId = request.getLicenses().get(0).getTenantId();
		for(TradeLicense license : request.getLicenses()){
			String message = null;
			if(isStatusPaid)
			{
				message = paidMessage;
			}
			else {
				String localizationMessages = bpaNotificationUtil.getLocalizationMessages(tenantId,request.getRequestInfo());
				message = bpaNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
			if(message == null) continue;
			Map<String,String > mobileNumberToOwner = new HashMap<>();
			license.getTradeLicenseDetail().getOwners().forEach(owner -> {
				if(owner.getMobileNumber()!=null)
					mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
			});
			List<SMSRequest> smsRequests = util.createSMSRequest(message,mobileNumberToOwner);
			Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
			Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
			if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
				log.info("UUID search failed!");
				continue;
			}
			Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
			for(String mobile: mobileNumbers) {
				if(null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
					log.error("No UUID/SMS for mobile {} skipping event", mobile);
					continue;
				}
				List<String> toUsers = new ArrayList<>();
				toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
				Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
				List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
				Action action = null;
				if(payTriggerList.contains(license.getStatus()) && !isStatusPaid) {
					List<ActionItem> items = new ArrayList<>();
					String actionLink = config.getPayLink().replace("$mobile", mobile)
							.replace("$applicationNo", license.getApplicationNumber())
							.replace("$tenantId", license.getTenantId())
					        .replace("$businessService", license.getBusinessService());;
					actionLink = config.getUiAppHost() + actionLink;
					ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
					items.add(item);
					action = Action.builder().actionUrls(items).build();
				}


				events.add(Event.builder().tenantId(license.getTenantId()).description(mobileNumberToMsg.get(mobile))
						.eventType(BPAConstants.USREVENTS_EVENT_TYPE).name(BPAConstants.USREVENTS_EVENT_NAME)
						.postedBy(BPAConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
						.eventDetails(null).actions(action).build());

			}
		}
		if(!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
		}else {
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
    	for(String mobileNo: mobileNumbers) {
    		userSearchRequest.put("userName", mobileNo);
    		try {
    			Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
    			if(null != user) {
    				String uuid = JsonPath.read(user, "$.user[0].uuid");
    				mapOfPhnoAndUUIDs.put(mobileNo, uuid);
    			}else {
        			log.error("Service returned null while fetching user for username - "+mobileNo);
    			}
    		}catch(Exception e) {
    			log.error("Exception while fetching user for username - "+mobileNo);
    			log.error("Exception trace: ",e);
    			continue;
    		}
    	}
    	return mapOfPhnoAndUUIDs;
    }







}