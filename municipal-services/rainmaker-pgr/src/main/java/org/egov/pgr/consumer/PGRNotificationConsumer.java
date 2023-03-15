package org.egov.pgr.consumer;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pgr.contract.Action;
import org.egov.pgr.contract.ActionItem;
import org.egov.pgr.contract.Event;
import org.egov.pgr.contract.EventRequest;
import org.egov.pgr.contract.Recepient;
import org.egov.pgr.contract.SMSRequest;
import org.egov.pgr.contract.ServiceReqSearchCriteria;
import org.egov.pgr.contract.ServiceRequest;
import org.egov.pgr.contract.ServiceResponse;
import org.egov.pgr.model.ActionInfo;
import org.egov.pgr.model.Service;
import org.egov.pgr.model.Source;
import org.egov.pgr.producer.PGRProducer;
import org.egov.pgr.service.GrievanceService;
import org.egov.pgr.service.NotificationService;
import org.egov.pgr.utils.PGRConstants;
import org.egov.pgr.utils.PGRUtils;
import org.egov.pgr.utils.WorkFlowConfigs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@org.springframework.stereotype.Service
@Slf4j
public class PGRNotificationConsumer {

    @Autowired
    private PGRProducer pGRProducer;

    @Value("${egov.hr.employee.v2.host}")
    private String hrEmployeeV2Host;

    @Value("${egov.hr.employee.v2.search.endpoint}")
    private String hrEmployeeV2SearchEndpoint;

    @Value("${kafka.topics.notification.sms}")
    private String smsNotifTopic;

    @Value("${kafka.topics.notification.email}")
    private String emailNotifTopic;

    @Value("${notification.sms.enabled}")
    private Boolean isSMSNotificationEnabled;

    @Value("${notification.email.enabled}")
    private Boolean isEmailNotificationEnabled;

    @Value("${reassign.complaint.enabled}")
    private Boolean isReassignNotifEnaled;

    @Value("${reopen.complaint.enabled}")
    private Boolean isReopenNotifEnaled;

    @Value("${comment.by.employee.notif.enabled}")
    private Boolean isCommentByEmpNotifEnaled;

    @Value("${email.template.path}")
    private String emailTemplatePath;

    @Value("${date.format.notification}")
    private String notificationDateFormat;

    @Value("${egov.ui.app.host}")
    private String uiAppHost;

    @Value("${egov.ui.feedback.url}")
    private String uiFeedbackUrl;

    @Value("${notification.allowed.on.status}")
    private String notificationEnabledStatuses;

    @Value("${egov.pgr.app.playstore.link}")
    private String appDownloadLink;

    @Value("${notification.fallback.locale}")
    private String fallbackLocale;

    @Value("${egov.usr.events.notification.enabled}")
    private Boolean isUsrEventNotificationEnabled;

    @Value("${egov.usr.events.create.topic}")
    private String saveUserEventsTopic;

    @Value("${egov.usr.events.review.link}")
    private String reviewLink;

    @Value("${egov.usr.events.review.code}")
    private String reviewCode;

    @Value("${egov.usr.events.reopen.code}")
    private String reopenCode;


    @Autowired
    private PGRUtils pGRUtils;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private GrievanceService requestService;

    @KafkaListener(topics = {"${kafka.topics.save.service}", "${kafka.topics.update.service}"})

    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        ObjectMapper mapper = new ObjectMapper();
        ServiceRequest serviceReqRequest = new ServiceRequest();
        try {
            serviceReqRequest = mapper.convertValue(record, ServiceRequest.class);
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
        process(serviceReqRequest);
    }


    /**
     * Sends notifications on different topics for the consumer to pick.
     *
     * @param serviceReqRequest
     */
    public void process(ServiceRequest serviceReqRequest) {
        if (!CollectionUtils.isEmpty(serviceReqRequest.getActionInfo())) {
            for (ActionInfo actionInfo : serviceReqRequest.getActionInfo()) {
                if (null != actionInfo && (!StringUtils.isEmpty(actionInfo.getStatus()) || !StringUtils.isEmpty(actionInfo.getComment()))) {
                    Service service = serviceReqRequest.getServices()
                            .get(serviceReqRequest.getActionInfo().indexOf(actionInfo));
                    if (isNotificationEnabled(actionInfo.getStatus(), serviceReqRequest.getRequestInfo().getUserInfo().getType(), actionInfo.getComment(), actionInfo.getAction())) {
                        if (isSMSNotificationEnabled) {
                            List<SMSRequest> smsRequests = prepareSMSRequest(service, actionInfo, serviceReqRequest.getRequestInfo());
                            if (CollectionUtils.isEmpty(smsRequests)) {
                                log.info("Messages from localization couldn't be fetched!");
                                continue;
                            }
                            for (SMSRequest smsRequest : smsRequests) {
                                pGRProducer.push(smsNotifTopic, smsRequest);
                            }
                        }
                        // Not enabled for now - email notifications to be part of next version of PGR.
                        if (isEmailNotificationEnabled
                                && (null != service.getEmail() && !service.getEmail().isEmpty())) {
                            //get code from git using any check-in before 24/04/2018.
                        }

                        if (isUsrEventNotificationEnabled) {
                            EventRequest request = prepareuserEvents(service, actionInfo, serviceReqRequest.getRequestInfo());
                            pGRProducer.push(saveUserEventsTopic, request);
                        }

                    } else {
                        log.info("Notification disabled for this case!");
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
    }


    /**
     * Prepares event to be registered in user-event service.
     * Currently, only the notifications addressed to CITIZEN are considered.
     *
     * @param serviceReq
     * @param actionInfo
     * @param requestInfo
     * @return
     */
    public EventRequest prepareuserEvents(Service serviceReq, ActionInfo actionInfo, RequestInfo requestInfo) {
        List<Event> events = new ArrayList<>();
        if (StringUtils.isEmpty(actionInfo.getAssignee()) && !actionInfo.getAction().equals(WorkFlowConfigs.ACTION_OPEN)) {
            try {
                actionInfo.setAssignee(notificationService.getCurrentAssigneeForTheServiceRequest(serviceReq, requestInfo));
            } catch (Exception e) {
                log.error("Exception while explicitly setting assignee!");
            }
        }
        for (String role : pGRUtils.getReceptorsOfNotification(actionInfo.getStatus(), actionInfo.getAction())) {
            if (role.equals(PGRConstants.ROLE_EMPLOYEE))
                continue;
            String message = getMessageForSMS(serviceReq, actionInfo, requestInfo, role);
            String data = notificationService.getMobileAndIdForNotificationService(requestInfo, serviceReq.getAccountId(), serviceReq.getTenantId(), actionInfo.getAssignee(), role);
            if (StringUtils.isEmpty(message))
                continue;
            List<String> toUsers = new ArrayList<>();
            toUsers.add(data.split("[|]")[1]);
            Recepient recepient = Recepient.builder()
                    .toUsers(toUsers).toRoles(null).build();

            Action action = null;
            if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_RESOLVED)) {
                List<ActionItem> items = new ArrayList<>();
                String actionLink = reviewLink.replace("$mobile", data.split("[|]")[0]).replace("$servicerequestid", serviceReq.getServiceRequestId().replaceAll("[/]", "%2F"));
                actionLink = uiAppHost + actionLink;
                ActionItem item = ActionItem.builder().actionUrl(actionLink).code(reviewCode).build();
                items.add(item);
                action = Action.builder().actionUrls(items).build();
            }
            Event event = Event.builder()
                    .tenantId(serviceReq.getTenantId())
                    .description(message)
                    .eventType(PGRConstants.USREVENTS_EVENT_TYPE)
                    .name(PGRConstants.USREVENTS_EVENT_NAME)
                    .postedBy(PGRConstants.USREVENTS_EVENT_POSTEDBY)
                    .source(Source.WEBAPP)
                    .recepient(recepient)
                    .eventDetails(null)
                    .actions(action).build();

            events.add(event);
        }
        return EventRequest.builder().requestInfo(requestInfo).events(events).build();
    }

    public List<SMSRequest> prepareSMSRequest(Service serviceReq, ActionInfo actionInfo, RequestInfo requestInfo) {
        List<SMSRequest> smsRequestsTobeSent = new ArrayList<>();
        if (StringUtils.isEmpty(actionInfo.getAssignee()) && !actionInfo.getAction().equals(WorkFlowConfigs.ACTION_OPEN)) {
            try {
                actionInfo.setAssignee(notificationService.getCurrentAssigneeForTheServiceRequest(serviceReq, requestInfo));
            } catch (Exception e) {
                log.error("Exception while explicitly setting assignee!");
            }
        }
        for (String role : pGRUtils.getReceptorsOfNotification(actionInfo.getStatus(), actionInfo.getAction())) {
            String phoneNumberRetrived = notificationService.getMobileAndIdForNotificationService(requestInfo, serviceReq.getAccountId(), serviceReq.getTenantId(), actionInfo.getAssignee(), role);
            phoneNumberRetrived = phoneNumberRetrived.split("[|]")[0];
            String phone = StringUtils.isEmpty(phoneNumberRetrived) ? serviceReq.getPhone() : phoneNumberRetrived;
            String message = getMessageForSMS(serviceReq, actionInfo, requestInfo, role);
            if (StringUtils.isEmpty(message))
                continue;
            smsRequestsTobeSent.add(SMSRequest.builder().mobileNumber(phone).message(message).build());
        }
        return smsRequestsTobeSent;
    }

    public String getMessageForSMS(Service serviceReq, ActionInfo actionInfo, RequestInfo requestInfo, String role) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(notificationDateFormat);
        String date = dateFormat.format(new Date());
        String tenantId = serviceReq.getTenantId().split("[.]")[0]; // localization values are for now state-level.
        String locale = null;
        try {
            locale = requestInfo.getMsgId().split("[|]")[1]; // Conventionally locale is sent in the first index of msgid split by |
            if (StringUtils.isEmpty(locale))
                locale = fallbackLocale;
        } catch (Exception e) {
            locale = fallbackLocale;
        }
        if (null == NotificationService.localizedMessageMap.get(locale + "|" + tenantId)) // static map that saves code-message pair against locale | tenantId.
            notificationService.getLocalisedMessages(requestInfo, tenantId, locale, PGRConstants.LOCALIZATION_MODULE_NAME);
        Map<String, String> messageMap = NotificationService.localizedMessageMap.get(locale + "|" + tenantId);
        if (null == messageMap)
            return null;
        List<Object> listOfValues = notificationService.getServiceType(serviceReq, requestInfo, locale);

        return getMessage(listOfValues, date, serviceReq, actionInfo, requestInfo, messageMap, role);

    }

    public String getMessage(List<Object> listOfValues, String date, Service serviceReq, ActionInfo actionInfo, RequestInfo requestInfo, Map<String, String> messageMap, String role) {
        if (null == listOfValues.get(0)) {
            return getDefaultMessage(messageMap, actionInfo.getStatus(), actionInfo.getAction(), actionInfo.getComment());
        }
        String text = null;
        String[] reasonForRejection = new String[2];
        Map<String, String> employeeDetails = null;
        String department = null;
        String designation = null;
        if (StringUtils.isEmpty(actionInfo.getStatus()) && !StringUtils.isEmpty(actionInfo.getComment())) {
            text = messageMap.get(PGRConstants.LOCALIZATION_CODE_COMMENT);
            text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_COMMENT_KEY, actionInfo.getComment())
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_USER_NAME_KEY, requestInfo.getUserInfo().getName());
        } else {
            text = messageMap.get(PGRConstants.getStatusRoleLocalizationKeyMap().get(actionInfo.getStatus() + "|" + role));
            if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_OPENED)) {
                if (null != actionInfo.getAction() && actionInfo.getAction().equals(WorkFlowConfigs.ACTION_REOPEN)) {
                    text = messageMap.get(PGRConstants.getActionRoleLocalizationKeyMap().get(WorkFlowConfigs.ACTION_REOPEN + "|" + role));
                    employeeDetails = notificationService.getEmployeeDetails(serviceReq.getTenantId(), actionInfo.getAssignee(), requestInfo);
                    text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_NAME_KEY, employeeDetails.get("name"));
                }
            } else if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_ASSIGNED)) {
                employeeDetails = notificationService.getEmployeeDetails(serviceReq.getTenantId(), actionInfo.getAssignee(), requestInfo);
                if (null != employeeDetails) {
                    List<String> deptCodes = new ArrayList<>();
                    deptCodes.add(employeeDetails.get("department"));
                    department = notificationService.getDepartmentForNotification(serviceReq, deptCodes, requestInfo);
                    designation = notificationService.getDesignation(serviceReq, employeeDetails.get("designation"), requestInfo);
                } else {
                    return getDefaultMessage(messageMap, actionInfo.getStatus(), actionInfo.getAction(), actionInfo.getComment());
                }
                if (StringUtils.isEmpty(department) || StringUtils.isEmpty(designation) || StringUtils.isEmpty(employeeDetails.get("name")))
                    return getDefaultMessage(messageMap, actionInfo.getStatus(), actionInfo.getAction(), actionInfo.getComment());

                text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_NAME_KEY, employeeDetails.get("name"))
                        .replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_DESIGNATION_KEY, designation)
                        .replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_DEPT_KEY, department);
            } else if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_REJECTED)) {
                if (StringUtils.isEmpty(actionInfo.getComment()))
                    return getDefaultMessage(messageMap, actionInfo.getStatus(), actionInfo.getAction(), actionInfo.getComment());
                reasonForRejection = actionInfo.getComment().split(";");
                if (reasonForRejection.length < 2)
                    return getDefaultMessage(messageMap, actionInfo.getStatus(), actionInfo.getAction(), actionInfo.getComment());
                text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_REASON_FOR_REOPEN_KEY, reasonForRejection[0])
                        .replaceAll(PGRConstants.SMS_NOTIFICATION_ADDITIONAL_COMMENT_KEY, reasonForRejection[1]);
            } else if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_RESOLVED)) {
                String assignee = notificationService.getCurrentAssigneeForTheServiceRequest(serviceReq, requestInfo);
                employeeDetails = notificationService.getEmployeeDetails(serviceReq.getTenantId(), assignee, requestInfo);

                text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_NAME_KEY, employeeDetails.get("name"));
            }
            if (actionInfo.getStatus().equals(WorkFlowConfigs.STATUS_CLOSED)) {
                ServiceReqSearchCriteria serviceReqSearchCriteria = ServiceReqSearchCriteria.builder().tenantId(serviceReq.getTenantId())
                        .serviceRequestId(Arrays.asList(serviceReq.getServiceRequestId())).build();
                ServiceResponse response = (ServiceResponse) requestService.getServiceRequestDetails(requestInfo, serviceReqSearchCriteria);
                List<ActionInfo> actions = response.getActionHistory().get(0).getActions().stream()
                        .filter(obj -> !StringUtils.isEmpty(obj.getAssignee())).collect(Collectors.toList());
                employeeDetails = notificationService.getEmployeeDetails(serviceReq.getTenantId(), actions.get(0).getAssignee(), requestInfo);
                text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_RATING_KEY,
                        StringUtils.isEmpty(response.getServices().get(0).getRating()) ? "5" : response.getServices().get(0).getRating())
                        .replaceAll(PGRConstants.SMS_NOTIFICATION_EMP_NAME_KEY, employeeDetails.get("name"));
            }
        }
        if (null != text) {
            String ulb = null;
            if (StringUtils.isEmpty(serviceReq.getTenantId().split("[.]")[1]))
                ulb = "Punjab";
            else {
                ulb = StringUtils.capitalize(serviceReq.getTenantId().split("[.]")[1]);
            }
            return text.replaceAll(PGRConstants.SMS_NOTIFICATION_COMPLAINT_TYPE_KEY, listOfValues.get(0).toString())
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_ID_KEY, serviceReq.getServiceRequestId())
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_DATE_KEY, date)
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_APP_LINK_KEY, uiAppHost + uiFeedbackUrl + serviceReq.getServiceRequestId())
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_APP_DOWNLOAD_LINK_KEY, appDownloadLink)
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_AO_DESIGNATION, PGRConstants.ROLE_NAME_GRO)
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_ULB_NAME, ulb)
                    .replaceAll(PGRConstants.SMS_NOTIFICATION_SLA_NAME, listOfValues.get(1).toString());

        }
        return text;
    }

    public String getDefaultMessage(Map<String, String> messageMap, String status, String action, String comment) {
        String text = null;
        if (StringUtils.isEmpty(status) && !StringUtils.isEmpty(comment)) {
            text = messageMap.get(PGRConstants.LOCALIZATION_CODE_COMMENT_DEFAULT);
        } else {
            text = messageMap.get(PGRConstants.LOCALIZATION_CODE_DEFAULT);
            text = text.replaceAll(PGRConstants.SMS_NOTIFICATION_STATUS_KEY, PGRConstants.getStatusNotifKeyMap().get(status));
            if (status.equals(WorkFlowConfigs.STATUS_OPENED)) {
                if (null != action && action.equals(WorkFlowConfigs.ACTION_REOPEN))
                    text = text.replaceAll(PGRConstants.getStatusNotifKeyMap().get(status), PGRConstants.getActionNotifKeyMap().get(WorkFlowConfigs.ACTION_REOPEN));
            } else if (status.equals(WorkFlowConfigs.STATUS_ASSIGNED)) {
                if (null != action && action.equals(WorkFlowConfigs.ACTION_REASSIGN))
                    text = text.replaceAll(PGRConstants.getStatusNotifKeyMap().get(status), PGRConstants.getActionNotifKeyMap().get(WorkFlowConfigs.ACTION_REASSIGN));
            }
        }

        return text;
    }

    public boolean isNotificationEnabled(String status, String userType, String comment, String action) {
        boolean isNotifEnabled = false;
        List<String> notificationEnabledStatusList = Arrays.asList(notificationEnabledStatuses.split(","));
        if (notificationEnabledStatusList.contains(status)) {
            if (status.equalsIgnoreCase(WorkFlowConfigs.STATUS_OPENED) && action.equals(WorkFlowConfigs.ACTION_REOPEN) && isReopenNotifEnaled) {
                isNotifEnabled = true;
            }
            if (status.equalsIgnoreCase(WorkFlowConfigs.STATUS_ASSIGNED) && action.equals(WorkFlowConfigs.ACTION_REASSIGN) && isReassignNotifEnaled) {
                isNotifEnabled = true;
            }
            isNotifEnabled = true;
        }
        if ((null != comment && !comment.isEmpty()) && isCommentByEmpNotifEnaled && userType.equalsIgnoreCase("EMPLOYEE")) {
            isNotifEnabled = true;
        }
        return isNotifEnabled;
    }
}