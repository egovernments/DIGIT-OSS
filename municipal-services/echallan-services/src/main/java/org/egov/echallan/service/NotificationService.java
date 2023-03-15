package org.egov.echallan.service;


import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.*;
import org.egov.echallan.model.Challan.StatusEnum;
import org.egov.echallan.producer.Producer;
import org.egov.echallan.repository.ServiceRequestRepository;
import org.egov.echallan.util.NotificationUtil;
import org.egov.echallan.web.models.collection.PaymentDetail;
import org.egov.echallan.web.models.collection.PaymentRequest;
import org.egov.echallan.web.models.collection.PaymentResponse;
import org.egov.echallan.web.models.user.User;
import org.egov.echallan.web.models.uservevents.Action;
import org.egov.echallan.web.models.uservevents.ActionItem;
import org.egov.echallan.web.models.uservevents.Event;
import org.egov.echallan.web.models.uservevents.EventRequest;
import org.egov.echallan.web.models.uservevents.Recepient;
import org.egov.echallan.web.models.uservevents.Source;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

import static org.egov.echallan.util.ChallanConstants.*;


@Service
@Slf4j
public class NotificationService {
	private ChallanConfiguration config;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsUrl;
	
	private RestTemplate restTemplate;
	
	private NotificationUtil util;
	
	private Producer producer;
	
	 private ServiceRequestRepository serviceRequestRepository;
	
	private static final String BUSINESSSERVICE_MDMS_MODULE = "BillingService";
	public static final String BUSINESSSERVICE_MDMS_MASTER = "BusinessService";
	public static final String BUSINESSSERVICE_CODES_FILTER = "$.[?(@.type=='Adhoc')].code";
	public static final String BUSINESSSERVICE_CODES_JSONPATH = "$.MdmsRes.BillingService.BusinessService";
	public static final String  USREVENTS_EVENT_TYPE = "SYSTEMGENERATED";
	public static final String  USREVENTS_EVENT_NAME = "Challan";
	public static final String  USREVENTS_EVENT_POSTEDBY = "SYSTEM-CHALLAN";
	
	@Autowired
	public NotificationService(ChallanConfiguration config,RestTemplate restTemplate,NotificationUtil util,Producer producer,ServiceRequestRepository serviceRequestRepository) {
		this.config = config;
		this.restTemplate = restTemplate;
		this.util = util;
		this.producer = producer;
		this.serviceRequestRepository = serviceRequestRepository;
	}
	
	public void sendChallanNotification(ChallanRequest challanRequest,boolean isSave) {
		String action="",code = null;

		if (isSave) {
			action = CREATE_ACTION;
			code = CREATE_CODE;
		} else if (challanRequest.getChallan().getApplicationStatus() == StatusEnum.ACTIVE) {
			action = UPDATE_ACTION;
			code = UPDATE_CODE;
		} else if (challanRequest.getChallan().getApplicationStatus() == StatusEnum.CANCELLED) {
			action = CANCEL_ACTION;
			code = CANCEL_CODE;
		} else if (challanRequest.getChallan().getApplicationStatus() == StatusEnum.PAID) {
			action = PAYMENT_ACTION;
			code = PAYMENT_CODE;
		}

		List<String> configuredChannelNames =  util.fetchChannelList(new RequestInfo(), challanRequest.getChallan().getTenantId(), MCOLLECT_BUSINESSSERVICE, action);
		if(configuredChannelNames.contains(CHANNEL_NAME_SMS)){
			List<SMSRequest> smsRequests = new LinkedList<>();
			if (null != config.getIsSMSEnabled()) {
				if (config.getIsSMSEnabled()) {
					enrichSMSRequest(challanRequest, smsRequests, code);
					if (!CollectionUtils.isEmpty(smsRequests))
						util.sendSMS(smsRequests, config.getIsSMSEnabled());
				}
			}
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)){
			if (null != config.getIsUserEventEnabled()) {
				if (config.getIsUserEventEnabled()) {
					EventRequest eventRequest = getEventsForChallan(challanRequest,isSave);
					if(null != eventRequest)
						util.sendEventNotification(eventRequest);
				}
			}
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)){
			List<EmailRequest> emailRequests = new LinkedList<>();
			if (null != config.getIsEmailNotificationEnabled()) {
				if (config.getIsEmailNotificationEnabled()) {
					enrichEmailRequest(challanRequest, emailRequests, code.replace(".sms",".email"));
					if (!CollectionUtils.isEmpty(emailRequests))
						util.sendEmail(emailRequests);
				}
			}
		}
	}

	private EventRequest getEventsForChallan(ChallanRequest request,boolean isSave) {
    	List<Event> events = new ArrayList<>();
 		Challan challan = request.getChallan();
		String message="";
		if(isSave)
			message = util.getCustomizedMsg(request.getRequestInfo(), challan ,CREATE_CODE_INAPP);
		else if(challan.getApplicationStatus()==StatusEnum.ACTIVE)
			message = util.getCustomizedMsg(request.getRequestInfo(),challan, UPDATE_CODE_INAPP);
		else if(challan.getApplicationStatus()==StatusEnum.CANCELLED)
			message = util.getCustomizedMsg(request.getRequestInfo(),challan, CANCEL_CODE_INAPP );
		else if(challan.getApplicationStatus()==StatusEnum.PAID)
			message = util.getCustomizedMsg(request.getRequestInfo(),challan, PAYMENT_CODE_INAPP );


        Map<String,String > mobileNumberToOwner = new HashMap<>();
        String mobile = challan.getCitizen().getMobileNumber();
        if(mobile!=null)
             mobileNumberToOwner.put(mobile,challan.getCitizen().getName());
        
        Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobile, request.getRequestInfo(), request.getChallan().getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet()))
            return null;
    		
    	List<String> toUsers = new ArrayList<>();
    	toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
    	Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
    	List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
    	Action action = null;
    	if(payTriggerList.contains(challan.getApplicationStatus().toString())) {
           List<ActionItem> items = new ArrayList<>();
           String actionLink = config.getPayLink().replace("$mobile", mobile)
        						.replace("$applicationNo", challan.getChallanNo())
        						.replace("$tenantId", challan.getTenantId())
        						.replace("$businessService", challan.getBusinessService());
           actionLink = config.getUiAppHost() + actionLink;
           ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
           items.add(item);
           action = Action.builder().actionUrls(items).build();
    	}
		if(challan.getApplicationStatus()==StatusEnum.PAID) {
			List<ActionItem> items = new ArrayList<>();
			PaymentResponse paymentResponse = util.getPaymentObject(request);
			String actionLink = util.getRecepitDownloadLink(request,paymentResponse,mobile);
			ActionItem item = ActionItem.builder().actionUrl(actionLink).code(DOWNLOAD_RECEIPT_CODE).build();
			items.add(item);
			action = Action.builder().actionUrls(items).build();
		}

    	events.add(Event.builder().tenantId(challan.getTenantId()).description(message)
						.eventType(USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
						.postedBy(USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
    					.eventDetails(null).actions(action).build());
        if(!CollectionUtils.isEmpty(events)) {
    		return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
        }else {
        	return null;
        }
    	
		
    }
	

	private List<String> fetchBusinessServiceFromMDMS(RequestInfo requestInfo, String tenantId){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsUrl);
		if(StringUtils.isEmpty(tenantId))
			return masterData;
		MdmsCriteriaReq request = getRequestForEvents(requestInfo, tenantId.split("\\.")[0]);
		try {
			Object response = restTemplate.postForObject(uri.toString(), request, Map.class);
			masterData = JsonPath.read(response, BUSINESSSERVICE_CODES_JSONPATH);
		}catch(Exception e) {
			log.error("Exception while fetching business service codes: ",e);
		}
		return masterData;
	}
	
	
	private MdmsCriteriaReq getRequestForEvents(RequestInfo requestInfo, String tenantId) {
		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder()
				.name(BUSINESSSERVICE_MDMS_MASTER).filter(BUSINESSSERVICE_CODES_FILTER).build();
		List<MasterDetail> masterDetails = new ArrayList<>();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(BUSINESSSERVICE_MDMS_MODULE)
				.masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}
	
	private Map<String, String> fetchUserUUIDs(String mobileNumber, RequestInfo requestInfo, String tenantId) {
    	Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();
    	StringBuilder uri = new StringBuilder();
    	uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
    	Map<String, Object> userSearchRequest = new HashMap<>();
    	userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
    	userSearchRequest.put("userName", mobileNumber);
    	try {
    		Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
    		if(null != user) {
    			List<User> users = JsonPath.read(user, "$.user");
    			if(users.size()!=0) {
    			String uuid = JsonPath.read(user, "$.user[0].uuid");
    			mapOfPhnoAndUUIDs.put(mobileNumber, uuid);
    			}
    		}else {
        		log.error("Service returned null while fetching user for username - "+mobileNumber);
    		}
    	}catch(Exception e) {
    		log.error("Exception while fetching user for username - "+mobileNumber);
    		log.error("Exception trace: ",e);
    	}
    	return mapOfPhnoAndUUIDs;
    }

	/**
	 * Enriches the smsRequest with the customized messages
	 *
	 * @param challanRequest
	 *            The challanRequest
	 * @param smsRequestslist
	 *            List of SMSRequets
	 * @param code
	 *            Notification Template Code
	 */
	private void enrichSMSRequest(ChallanRequest challanRequest, List<SMSRequest> smsRequestslist, String code) {
		String message = util.getCustomizedMsg(challanRequest.getRequestInfo(), challanRequest.getChallan(), code);
		String mobilenumber = challanRequest.getChallan().getCitizen().getMobileNumber();

		if (message != null && !StringUtils.isEmpty(message)) {
			SMSRequest smsRequest = SMSRequest.builder().
					mobileNumber(mobilenumber).
					message(message).build();
			smsRequestslist.add(smsRequest);
		} else {
			log.error("No message configured! Notification will not be sent.");
		}
	}
		/**
		 * Enriches the emailRequests with the customized messages
		 *
		 * @param challanRequest
		 *            The challanRequest
		 * @param emailRequestList
		 *            List of EmailRequests
		 * @param code
		 *            Notification Template Code
		 */
		private void enrichEmailRequest(ChallanRequest challanRequest, List<EmailRequest> emailRequestList, String code) {
			Set<String> mobileNumbers = new HashSet<>();
			String mobilenumber = challanRequest.getChallan().getCitizen().getMobileNumber();

			mobileNumbers.add(mobilenumber);
			Map<String, String> mapOfPhnoAndEmail = util.fetchUserEmailIds(mobileNumbers, challanRequest.getRequestInfo(), challanRequest.getChallan().getTenantId());

			if(challanRequest.getChallan().getCitizen().getEmail()!=null && !StringUtils.isEmpty(challanRequest.getChallan().getCitizen().getEmail()) )
				mapOfPhnoAndEmail.put(mobilenumber, challanRequest.getChallan().getCitizen().getEmail());

			String message = util.getEmailCustomizedMsg(challanRequest.getRequestInfo(), challanRequest.getChallan(), code);

			if (message!=null && !StringUtils.isEmpty(message)) {
				String subject = message.substring(message.indexOf("<h2>")+4,message.indexOf("</h2>"));
				String body = message.substring(message.indexOf("</h2>")+5);
				Email emailobj=null;
				EmailRequest email = null;
				if(mapOfPhnoAndEmail.get(mobilenumber)!=null) {
					emailobj = Email.builder().emailTo(Collections.singleton(mapOfPhnoAndEmail.get(mobilenumber))).isHTML(true).body(body).subject(subject).build();
					email = new EmailRequest(challanRequest.getRequestInfo(),emailobj);
					emailRequestList.add(email);
				}
				else
				{
					log.error("No email for username - "+mobilenumber);
				}
			} else {
				log.error("No message configured! Notification will not be sent.");
			}
	}
	

}