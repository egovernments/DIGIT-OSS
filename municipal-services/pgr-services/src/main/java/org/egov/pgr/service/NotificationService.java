package org.egov.pgr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.repository.ServiceRequestRepository;
import org.egov.pgr.util.HRMSUtil;
import org.egov.pgr.util.MDMSUtils;
import org.egov.pgr.util.NotificationUtil;
import org.egov.pgr.web.models.Notification.*;
import org.egov.pgr.web.models.ServiceWrapper;
import org.egov.pgr.web.models.RequestInfoWrapper;
import org.egov.pgr.web.models.ServiceRequest;
import org.egov.pgr.web.models.workflow.ProcessInstance;
import org.egov.pgr.web.models.workflow.ProcessInstanceResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.egov.pgr.util.PGRConstants.*;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private PGRConfiguration config;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private MDMSUtils mdmsUtils;

    @Autowired
    private HRMSUtil hrmsUtils;

    @Autowired
    private ObjectMapper mapper;

    public void process(ServiceRequest request, String topic) {
        try {
            ServiceWrapper serviceWrapper = ServiceWrapper.builder().service(request.getService()).workflow(request.getWorkflow()).build();
            String applicationStatus = request.getService().getApplicationStatus();
            String action = request.getWorkflow().getAction();

            if (!(NOTIFICATION_ENABLE_FOR_STATUS.contains(action+"_"+applicationStatus))) {
                log.info("Notification Disabled For State :" + applicationStatus);
                return;
            }

            Map<String, List<String>> finalMessage = getFinalMessage(request, topic, applicationStatus);
            String citizenMobileNumber = request.getService().getCitizen().getMobileNumber();
            String employeeMobileNumber = null;

            if(applicationStatus.equalsIgnoreCase(PENDINGFORASSIGNMENT) && action.equalsIgnoreCase(PGR_WF_REOPEN)) {
                ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);
                employeeMobileNumber = processInstance.getAssignes().get(0).getMobileNumber();
            }
            else if(applicationStatus.equalsIgnoreCase(PENDINGFORASSIGNMENT) && action.equalsIgnoreCase(APPLY)) {
                employeeMobileNumber = null;
            }
            else if(applicationStatus.equalsIgnoreCase(REJECTED) && action.equalsIgnoreCase(REJECT)) {
                employeeMobileNumber = null;
            }
            else  if (applicationStatus.equalsIgnoreCase(RESOLVED)  && action.equalsIgnoreCase(PGR_WF_RESOLVE)){
                ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);
                employeeMobileNumber = processInstance.getAssignes().get(0).getMobileNumber();
            }
            else  if ((applicationStatus.equalsIgnoreCase(CLOSED_AFTER_RESOLUTION) || applicationStatus.equalsIgnoreCase(CLOSED_AFTER_REJECTION)) && action.equalsIgnoreCase(RATE)) {
                ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);
                employeeMobileNumber = processInstance.getAssignes().get(0).getMobileNumber();
            }
            else if ((applicationStatus.equalsIgnoreCase(PENDINGATLME) && action.equalsIgnoreCase(ASSIGN)) || (applicationStatus.equalsIgnoreCase(PENDING_FOR_REASSIGNMENT) && action.equalsIgnoreCase(REASSIGN))){
                employeeMobileNumber = fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getMobileNumber();
            }
            else if(applicationStatus.equalsIgnoreCase(PENDINGATLME) && action.equalsIgnoreCase(REASSIGN))
            {
                employeeMobileNumber = fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getMobileNumber();
            }
            else {
                employeeMobileNumber = fetchUserByUUID(request.getService().getAuditDetails().getCreatedBy(), request.getRequestInfo(), request.getService().getTenantId()).getMobileNumber();
            }

            if(!StringUtils.isEmpty(finalMessage)){
                if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
                    for (Map.Entry<String,List<String>> entry : finalMessage.entrySet()) {
                        for(String msg : entry.getValue()) {
                            EventRequest eventRequest = enrichEventRequest(request, msg);
                            if (eventRequest != null) {
                                notificationUtil.sendEventNotification(eventRequest);
                            }
                        }
                    }
                }

                if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
                    for (Map.Entry<String,List<String>> entry : finalMessage.entrySet()) {

                        if(entry.getKey().equalsIgnoreCase(CITIZEN)) {
                            for(String msg : entry.getValue()) {
                                List<SMSRequest> smsRequests = new ArrayList<>();
                                smsRequests = enrichSmsRequest(citizenMobileNumber, msg);
                                if (!CollectionUtils.isEmpty(smsRequests)) {
                                    notificationUtil.sendSMS(smsRequests);
                                }
                            }
                        }
                        else {
                            for(String msg : entry.getValue()) {
                                List<SMSRequest> smsRequests = new ArrayList<>();
                                smsRequests = enrichSmsRequest(employeeMobileNumber, msg);
                                if (!CollectionUtils.isEmpty(smsRequests)) {
                                    notificationUtil.sendSMS(smsRequests);
                                }
                            }
                        }
                    }
                }

            }




        } catch (Exception ex) {
            log.error("Error occured while processing the record from topic : " + topic, ex);
        }
    }

    /**
     *
     * @param request PGR Request
     * @param topic Topic Name
     * @param applicationStatus Application Status
     * @return Returns list of SMSRequest
     */
    private Map<String, List<String>> getFinalMessage(ServiceRequest request, String topic, String applicationStatus) {
        String tenantId = request.getService().getTenantId();
        String localizationMessage = notificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo(),PGR_MODULE);

        ServiceWrapper serviceWrapper = ServiceWrapper.builder().service(request.getService()).workflow(request.getWorkflow()).build();
        Map<String, List<String>> message = new HashMap<>();

        String messageForCitizen = null;
        String messageForEmployee = null;
        String defaultMessage = null;

        String localisedStatus = notificationUtil.getCustomizedMsgForPlaceholder(localizationMessage,"CS_COMMON_"+serviceWrapper.getService().getApplicationStatus());

        /**
         * Confirmation SMS to citizens, when they will raise any complaint
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDINGFORASSIGNMENT) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(APPLY)) {
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);
        }

        /**
         * SMS to citizens and employee both, when a complaint is assigned to an employee
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDINGATLME) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(ASSIGN)) {
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            messageForEmployee = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, EMPLOYEE, localizationMessage);
            if (messageForEmployee == null) {
                log.info("No message Found For Employee On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);


            Map<String, String> reassigneeDetails  = getHRMSEmployee(request);

            if (messageForCitizen.contains("{emp_department}"))
                messageForCitizen = messageForCitizen.replace("{emp_department}",reassigneeDetails.get(DEPARTMENT));

            if (messageForCitizen.contains("{emp_designation}"))
                messageForCitizen = messageForCitizen.replace("{emp_designation}",reassigneeDetails.get(DESIGNATION));

            if (messageForCitizen.contains("{emp_name}"))
                messageForCitizen = messageForCitizen.replace("{emp_name}", fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ulb}")) {
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String localisedULB = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,serviceWrapper.getService().getAddress().getDistrict());
                messageForEmployee = messageForEmployee.replace("{ulb}",localisedULB);
            }

            if (messageForEmployee.contains("{emp_name}"))
                messageForEmployee = messageForEmployee.replace("{emp_name}", fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ao_designation}")){
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String path = "$..messages[?(@.code==\"COMMON_MASTERS_DESIGNATION_AO\")].message";

                try {
                    ArrayList<String> messageObj = JsonPath.parse(localisationMessageForPlaceholder).read(path);
                    if(messageObj != null && messageObj.size() > 0) {
                        messageForEmployee = messageForEmployee.replace("{ao_designation}", messageObj.get(0));
                    }
                } catch (Exception e) {
                    log.warn("Fetching from localization failed", e);
                }
            }
        }

        /**
         * SMS to citizens and employee, when the complaint is re-assigned to an employee
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDING_FOR_REASSIGNMENT) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(REASSIGN)){
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            messageForEmployee = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, EMPLOYEE, localizationMessage);
            if (messageForEmployee == null) {
                log.info("No message Found For Employee On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);


            Map<String, String> reassigneeDetails  = getHRMSEmployee(request);
            if (messageForCitizen.contains("{emp_department}"))
                messageForCitizen = messageForCitizen.replace("{emp_department}",reassigneeDetails.get(DEPARTMENT));

            if (messageForCitizen.contains("{emp_designation}"))
                messageForCitizen = messageForCitizen.replace("{emp_designation}",reassigneeDetails.get(DESIGNATION));

            if (messageForCitizen.contains("{emp_name}"))
                messageForCitizen = messageForCitizen.replace("{emp_name}", fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ulb}")) {
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String localisedULB = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,serviceWrapper.getService().getAddress().getDistrict());
                messageForEmployee = messageForEmployee.replace("{ulb}",localisedULB);
            }

            if (messageForEmployee.contains("{emp_name}"))
                messageForEmployee = messageForEmployee.replace("{emp_name}", fetchUserByUUID(request.getRequestInfo().getUserInfo().getUuid(), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ao_designation}")){
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String path = "$..messages[?(@.code==\"COMMON_MASTERS_DESIGNATION_AO\")].message";

                try {
                    ArrayList<String> messageObj = JsonPath.parse(localisationMessageForPlaceholder).read(path);
                    if(messageObj != null && messageObj.size() > 0) {
                        messageForEmployee = messageForEmployee.replace("{ao_designation}", messageObj.get(0));
                    }
                } catch (Exception e) {
                    log.warn("Fetching from localization failed", e);
                }
            }
        }

        /**
         * SMS to citizens, when complaint got rejected with reason
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(REJECTED) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(REJECT)) {
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);

            if (messageForCitizen.contains("{additional_comments}"))
                messageForCitizen = messageForCitizen.replace("{additional_comments}", serviceWrapper.getWorkflow().getComments());
        }

        /**
         * SMS to citizens and employee, when the complaint has been re-opened on citizen request
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDINGFORASSIGNMENT) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(PGR_WF_REOPEN)) {
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            messageForEmployee = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, EMPLOYEE, localizationMessage);
            if (messageForEmployee == null) {
                log.info("No message Found For Employee On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);

            if(messageForEmployee.contains("{ulb}")) {
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String localisedULB = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,serviceWrapper.getService().getAddress().getDistrict());
                messageForEmployee = messageForEmployee.replace("{ulb}",localisedULB);
            }

            if (messageForEmployee.contains("{emp_name}"))
                messageForEmployee = messageForEmployee.replace("{emp_name}", processInstance.getAssignes().get(0).getName());
        }

        /**
         * SMS to citizens, when complaint got resolved
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(RESOLVED) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(PGR_WF_RESOLVE)) {
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);

            if (messageForCitizen.contains("{emp_name}"))
                messageForCitizen = messageForCitizen.replace("{emp_name}", processInstance.getAssignes().get(0).getName());
        }

        /**
         * SMS to citizens and employee, when the complaint has been re-opened on citizen request
         */
        if((serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(CLOSED_AFTER_RESOLUTION) ||
                serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(CLOSED_AFTER_REJECTION)) &&
                serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(RATE)) {
            messageForEmployee = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, EMPLOYEE, localizationMessage);
            if (messageForEmployee == null) {
                log.info("No message Found For Employee On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),ASSIGN);

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);


            if(messageForEmployee.contains("{rating}"))
                messageForEmployee=messageForEmployee.replace("{rating}",serviceWrapper.getService().getRating().toString());

            if (messageForEmployee.contains("{emp_name}"))
                messageForEmployee = messageForEmployee.replace("{emp_name}", processInstance.getAssignes().get(0).getName());
        }

        /**
         * SMS to citizens and employee, when the complaint is re-assigned to LME
         */
        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDINGATLME) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(REASSIGN)){
            messageForCitizen = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, CITIZEN, localizationMessage);
            if (messageForCitizen == null) {
                log.info("No message Found For Citizen On Topic : " + topic);
                return null;
            }

            messageForEmployee = notificationUtil.getCustomizedMsg(request.getWorkflow().getAction(), applicationStatus, EMPLOYEE, localizationMessage);
            if (messageForEmployee == null) {
                log.info("No message Found For Employee On Topic : " + topic);
                return null;
            }

            defaultMessage = notificationUtil.getDefaultMsg(CITIZEN, localizationMessage);
            if (defaultMessage == null) {
                log.info("No default message Found For Topic : " + topic);
                return null;
            }

            if(defaultMessage.contains("{status}"))
                defaultMessage = defaultMessage.replace("{status}", localisedStatus);


            Map<String, String> reassigneeDetails  = getHRMSEmployee(request);
            if (messageForCitizen.contains("{emp_department}"))
                messageForCitizen = messageForCitizen.replace("{emp_department}",reassigneeDetails.get(DEPARTMENT));

            if (messageForCitizen.contains("{emp_designation}"))
                messageForCitizen = messageForCitizen.replace("{emp_designation}",reassigneeDetails.get(DESIGNATION));

            if (messageForCitizen.contains("{emp_name}"))
                messageForCitizen = messageForCitizen.replace("{emp_name}", fetchUserByUUID(request.getWorkflow().getAssignes().get(0), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ulb}")) {
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String localisedULB = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,serviceWrapper.getService().getAddress().getDistrict());
                messageForEmployee = messageForEmployee.replace("{ulb}",localisedULB);
            }

            if (messageForEmployee.contains("{emp_name}"))
                messageForEmployee = messageForEmployee.replace("{emp_name}", fetchUserByUUID(request.getRequestInfo().getUserInfo().getUuid(), request.getRequestInfo(), request.getService().getTenantId()).getName());

            if(messageForEmployee.contains("{ao_designation}")){
                String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
                String path = "$..messages[?(@.code==\"COMMON_MASTERS_DESIGNATION_AO\")].message";

                try {
                    ArrayList<String> messageObj = JsonPath.parse(localisationMessageForPlaceholder).read(path);
                    if(messageObj != null && messageObj.size() > 0) {
                        messageForEmployee = messageForEmployee.replace("{ao_designation}", messageObj.get(0));
                    }
                } catch (Exception e) {
                    log.warn("Fetching from localization failed", e);
                }
            }
        }


        String localisedComplaint = notificationUtil.getCustomizedMsgForPlaceholder(localizationMessage,"pgr.complaint.category."+request.getService().getServiceCode());

        Long createdTime = serviceWrapper.getService().getAuditDetails().getCreatedTime();
        LocalDate date = Instant.ofEpochMilli(createdTime > 10 ? createdTime : createdTime * 1000)
                .atZone(ZoneId.systemDefault()).toLocalDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN);

        String appLink = notificationUtil.getShortnerURL(config.getMobileDownloadLink());

        if(messageForCitizen != null) {
            messageForCitizen = messageForCitizen.replace("{complaint_type}", localisedComplaint);
            messageForCitizen = messageForCitizen.replace("{id}", serviceWrapper.getService().getServiceRequestId());
            messageForCitizen = messageForCitizen.replace("{date}", date.format(formatter));
            messageForCitizen = messageForCitizen.replace("{download_link}", appLink);
        }

        if(messageForEmployee != null) {
            messageForEmployee = messageForEmployee.replace("{complaint_type}", localisedComplaint);
            messageForEmployee = messageForEmployee.replace("{id}", serviceWrapper.getService().getServiceRequestId());
            messageForEmployee = messageForEmployee.replace("{date}", date.format(formatter));
            messageForEmployee = messageForEmployee.replace("{download_link}", appLink);
        }

        message.put(CITIZEN, Arrays.asList(new String[] {messageForCitizen, defaultMessage}));
        message.put(EMPLOYEE, Arrays.asList(messageForEmployee));

        return message;
    }

    /**
     * Fetches User Object based on the UUID.
     *
     * @param uuidstring - UUID of User
     * @param requestInfo - Request Info Object
     * @param tenantId - Tenant Id
     * @return - Returns User object with given UUID
     */
    public User fetchUserByUUID(String uuidstring, RequestInfo requestInfo, String tenantId) {
        User userInfoCopy = requestInfo.getUserInfo();

        User userInfo = getInternalMicroserviceUser(tenantId);

        requestInfo.setUserInfo(userInfo);

        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", "EMPLOYEE");
        Set<String> uuid = new HashSet<>() ;
        uuid.add(uuidstring);
        userSearchRequest.put("uuid", uuid);
        User user = null;
        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);
            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            String dobFormat = "yyyy-MM-dd";
            parseResponse(responseMap,dobFormat);
            user = 	mapper.convertValue(users.get(0), User.class);

        }catch(Exception e) {
            log.error("Exception while trying parse user object: ",e);
        }

        requestInfo.setUserInfo(userInfoCopy);
        return user;
    }

    /**
     * Parses date formats to long for all users in responseMap
     * @param responeMap LinkedHashMap got from user api response
     */
    private void parseResponse(LinkedHashMap responeMap,String dobFormat){
        List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
        String formatForDate = "dd-MM-yyyy HH:mm:ss";
        if(users!=null){
            users.forEach( map -> {
                        map.put("createdDate",dateTolong((String)map.get("createdDate"),formatForDate));
                        if((String)map.get("lastModifiedDate")!=null)
                            map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),formatForDate));
                        if((String)map.get("dob")!=null)
                            map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
                        if((String)map.get("pwdExpiryDate")!=null)
                            map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),formatForDate));
                    }
            );
        }
    }

    /**
     * Converts date to long
     * @param date date to be parsed
     * @param format Format of the date
     * @return Long value of date
     */
    private Long dateTolong(String date,String format){
        SimpleDateFormat simpleDateFormatObject = new SimpleDateFormat(format);
        Date returnDate = null;
        try {
            returnDate = simpleDateFormatObject.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  returnDate.getTime();
    }

    public ProcessInstance getEmployeeName(String tenantId, String serviceRequestId, RequestInfo requestInfo,String action){
        ProcessInstance processInstanceToReturn = new ProcessInstance();
        User userInfoCopy = requestInfo.getUserInfo();

        User userInfo = getInternalMicroserviceUser(tenantId);

        requestInfo.setUserInfo(userInfo);

        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
        StringBuilder URL = workflowService.getprocessInstanceSearchURL(tenantId,serviceRequestId);
        URL.append("&").append("history=true");

        Object result = serviceRequestRepository.fetchResult(URL, requestInfoWrapper);
        ProcessInstanceResponse processInstanceResponse = null;
        try {
            processInstanceResponse = mapper.convertValue(result, ProcessInstanceResponse.class);
        } catch (IllegalArgumentException e) {
            throw new CustomException("PARSING ERROR", "Failed to parse response of workflow processInstance search");
        }
        if (CollectionUtils.isEmpty(processInstanceResponse.getProcessInstances()))
            throw new CustomException("WORKFLOW_NOT_FOUND", "The workflow object is not found");

        for(ProcessInstance processInstance:processInstanceResponse.getProcessInstances()){
            if(processInstance.getAction().equalsIgnoreCase(action))
                processInstanceToReturn= processInstance;
        }
        requestInfo.setUserInfo(userInfoCopy);
        return processInstanceToReturn;
    }

    public String getDepartment(ServiceRequest request){
        Object mdmsData = mdmsUtils.mDMSCall(request);
        String serviceCode = request.getService().getServiceCode();
        String jsonPath = MDMS_SERVICEDEF_SEARCH.replace("{SERVICEDEF}",serviceCode);

        List<Object> res = null;

        try{
            res = JsonPath.read(mdmsData,jsonPath);
        }
        catch (Exception e){
            throw new CustomException("JSONPATH_ERROR","Failed to parse mdms response");
        }

        if(CollectionUtils.isEmpty(res))
            throw new CustomException("INVALID_SERVICECODE","The service code: "+serviceCode+" is not present in MDMS");

        return res.get(0).toString();

    }

    public Map<String, String> getHRMSEmployee(ServiceRequest request){
        Map<String, String> reassigneeDetails = new HashMap<>();
        List<String> mdmsDepartmentList = null;
        List<String> hrmsDepartmentList = null;
        List<String> designation = null;
        List<String> employeeName = null;
        String departmentFromMDMS;

        String localisationMessageForPlaceholder =  notificationUtil.getLocalizationMessages(request.getService().getTenantId(), request.getRequestInfo(),COMMON_MODULE);
        //HRSMS CALL
        StringBuilder url = hrmsUtils.getHRMSURI(request.getWorkflow().getAssignes());
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(request.getRequestInfo()).build();
        Object response = serviceRequestRepository.fetchResult(url, requestInfoWrapper);

        //MDMS CALL
        Object mdmsData = mdmsUtils.mDMSCall(request);
        String jsonPath = MDMS_DEPARTMENT_SEARCH.replace("{SERVICEDEF}",request.getService().getServiceCode());

        try{
            mdmsDepartmentList = JsonPath.read(mdmsData,jsonPath);
            hrmsDepartmentList = JsonPath.read(response, HRMS_DEPARTMENT_JSONPATH);
        }
        catch (Exception e){
            throw new CustomException("JSONPATH_ERROR","Failed to parse mdms response for department");
        }

        if(CollectionUtils.isEmpty(mdmsDepartmentList))
            throw new CustomException("PARSING_ERROR","Failed to fetch department from mdms data for serviceCode: "+request.getService().getServiceCode());
        else departmentFromMDMS = mdmsDepartmentList.get(0);

        if(hrmsDepartmentList.contains(departmentFromMDMS)){
            String localisedDept = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,"COMMON_MASTERS_DEPARTMENT_"+departmentFromMDMS);
            reassigneeDetails.put("department",localisedDept);
        }

        String designationJsonPath = HRMS_DESIGNATION_JSONPATH.replace("{department}",departmentFromMDMS);

        try{
            designation = JsonPath.read(response, designationJsonPath);
            employeeName = JsonPath.read(response, HRMS_EMP_NAME_JSONPATH);
        }
        catch (Exception e){
            throw new CustomException("JSONPATH_ERROR","Failed to parse mdms response for department");
        }

        String localisedDesignation = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,"COMMON_MASTERS_DESIGNATION_"+designation.get(0));

        reassigneeDetails.put("designation",localisedDesignation);
        reassigneeDetails.put("employeeName",employeeName.get(0));

        return reassigneeDetails;
    }

    private List<SMSRequest> enrichSmsRequest(String mobileNumber, String finalMessage) {
        List<SMSRequest> smsRequest = new ArrayList<>();
        SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(finalMessage).build();
        smsRequest.add(req);
        return smsRequest;
    }

    private EventRequest enrichEventRequest(ServiceRequest request, String finalMessage) {
        String tenantId = request.getService().getTenantId();
        String mobileNumber = request.getService().getCitizen().getMobileNumber();

        Map<String, String> mapOfPhoneNoAndUUIDs = fetchUserUUIDs(mobileNumber, request.getRequestInfo(),tenantId);

        if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
            log.info("UUID search failed!");
        }

        List<Event> events = new ArrayList<>();
        List<String> toUsers = new ArrayList<>();
        toUsers.add(mapOfPhoneNoAndUUIDs.get(mobileNumber));

        Action action = null;
        if(request.getWorkflow().getAction().equals("RESOLVE")) {

            List<ActionItem> items = new ArrayList<>();
            String rateLink = "";
            String reopenLink = "";
            String rateUrl = config.getRateLink();
            String reopenUrl = config.getReopenLink();
            rateLink = rateUrl.replace("{application-id}", request.getService().getServiceRequestId());
            reopenLink = reopenUrl.replace("{application-id}", request.getService().getServiceRequestId());
            rateLink = config.getUiAppHost() + rateLink;
            reopenLink = config.getUiAppHost() + reopenLink;
            ActionItem rateItem = ActionItem.builder().actionUrl(rateLink).code(config.getRateCode()).build();
            ActionItem reopenItem = ActionItem.builder().actionUrl(reopenLink).code(config.getReopenCode()).build();
            items.add(rateItem);
            items.add(reopenItem);

            action = Action.builder().actionUrls(items).build();
        }
        Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
        events.add(Event.builder().tenantId(tenantId).description(finalMessage).eventType(USREVENTS_EVENT_TYPE)
                .name(USREVENTS_EVENT_NAME).postedBy(USREVENTS_EVENT_POSTEDBY)
                .source(Source.WEBAPP).recepient(recepient).actions(action).eventDetails(null).build());

        if (!CollectionUtils.isEmpty(events)) {
            return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
        } else {
            return null;
        }
    }

    /**
     * Fetches UUIDs of CITIZEN based on the phone number.
     *
     * @param mobileNumber - Mobile Numbers
     * @param requestInfo - Request Information
     * @param tenantId - Tenant Id
     * @return Returns List of MobileNumbers and UUIDs
     */
    public Map<String, String> fetchUserUUIDs(String mobileNumber, RequestInfo requestInfo, String tenantId) {
        Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();
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
                String uuid = JsonPath.read(user, "$.user[0].uuid");
                mapOfPhoneNoAndUUIDs.put(mobileNumber, uuid);
            }else {
                log.error("Service returned null while fetching user for username - "+mobileNumber);
            }
        }catch(Exception e) {
            log.error("Exception while fetching user for username - "+mobileNumber);
            log.error("Exception trace: ",e);
        }

        return mapOfPhoneNoAndUUIDs;
    }

    private User getInternalMicroserviceUser(String tenantId)
    {
        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
                .tenantId(tenantId).build();

        //Creating userinfo with uuid and role of internal micro service role
        User userInfo = User.builder()
                .uuid(config.getEgovInternalMicroserviceUserUuid())
                .type("SYSTEM")
                .roles(Collections.singletonList(role)).id(0L).build();

        return userInfo;
    }

}