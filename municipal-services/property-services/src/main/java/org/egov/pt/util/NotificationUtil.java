package org.egov.pt.util;


import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.event.*;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.service.UserService;
import org.egov.pt.web.contracts.Email;
import org.egov.pt.web.contracts.EmailRequest;
import org.egov.pt.web.contracts.SMSRequest;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.pt.util.PTConstants.*;


@Slf4j
@Component
public class NotificationUtil {



    private ServiceRequestRepository serviceRequestRepository;

    private PropertyConfiguration config;

    private PropertyProducer producer;

    private RestTemplate restTemplate;

    private UserService userService;


    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Autowired
    public NotificationUtil(ServiceRequestRepository serviceRequestRepository, PropertyConfiguration config,
                            PropertyProducer producer, RestTemplate restTemplate,UserService userService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
        this.producer = producer;
        this.restTemplate = restTemplate;
        this.userService = userService;
    }





    /**
     * Extracts message for the specific code
     *
     * @param notificationCode
     *            The code for which message is required
     * @param localizationMessage
     *            The localization messages
     * @return message for the specific code
     */
    public String getMessageTemplate(String notificationCode, String localizationMessage) {

        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = "";
        try {
            Object messageObj = JsonPath.parse(localizationMessage).read(path);
            message = ((ArrayList<String>) messageObj).get(0);
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }
        return message;
    }



    /**
     * Fetches messages from localization service
     *
     * @param tenantId
     *            tenantId of the PT
     * @param requestInfo
     *            The requestInfo of the request
     * @return Localization messages for the module
     */
    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
    	
        String locale = NOTIFICATION_LOCALE;
        Boolean isRetryNeeded = false;
        String jsonString = null;
        LinkedHashMap responseMap = null;

        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("\\|").length >= 2) {
            locale = requestInfo.getMsgId().split("\\|")[1];
			isRetryNeeded = true;
		}

		responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo, locale), requestInfo).get();
		jsonString = new JSONObject(responseMap).toString();

		if (StringUtils.isEmpty(jsonString) && isRetryNeeded) {

			responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo, NOTIFICATION_LOCALE), requestInfo).get();
			jsonString = new JSONObject(responseMap).toString();
			if(StringUtils.isEmpty(jsonString))
				throw new CustomException("EG_PT_LOCALE_ERROR","Localisation values not found for Property notifications");
		}
		return jsonString;
	}


    /**
     * Returns the uri for the localization call
     *
     * @param tenantId
     *            TenantId of the propertyRequest
     * @return The uri for localization search call
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo, String locale) {

        if (config.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
                .append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(NOTIFICATION_MODULENAME);

        return uri;
    }


    /**
     * Creates sms request for the each owners
     *
     * @param message
     *            The message for the specific tradeLicense
     * @param mobileNumberToOwnerName
     *            Map of mobileNumber to OwnerName
     * @return List of SMSRequest
     */
    public List<SMSRequest> createSMSRequest(String message, Map<String, String> mobileNumberToOwnerName) {
    	
        List<SMSRequest> smsRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToOwnerName.entrySet()) {
            String customizedMsg = message.replace(NOTIFICATION_OWNERNAME, entryset.getValue());
            smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
        }
        return smsRequest;
    }


    /**
     * Send the SMSRequest on the SMSNotification kafka topic
     *
     * @param smsRequestList
     *            The list of SMSRequest to be sent
     */
    public void sendSMS(List<SMSRequest> smsRequestList) {
    	
        if (config.getIsSMSNotificationEnabled()) {
            if (CollectionUtils.isEmpty(smsRequestList))
                log.info("Messages from localization couldn't be fetched!");
            for (SMSRequest smsRequest : smsRequestList) {
                producer.push(config.getSmsNotifTopic(), smsRequest);
                log.info("Sending SMS notification: ");
                log.info("MobileNumber: " + smsRequest.getMobileNumber() + " Messages: " + smsRequest.getMessage());
            }
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
    public Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
    	
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
                Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest).get();
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

    /**
     * Pushes the event request to Kafka Queue.
     *
     * @param request
     */
    public void sendEventNotification(EventRequest request) {
        log.info("EVENT notification sent!");
        producer.push(config.getSaveUserEventsTopic(), request);
    }


    /**
     * Creates email request for the each owners
     *
     * @param message
     *            The message for the specific tradeLicense
     * @param mobileNumberToEmailId
     *            Map of mobileNumber to emailIds
     * @return List of EmailRequest
     */

    public List<EmailRequest> createEmailRequest(RequestInfo requestInfo,String message, Map<String, String> mobileNumberToEmailId) {

        List<EmailRequest> emailRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
            String customizedMsg = message;
            if(message.contains(NOTIFICATION_EMAIL))
                customizedMsg = customizedMsg.replace(NOTIFICATION_EMAIL, entryset.getValue());

            if(StringUtils.isEmpty(entryset.getValue()))
                log.info("Email ID is empty, no notification will be sent ");

            String subject = "";
            String body = customizedMsg;
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(false).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    /**
     * Creates email request for the each owners from SMS requests
     *
     * @param requestInfo
     * @param smsRequests
     *            List of SMS Requests
     * @param tenantId
     * @return List of EmailRequests
     */

    public List<EmailRequest> createEmailRequestFromSMSRequests(RequestInfo requestInfo,List<SMSRequest> smsRequests,String tenantId) {
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mobileNumberToEmailId = fetchUserEmailIds(mobileNumbers, requestInfo, tenantId);
        if (CollectionUtils.isEmpty(mobileNumberToEmailId.keySet())) {
            log.error("Email Ids Not found for Mobilenumbers");
        }

        Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
        List<EmailRequest> emailRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
            String message = mobileNumberToMsg.get(entryset.getKey());
            String customizedMsg = message;

            if(message.contains(NOTIFICATION_EMAIL))
                customizedMsg = customizedMsg.replace(NOTIFICATION_EMAIL, entryset.getValue());

            //removing lines to match Email Templates
            if(message.contains(PT_TAX_PARTIAL))
                customizedMsg = customizedMsg.replace(PT_TAX_PARTIAL,"");

            if(message.contains(PT_TAX_FULL))
                customizedMsg = customizedMsg.replace(PT_TAX_FULL,"");

            String subject = "";
            String body = customizedMsg;
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(false).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    /**
     * Send the EmailRequest on the EmailNotification kafka topic
     *
     * @param emailRequestList
     *            The list of EmailRequest to be sent
     */
    public void sendEmail(List < EmailRequest > emailRequestList) {

        if (config.getIsEmailNotificationEnabled()) {
            if (CollectionUtils.isEmpty(emailRequestList))
                log.info("Messages from localization couldn't be fetched!");
            for (EmailRequest emailRequest: emailRequestList) {
                if (!StringUtils.isEmpty(emailRequest.getEmail().getBody())) {
                    producer.push(config.getEmailNotifTopic(), emailRequest);
                    log.info("Sending EMAIL notification! ");
                    log.info("Email Id: " + emailRequest.getEmail().toString());
                } else {
                    log.info("Email body is empty, hence no email notification will be sent.");
                }
            }

        }
    }

    /**
     * Fetches email ids of CITIZENs based on the phone number.
     *
     * @param mobileNumbers
     * @param requestInfo
     * @param tenantId
     * @return
     */

    public Map<String, String> fetchUserEmailIds(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
        Map<String, String> mapOfPhnoAndEmailIds = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", "CITIZEN");
        for(String mobileNo: mobileNumbers) {
            userSearchRequest.put("userName", mobileNo);
            try {
                Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest).get();
                if(null != user) {
                    if(JsonPath.read(user, "$.user[0].emailId")!=null) {
                        String email = JsonPath.read(user, "$.user[0].emailId");
                    mapOfPhnoAndEmailIds.put(mobileNo, email);
                    }
                }else {
                    log.error("Service returned null while fetching user for username - "+mobileNo);
                }
            }catch(Exception e) {
                log.error("Exception while fetching user for username - "+mobileNo);
                log.error("Exception trace: ",e);
                continue;
            }
        }
        return mapOfPhnoAndEmailIds;
    }
    /**
     * Method to shortent the url
     * returns the same url if shortening fails 
     * @param url
     */
    public String getShortenedUrl(String url){
    	
        HashMap<String,String> body = new HashMap<>();
        body.put("url",url);
        StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
        builder.append(config.getUrlShortnerEndpoint());
        String res = restTemplate.postForObject(builder.toString(), body, String.class);

        if(StringUtils.isEmpty(res)){
            log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+url); ;
            return url;
        }
        else return res;
    }
    
    /**
    *
    * @param requestInfo
    * @param smsRequests
    */
   public List<Event> enrichEvent(List<SMSRequest> smsRequests, RequestInfo requestInfo, String tenantId, Property property, Boolean isActionReq){

		List<Event> events = new ArrayList<>();
       Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
       Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();

       for(String mobileNumber:mobileNumbers) {
           UserDetailResponse userDetailResponse = fetchUserByUUID(mobileNumber, requestInfo, property.getTenantId());
           try
           {
               OwnerInfo user= (OwnerInfo) userDetailResponse.getUser().get(0);
               mapOfPhnoAndUUIDs.put(user.getMobileNumber(),user.getUuid());
           }
           catch(Exception e) {
               log.error("Exception while fetching user object: ",e);
           }
       }

       if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
           log.error("UUIDs Not found for Mobilenumbers");
       }

       Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
       mobileNumbers.forEach(mobileNumber -> {
       	
           List<String> toUsers = new ArrayList<>();
           toUsers.add(mapOfPhnoAndUUIDs.get(mobileNumber));
           Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();

           Action action = null;
           if(isActionReq){
               List<ActionItem> items = new ArrayList<>();
               String msg = smsRequests.get(0).getMessage();
               String actionLink = "";
               if(msg.contains(PT_CORRECTION_PENDING)){
            	   
					String url = config.getUserEventViewPropertyLink();
					if (property.getCreationReason().equals(CreationReason.MUTATION)) {
						url = config.getUserEventViewMutationLink();
					}
					
                   actionLink = url.replace("$mobileNo", mobileNumber)
                           .replace("$tenantId", tenantId)
                           .replace("$propertyId" , property.getPropertyId())
                           .replace("$applicationNumber" , property.getAcknowldgementNumber());

                   actionLink = config.getUiAppHost() + actionLink;
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(VIEW_APPLICATION_CODE).build();
                   items.add(item);
               }

               if(msg.contains(ASMT_USER_EVENT_PAY)){
                   actionLink = config.getPayLink().replace("$mobile", mobileNumber)
                           .replace("$propertyId", property.getPropertyId())
                           .replace("$tenantId", property.getTenantId())
                           .replace("$businessService" , PT_BUSINESSSERVICE);

                   actionLink = config.getUiAppHost() + actionLink;
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
                   items.add(item);
               }
               if(msg.contains(PT_ALTERNATE_NUMBER) || msg.contains(PT_OLD_MOBILENUMBER) || msg.contains(VIEW_PROPERTY)){
                   actionLink = config.getViewPropertyLink()
                           .replace(NOTIFICATION_PROPERTYID, property.getPropertyId())
                           .replace(NOTIFICATION_TENANTID, property.getTenantId());

                   actionLink = config.getUiAppHost() + actionLink;
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(VIEW_PROPERTY_CODE).build();
                   items.add(item);
               }

               if(msg.contains(TRACK_APPLICATION)){
                   actionLink = config.getViewPropertyLink()
                           .replace(NOTIFICATION_PROPERTYID, property.getPropertyId())
                           .replace(NOTIFICATION_TENANTID, property.getTenantId());

                   actionLink = config.getUiAppHost() + actionLink;
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(VIEW_PROPERTY_CODE).build();
                   items.add(item);
               }

               if(msg.contains(TRACK_APPLICATION) && msg.contains("{MTURL}")){
                   actionLink = getMutationUrl(property);
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(TRACK_APPLICATION_CODE).build();
                   items.add(item);
               }

               if(msg.contains(NOTIFICATION_PAY_LINK)){
                   actionLink = getPayUrl(property);
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(NOTIFICATION_PAY_LINK).build();
                   items.add(item);
               }

               if(msg.contains(MT_RECEIPT_STRING))
               {
                   actionLink = getMutationUrl(property);
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(DOWNLOAD_MUTATION_RECEIPT_CODE).build();
                   items.add(item);
               }

               if(msg.contains(MT_CERTIFICATE_STRING))
               {
                   actionLink = getMutationUrl(property);
                   ActionItem item = ActionItem.builder().actionUrl(actionLink).code(DOWNLOAD_MUTATION_CERTIFICATE_CODE).build();
                   items.add(item);
               }

                       action = Action.builder().actionUrls(items).build();
           }

           String description = removeForInAppMessage(mobileNumberToMsg.get(mobileNumber));
           events.add(Event.builder().tenantId(tenantId).description(description)
                   .eventType(USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
                   .postedBy(USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                   .eventDetails(null).actions(action).build());

		});
		return events;
	}

    /**
     * Method to remove certain lines from SMS templates
     * so that we can reuse the templates for in app notifications
     * returns the message minus some lines to match In App Templates
     * @param message
     */
    private String removeForInAppMessage(String message)
    {
        if(message.contains(TRACK_APPLICATION_STRING))
            message = message.replace(TRACK_APPLICATION_STRING,"");
        if(message.contains(VIEW_PROPERTY_STRING))
            message = message.replace(VIEW_PROPERTY_STRING,"");
        if(message.contains(PAY_ONLINE_STRING))
            message = message.replace(PAY_ONLINE_STRING,"");
        if(message.contains(PT_ONLINE_STRING))
            message = message.replace(PT_ONLINE_STRING,"");

        //mutation notification
        if(message.contains(MT_TRACK_APPLICATION_STRING))
            message = message.replace(MT_TRACK_APPLICATION_STRING,"");
        if(message.contains(MT_PAYLINK_STRING))
            message = message.replace(MT_PAYLINK_STRING,"");
        if(message.contains(MT_CERTIFICATE_STRING))
            message = message.replace(MT_CERTIFICATE_STRING,"");
        if(message.contains(MT_RECEIPT_STRING))
            message = message.replace(MT_RECEIPT_STRING,"");

        return message;
    }

    /**
     * Method to fetch the list of channels for a particular action from mdms configd
     * from mdms configs
     * returns the message minus some lines to match In App Templates
     * @param requestInfo
     * @param tenantId
     * @param moduleName
     * @param action
     */
    public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){
        List<String> masterData = new ArrayList<>();
        StringBuilder uri = new StringBuilder();
        uri.append(mdmsHost).append(mdmsUrl);
        if(StringUtils.isEmpty(tenantId))
            return masterData;
        MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

        Filter masterDataFilter = filter(
                where(MODULE).is(moduleName).and(ACTION).is(action)
        );

        try {
            Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
            masterData = JsonPath.parse(response).read("$.MdmsRes.Channel.channelList[?].channelNames[*]", masterDataFilter);
        }catch(Exception e) {
            log.error("Exception while fetching workflow states to ignore: ",e);
        }

        return masterData;
    }

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

    /**
     * Prepares and return url for mutation view screen
     *
     * @param property
     * @return
     */
    public String getMutationUrl(Property property) {

        return getShortenedUrl(
                config.getUiAppHost().concat(config.getViewMutationLink()
                        .replace(NOTIFICATION_APPID, property.getAcknowldgementNumber())
                        .replace(NOTIFICATION_TENANTID, property.getTenantId())));
    }

    /**
     * Prepares and return url for property view screen
     *
     * @param property
     * @return
     */
    public String getPayUrl(Property property) {
        return getShortenedUrl(
                config.getUiAppHost().concat(config.getPayLink().replace(EVENT_PAY_BUSINESSSERVICE,MUTATION_BUSINESSSERVICE)
                        .replace(EVENT_PAY_PROPERTYID, property.getAcknowldgementNumber())
                        .replace(EVENT_PAY_TENANTID, property.getTenantId())));
    }

    /**
     * Fetches User Object based on the UUID.
     *
     * @param username - username of User
     * @param requestInfo - Request Info Object
     * @param tenantId - Tenant Id
     * @return - Returns User object with given UUID
     */
    public UserDetailResponse fetchUserByUUID(String username, RequestInfo requestInfo, String tenantId) {
        User userInfoCopy = requestInfo.getUserInfo();

        User userInfo = getInternalMicroserviceUser(tenantId);
        requestInfo.setUserInfo(userInfo);

        UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(tenantId, requestInfo);
        userSearchRequest.setUserName(username);

        UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
        requestInfo.setUserInfo(userInfoCopy);
        return userDetailResponse;
    }

    /**
     *
     * @param tenantId
     * @return internal microservice user to fetch plain user details
     */
    public User getInternalMicroserviceUser(String tenantId)
    {
        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
                .tenantId(tenantId).build();

        //Creating userinfo with uuid and role of internal microservice role
        User userInfo = User.builder()
                .uuid(config.getEgovInternalMicroserviceUserUuid())
                .type("SYSTEM")
                .roles(Collections.singletonList(role)).id(0L).build();

        return userInfo;
    }

}
