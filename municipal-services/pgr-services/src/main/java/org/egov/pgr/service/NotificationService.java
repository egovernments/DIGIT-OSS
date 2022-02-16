package org.egov.pgr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
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
            String applicationStatus = request.getService().getApplicationStatus();

            if (!(NOTIFICATION_ENABLE_FOR_STATUS.contains(request.getWorkflow().getAction()+"_"+applicationStatus))) {
                log.info("Notification Disabled For State :" + applicationStatus);
                return;
            }

            String finalMessage = getFinalMessage(request, topic, applicationStatus);
            String mobileNumber = request.getService().getCitizen().getMobileNumber();

            if(!StringUtils.isEmpty(finalMessage)){
                log.info(finalMessage);
                log.info(mobileNumber);
                if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
                    EventRequest eventRequest = enrichEventRequest(request,finalMessage);
                    if (eventRequest != null) {
                        notificationUtil.sendEventNotification(eventRequest);
                    }
                }

                if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
                    List<SMSRequest> smsRequests = new ArrayList<>();
                    smsRequests = enrichSmsRequest(mobileNumber,finalMessage);
                    if (!CollectionUtils.isEmpty(smsRequests)) {
                        notificationUtil.sendSMS(smsRequests);
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
    private String getFinalMessage(ServiceRequest request, String topic, String applicationStatus) {
        String tenantId = request.getService().getTenantId();
        String action = request.getWorkflow().getAction();
        String localizationMessage = notificationUtil.getLocalizationMessages(tenantId, request.getRequestInfo(),PGR_MODULE);

        String message = notificationUtil.getCustomizedMsg(action, applicationStatus, localizationMessage);
        if (message == null) {
            log.info("No message Found For Topic : " + topic);
            return message;
        }

        if (message.contains("{complaint_type}")){
            String localisedComplaint = notificationUtil.getCustomizedMsgForPlaceholder(localizationMessage,"pgr.complaint.category."+request.getService().getServiceCode());
            message = message.replace("{complaint_type}", localisedComplaint);
        }

        String finalMessage = getMessageForMobileNumber(message,request);
        return finalMessage;
    }

    public String getMessageForMobileNumber(String message, ServiceRequest request){
        String messageToReplace = message;
        ServiceWrapper serviceWrapper = ServiceWrapper.builder().service(request.getService()).workflow(request.getWorkflow()).build();

        /*if (messageToReplace.contains("{complaint_type}"))
            messageToReplace = messageToReplace.replace("{complaint_type}", pgrEntity.getService().getServiceCode());*/

        if (messageToReplace.contains("{id}"))
            messageToReplace = messageToReplace.replace("{id}", serviceWrapper.getService().getServiceRequestId());

        if (messageToReplace.contains("{date}")){
            Long createdTime = serviceWrapper.getService().getAuditDetails().getCreatedTime();
            LocalDate date = Instant.ofEpochMilli(createdTime > 10 ? createdTime : createdTime * 1000)
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_PATTERN);
            messageToReplace = messageToReplace.replace("{date}", date.format(formatter));
        }

        if (messageToReplace.contains("{download link}")){
            String appLink = notificationUtil.getShortnerURL(config.getMobileDownloadLink());
            messageToReplace = messageToReplace.replace("{download link}", appLink);
        }

        if (messageToReplace.contains("{emp_name}")){
            ProcessInstance processInstance = getEmployeeName(serviceWrapper.getService().getTenantId(),serviceWrapper.getService().getServiceRequestId(),request.getRequestInfo(),PGR_WF_RESOLVE);
            messageToReplace = messageToReplace.replace("{emp_name}", processInstance.getAssigner().getName());
        }

        if (messageToReplace.contains("{additional_comments}"))
            messageToReplace = messageToReplace.replace("{additional_comments}", serviceWrapper.getWorkflow().getComments());

       /* if (messageToReplace.contains("{reason}"))
            messageToReplace = messageToReplace.replace("{reason}", pgrEntity.getWorkflow().getComments());*/

        if(serviceWrapper.getService().getApplicationStatus().equalsIgnoreCase(PENDINGATLME) && serviceWrapper.getWorkflow().getAction().equalsIgnoreCase(REASSIGN)){

            Map<String, String> reassigneeDetails  = getHRMSEmployee(request);

            if (messageToReplace.contains("{reassign_emp_name}"))
                messageToReplace = messageToReplace.replace("{reassign_emp_name}",reassigneeDetails.get("employeeName"));

            if (messageToReplace.contains("{emp_department}"))
                messageToReplace = messageToReplace.replace("{emp_department}",reassigneeDetails.get("department"));

            if (messageToReplace.contains("{emp_designation}"))
                messageToReplace = messageToReplace.replace("{emp_designation}",reassigneeDetails.get("designamtion"));
        }



        return messageToReplace;
    }

    public ProcessInstance getEmployeeName(String tenantId, String serviceRequestId, RequestInfo requestInfo,String action){
        ProcessInstance processInstanceToReturn = new ProcessInstance();
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
        List<String> designamtion = null;
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
            designamtion = JsonPath.read(response, designationJsonPath);
            employeeName = JsonPath.read(response, HRMS_EMP_NAME_JSONPATH);
        }
        catch (Exception e){
            throw new CustomException("JSONPATH_ERROR","Failed to parse mdms response for department");
        }

        String localisedDesignation = notificationUtil.getCustomizedMsgForPlaceholder(localisationMessageForPlaceholder,"COMMON_MASTERS_DESIGNATION_"+designamtion.get(0));

        reassigneeDetails.put("designamtion",localisedDesignation);
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



}