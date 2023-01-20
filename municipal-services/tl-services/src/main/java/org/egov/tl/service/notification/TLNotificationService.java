package org.egov.tl.service.notification;

import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.util.*;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.property.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.awt.image.BufferStrategy;
import java.util.*;
import java.util.stream.Collectors;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.tl.util.BPAConstants.APPROVED_STATUS;
import static org.egov.tl.util.BPAConstants.BUSINESS_SERVICE_BPAREG;
import static org.egov.tl.util.TLConstants.*;
import static org.egov.tl.util.TLConstants.PROPERTY_ID;


@Slf4j
@Service
public class TLNotificationService {


	private TLConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private NotificationUtil util;

	private BPANotificationUtil bpaNotificationUtil;

	private TLRenewalNotificationUtil tlRenewalNotificationUtil;

	private PropertyUtil propertyUtil;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsUrl;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	public TLNotificationService(TLConfiguration config, ServiceRequestRepository serviceRequestRepository, NotificationUtil util, BPANotificationUtil bpaNotificationUtil, TLRenewalNotificationUtil tlRenewalNotificationUtil, PropertyUtil propertyUtil) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.util = util;
		this.bpaNotificationUtil = bpaNotificationUtil;
		this.tlRenewalNotificationUtil = tlRenewalNotificationUtil;
		this.propertyUtil = propertyUtil;
	}

	/**
	 * Creates and send the sms based on the tradeLicenseRequest
	 * @param request The tradeLicenseRequest listenend on the kafka topic
	 */
	public void process(TradeLicenseRequest request) {
		RequestInfo requestInfo = request.getRequestInfo();
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = request.getLicenses().get(0).getTenantId();
		String action = request.getLicenses().get(0).getAction();
		Map<Object, Object> configuredChannelList = new HashMap<>();
//		List<String> configuredChannelNames = Arrays.asList(new String[]{"SMS","EVENT","EMAIL"});
		Set<String> mobileNumbers = new HashSet<>();

		for(TradeLicense license : request.getLicenses()){
			license.getTradeLicenseDetail().getOwners().forEach(owner -> {
			if(owner.getMobileNumber()!=null)
				mobileNumbers.add(owner.getMobileNumber());
		});
		}

		String propertyId = "";

		String businessService = request.getLicenses().isEmpty() ? null : request.getLicenses().get(0).getBusinessService();
		if (businessService == null)
			businessService = businessService_TL;

		switch (businessService) {
			case businessService_TL:
				List<SMSRequest> smsRequestsTL = new LinkedList<>();
				TradeLicense license = request.getLicenses().get(0);
				String ACTION_STATUS = license.getAction() + "_" + license.getStatus();
				if (request.getLicenses().get(0).getTradeLicenseDetail().getAdditionalDetail().get(PROPERTY_ID) != null)
					propertyId = request.getLicenses().get(0).getTradeLicenseDetail().getAdditionalDetail().get(PROPERTY_ID).asText();
				Property property = propertyUtil.getPropertyDetails(request.getLicenses().get(0), propertyId, requestInfo);
				String source = property.getSource().name();

				if (config.getIsTLSMSEnabled()) {
					if (!propertyId.isEmpty() && ACTION_STATUS_INITIATED.equalsIgnoreCase(ACTION_STATUS)) {
						List<SMSRequest> smsRequestsPT = new ArrayList<>();
						String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
						String message = propertyUtil.getPropertySearchMsg(license, localizationMessages, CHANNEL_NAME_SMS, propertyId, source);
						log.info("Message to be sent: ", message);
						smsRequestsPT.addAll(propertyUtil.createPropertySMSRequest(message, property));
						if (!CollectionUtils.isEmpty(smsRequestsPT))
							util.sendSMS(smsRequestsPT, true);

					}
					enrichSMSRequest(request, smsRequestsTL, configuredChannelList);
					if (!CollectionUtils.isEmpty(smsRequestsTL))
						util.sendSMS(smsRequestsTL, true);
				}

				if (config.getIsUserEventsNotificationEnabledForTL()) {
					if (!propertyId.isEmpty() && ACTION_STATUS_INITIATED.equalsIgnoreCase(ACTION_STATUS)) {
						String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
						String message = propertyUtil.getPropertySearchMsg(license, localizationMessages, CHANNEL_NAME_EVENT, propertyId, source);
						log.info("Message to be sent: ", message);
						EventRequest eventRequest = propertyUtil.getEventsForPropertyOwner(property, message, request);
						if (null != eventRequest)
							util.sendEventNotification(eventRequest);
					}
					EventRequest eventRequest = getEventsForTL(request);
					if (null != eventRequest)
						util.sendEventNotification(eventRequest);
				}

				List<EmailRequest> emailRequests = new LinkedList<>();
				if (config.getIsEmailNotificationEnabled()) {
					if (!propertyId.isEmpty() && ACTION_STATUS_INITIATED.equalsIgnoreCase(ACTION_STATUS)) {
						List<EmailRequest> emailRequestsPT = new LinkedList<>();
						String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
						Set<String> propertyMobileNumbers = new HashSet<>();
						property.getOwners().forEach(owner -> {
							if (owner.getMobileNumber() != null)
								propertyMobileNumbers.add(owner.getMobileNumber());
						});
						Map<String, String> mapOfPhnoAndEmail = util.fetchUserEmailIds(propertyMobileNumbers, request.getRequestInfo(), tenantId);
						String message = propertyUtil.getPropertySearchMsg(license, localizationMessages, CHANNEL_NAME_EMAIL, String.valueOf(request.getLicenses().get(0).getTradeLicenseDetail().getAdditionalDetail().get(PROPERTY_ID)), source);
						emailRequestsPT.addAll(propertyUtil.createPropertyEmailRequest(request.getRequestInfo(), message, mapOfPhnoAndEmail, property));
						if (!CollectionUtils.isEmpty(emailRequestsPT))
							util.sendEmail(emailRequestsPT, config.getIsEmailNotificationEnabled());
					}
					Map<String, String> mapOfPhnoAndEmail = util.fetchUserEmailIds(mobileNumbers, requestInfo, tenantId);
					enrichEmailRequest(request, emailRequests, mapOfPhnoAndEmail, configuredChannelList);

					if (!CollectionUtils.isEmpty(emailRequests))
						util.sendEmail(emailRequests, config.getIsEmailNotificationEnabled());
				}

				break;

			case businessService_BPA:
				configuredChannelList = fetchChannelList(new RequestInfo(), tenantId, "BPAREG", action);
				List<SMSRequest> smsRequestsBPA = new LinkedList<>();
				if (null != config.getIsBPASMSEnabled()) {
					if (config.getIsBPASMSEnabled()) {
						enrichSMSRequest(request, smsRequestsBPA,configuredChannelList);
						if (!CollectionUtils.isEmpty(smsRequestsBPA))
							util.sendSMS(smsRequestsBPA, true);
					}
				}
				if (null != config.getIsUserEventsNotificationEnabledForBPA()) {
					if (config.getIsUserEventsNotificationEnabledForBPA()) {
						EventRequest eventRequest = getEventsForBPA(request, false, null);
						if (null != eventRequest)
							util.sendEventNotification(eventRequest);
					}
				}
				List<EmailRequest> emailRequestsForBPA = new LinkedList<>();
				if (null != config.getIsEmailNotificationEnabledForBPA()) {
					if (config.getIsEmailNotificationEnabledForBPA()) {
						Map<String, String> mapOfPhnoAndEmail = util.fetchUserEmailIds(mobileNumbers, requestInfo, tenantId);
						enrichEmailRequest(request, emailRequestsForBPA, mapOfPhnoAndEmail, configuredChannelList);
					if (!CollectionUtils.isEmpty(emailRequestsForBPA))
						util.sendEmail(emailRequestsForBPA, config.getIsEmailNotificationEnabledForBPA());
					}
				}
			break;
		}
	}

	/**
	 * Enriches the emailRequest with the customized messages
	 * @param request The tradeLicenseRequest from kafka topic
	 * @param emailRequests List of SMSRequests
	 * @param mapOfPhnoAndEmail Map of Phone Numbers and Emails
	 * @param configuredChannelList Map of actions mapped to configured channels for BPAREG flow
	 */

	public void enrichEmailRequest(TradeLicenseRequest request,List<EmailRequest> emailRequests, Map<String, String> mapOfPhnoAndEmail,Map<Object,Object> configuredChannelList) {
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
					message = tlRenewalNotificationUtil.getEmailCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}
				else{
					String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
					message = util.getEmailCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}
			}
			if(businessService.equals(businessService_DIRECT_RENEWAL) || businessService.equals(businessService_EDIT_RENEWAL)){
				String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
				message = tlRenewalNotificationUtil.getEmailCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
			if (businessService.equals(businessService_BPA)) {
				String action = license.getAction();
				List<String> configuredChannelNames = (List<String>) configuredChannelList.get(action);
				if(!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_EMAIL))
				{
					String localizationMessages = bpaNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
					message = bpaNotificationUtil.getEmailCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}
			}
			if(message==null || message == "") continue;

				license.getTradeLicenseDetail().getOwners().forEach(owner -> {
					if (owner.getMobileNumber() != null && !StringUtils.isEmpty(owner.getEmailId()))
						mapOfPhnoAndEmail.put(owner.getMobileNumber(), owner.getEmailId());
				});
			emailRequests.addAll(util.createEmailRequest(request.getRequestInfo(),message,mapOfPhnoAndEmail));
			}
		}

		/**
         * Enriches the smsRequest with the customized messages
         * @param request The tradeLicenseRequest from kafka topic
         * @param smsRequests List of SMSRequests
		 * @param configuredChannelList Map of actions mapped to configured channels for this business service for BPAREG flow
         */
    private void enrichSMSRequest(TradeLicenseRequest request,List<SMSRequest> smsRequests,Map<Object,Object> configuredChannelList){
        String tenantId = request.getLicenses().get(0).getTenantId();
        for(TradeLicense license : request.getLicenses()) {
			String businessService = license.getBusinessService();
				if (businessService == null)
					businessService = businessService_TL;
				String message = null;
				String applicationType = String.valueOf(license.getApplicationType());
				if (businessService.equals(businessService_TL)) {
					if (applicationType.equals(APPLICATION_TYPE_RENEWAL)) {
						String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
						message = tlRenewalNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
					} else {
						String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
						message = util.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
					}

				}
				if (businessService.equals(businessService_BPA)) {
					String action = license.getAction();
					List<String> configuredChannelNames = (List<String>) configuredChannelList.get(action);
					if (!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
						String localizationMessages = bpaNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
						message = bpaNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
					}
				}
				if (businessService.equals(businessService_DIRECT_RENEWAL) || businessService.equals(businessService_EDIT_RENEWAL)) {
					String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo());
					message = tlRenewalNotificationUtil.getCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
				}
				if (message == null) continue;

				Map<String, String> mobileNumberToOwner = new HashMap<>();

				license.getTradeLicenseDetail().getOwners().forEach(owner -> {
					if (owner.getMobileNumber() != null)
						mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
				});
				smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));
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
        	Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
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
				List<String> viewTriggerList = Arrays.asList(config.getViewApplicationTriggers().split("[,]"));
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
    			if(viewTriggerList.contains(license.getStatus())){
					List<ActionItem> items = new ArrayList<>();
					String actionLink = config.getViewApplicationLink().replace("$mobile", mobile)
							.replace("$applicationNo", license.getApplicationNumber())
							.replace("$tenantId", license.getTenantId());
					actionLink = config.getUiAppHost() + actionLink;
					ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getViewApplicationCode()).build();
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
		Map<Object, Object> configuredChannelList = fetchChannelList(new RequestInfo(), request.getLicenses().get(0).getTenantId(), "BPAREG", request.getLicenses().get(0).getAction());
		List<Event> events = new ArrayList<>();
		String tenantId = request.getLicenses().get(0).getTenantId();
		for(TradeLicense license : request.getLicenses()){
			String actionForChannel = license.getAction();
			List<String> configuredChannelNames = (List<String>) configuredChannelList.get(actionForChannel);
			if (!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_EVENT))
			{
				String message = null;
				if(isStatusPaid)
			{
				message = paidMessage;
			}
			else {
				String localizationMessages = bpaNotificationUtil.getLocalizationMessages(tenantId,request.getRequestInfo());
				message = bpaNotificationUtil.getEventCustomizedMsg(request.getRequestInfo(), license, localizationMessages);
			}
			if(message == null) continue;
			Map<String,String > mobileNumberToOwner = new HashMap<>();
			license.getTradeLicenseDetail().getOwners().forEach(owner -> {
				if(owner.getMobileNumber()!=null)
					mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
			});
			List<SMSRequest> smsRequests = util.createSMSRequest(message,mobileNumberToOwner);
			Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
			Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
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

				if (license.getStatus().equals(APPROVED_STATUS)) {
					List<ActionItem> items = new ArrayList<>();
					String actionLink = config.getUiAppHost();
					ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPortalUrlCode()).build();
					items.add(item);
					action = Action.builder().actionUrls(items).build();
				}

				events.add(Event.builder().tenantId(license.getTenantId()).description(mobileNumberToMsg.get(mobile))
						.eventType(BPAConstants.USREVENTS_EVENT_TYPE).name(BPAConstants.USREVENTS_EVENT_NAME)
						.postedBy(BPAConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
						.eventDetails(null).actions(action).build());

			}}
		}
		if(!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
		}else {
			return null;
		}

	}





	/**
	 * Fetches Channel List based on the module name and action.
	 *
	 * @param requestInfo
	 * @param tenantId
	 * @param moduleName
	 * @param action
	 * @return Map of actions and its channel List
	 */
	public Map<Object, Object> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){

		List<Map<String,String>> masterData = new ArrayList<>();
		Map<Object, Object> map = new HashMap<>();

		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsUrl);

		if(StringUtils.isEmpty(tenantId))
			return map;
		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

        Filter masterDataFilter = filter(
                where(MODULENAME).is(moduleName)
        );

		try {
			Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
			masterData = JsonPath.parse(response).read("$.MdmsRes.Channel.channelList[?]", masterDataFilter);
		}catch(Exception e) {
			log.error("Exception while fetching workflow states to ignore: ",e);
		}


		for(Map obj: masterData)
		{
			map.put(obj.get(ACTION),obj.get(CHANNEL_NAMES));
		}
		return map;
	}

	/**
	 * Return MDMS Criteria Request
	 * *
	 * @param requestInfo
	 * @param tenantId
	 * @return MdmsCriteriaReq
	 */

	private MdmsCriteriaReq getMdmsRequestForChannelList(RequestInfo requestInfo, String tenantId){
		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName(CHANNEL_LIST);
		List<MasterDetail> masterDetailList = new ArrayList<>();
		masterDetailList.add(masterDetail);

		ModuleDetail moduleDetail = new ModuleDetail();
		moduleDetail.setMasterDetails(masterDetailList);
		moduleDetail.setModuleName(CHANNEL);
		List<ModuleDetail> moduleDetailList = new ArrayList<>();
		moduleDetailList.add(moduleDetail);

		MdmsCriteria mdmsCriteria = new MdmsCriteria();
		mdmsCriteria.setTenantId(tenantId);
		mdmsCriteria.setModuleDetails(moduleDetailList);

		MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
		mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
		mdmsCriteriaReq.setRequestInfo(requestInfo);

		return mdmsCriteriaReq;
	}



}