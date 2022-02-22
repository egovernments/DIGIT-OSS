package org.egov.collection.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.*;
import org.egov.collection.model.enums.Action;
import org.egov.collection.model.enums.ActionItem;
import org.egov.collection.model.enums.Recepient;
import org.egov.collection.model.enums.Source;
import org.egov.collection.notification.consumer.NotificationConsumer;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.SMSRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.collection.config.CollectionServiceConstants.*;

@Slf4j
@Component
public class NotificationUtil {

    private ServiceRequestRepository serviceRequestRepository;

    private ApplicationProperties config;

    private CollectionProducer producer;

    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private NotificationConsumer notificationConsumer;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Value("${kafka.topics.notification.sms}")
    private String smsTopic;

    @Value("${egov.usr.events.create.topic}")
    private String eventTopic;

    @Value("${kafka.topics.notification.email}")
    private String emailTopic;


    @Autowired
    public NotificationUtil(ServiceRequestRepository serviceRequestRepository, ApplicationProperties config,
                            CollectionProducer producer, RestTemplate restTemplate) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
        this.producer = producer;
        this.restTemplate = restTemplate;
    }

    public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action) {
        List<String> masterData = new ArrayList<>();
        StringBuilder uri = new StringBuilder();
        uri.append(mdmsHost).append(mdmsUrl);
        if (org.apache.commons.lang3.StringUtils.isEmpty(tenantId))
            return masterData;
        MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

        Filter masterDataFilter = filter(
                where(MODULE).is(moduleName).and(ACTION).is(action)
        );

        try {
            Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
            masterData = JsonPath.parse(response).read("$.MdmsRes.Channel.channelList[?].channelNames[*]", masterDataFilter);
        } catch (Exception e) {
            log.error("Exception while fetching workflow states to ignore: ", e);
        }

        return masterData;
    }


    private MdmsCriteriaReq getMdmsRequestForChannelList(RequestInfo requestInfo, String tenantId) {
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

    public void sendSMSNotification(PaymentRequest receiptReq) {
        Payment receipt = receiptReq.getPayment();
        for (PaymentDetail detail : receipt.getPaymentDetails()) {
            Bill bill = detail.getBill();
            String phNo = bill.getMobileNumber();
            String message = notificationConsumer.buildSmsBody(bill, detail, receiptReq.getRequestInfo());
            if (!StringUtils.isEmpty(message)) {
                Map<String, Object> request = new HashMap<>();
                request.put("mobileNumber", phNo);
                request.put("message", message);

                producer.producer(smsTopic, request);
                log.info("Sending SMS notification: ");
                log.info("MobileNumber: " + phNo + " Messages: " + message);
            } else {
                log.error("No message configured! Notification will not be sent.");
            }


        }
    }

    public void sendEventNotification(PaymentRequest receiptReq) {
        Payment receipt = receiptReq.getPayment();
        for (PaymentDetail detail : receipt.getPaymentDetails()) {
            Bill bill = detail.getBill();
            String name = bill.getPayerName();
            String phNo = bill.getMobileNumber();
            String message = notificationConsumer.buildSmsBody(bill, detail, receiptReq.getRequestInfo());
            List<SMSRequest> smsRequests = createSMSRequest(message, name, phNo);
            List<Event> events = enrichEvent(smsRequests, receiptReq.getRequestInfo(), receiptReq.getPayment().getTenantId(), receipt, false);

            producer.producer(eventTopic, new EventRequest(receiptReq.getRequestInfo(), events));

        }
    }

    public void sendEmailNotification(PaymentRequest receiptReq) {
        Payment payment = receiptReq.getPayment();
        List<EmailRequest> emailRequests = new LinkedList<>();
        String tenantId = payment.getTenantId();
        for (PaymentDetail detail : payment.getPaymentDetails()) {
            Bill bill = detail.getBill();
            String phNo = bill.getMobileNumber();
            String message = notificationConsumer.buildEmailBody(bill, detail, receiptReq.getRequestInfo());
            Set<String> mobileNumbers = new HashSet<>();
            Map<String, String> mobileNumberToEmails = new HashMap<>();
            if (!StringUtils.isEmpty(message)) {
                Map<String, Object> request = new HashMap<>();
                request.put("mobileNumber", phNo);
                request.put("message", message);
                mobileNumberToEmails = fetchUserEmailIds(phNo, receiptReq.getRequestInfo(), tenantId);

                emailRequests.addAll(createEmailRequest(receiptReq.getRequestInfo(), message, mobileNumberToEmails));

                if (config.getIsEmailNotificationEnabled()) {
                    if (CollectionUtils.isEmpty(emailRequests))
                        log.info("Messages from localization couldn't be fetched!");
                    for (EmailRequest emailRequest : emailRequests) {
                        producer.producer(config.getEmailNotifTopic(), emailRequest);
                        log.info("Email SENT!");
                    }
                }
            }
        }
    }

    private Map<String, String> fetchUserEmailIds(String phNo, RequestInfo requestInfo, String tenantId) {
        Map<String, String> mapOfPhnoAndEmailIds = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEnpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", "CITIZEN");
        userSearchRequest.put("userName", phNo);
        try {
            Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
            if (null != user) {
                if (JsonPath.read(user, "$.user[0].emailId") != null) {
                    String email = JsonPath.read(user, "$.user[0].emailId");
                    mapOfPhnoAndEmailIds.put(phNo, email);
                }
            } else {
                log.error("Service returned null while fetching user for username - " + phNo);
            }
        } catch (Exception e) {
            log.error("Exception while fetching user for username - " + phNo);
            log.error("Exception trace: ", e);
        }
        return mapOfPhnoAndEmailIds;

    }

    public List<EmailRequest> createEmailRequest(RequestInfo requestInfo, String message, Map<String, String> mobileNumberToEmailId) {

        List<EmailRequest> emailRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
            String customizedMsg = message.replace("XXXX", entryset.getValue());
            customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}", entryset.getKey());

            String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>") + 4, customizedMsg.indexOf("</h2>"));
            String body = customizedMsg.substring(customizedMsg.indexOf("</h2>") + 4);
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo, emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    public List<SMSRequest> createSMSRequest(String message, String name, String phNo) {
        List<SMSRequest> smsRequest = new LinkedList<>();
        String customizedMsg = message.replace(NOTIFICATION_OWNERNAME, name);
        smsRequest.add(new SMSRequest(phNo, customizedMsg));
        return smsRequest;
    }


    public List<Event> enrichEvent(List<SMSRequest> smsRequests, RequestInfo requestInfo, String tenantId, Payment payment, Boolean isActionReq) {

        List<Event> events = new ArrayList<>();
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, requestInfo, tenantId);
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
            log.error("UUIDs Not found for Mobilenumbers");
        }

        Map<String, String> mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
        mobileNumbers.forEach(mobileNumber -> {

            List<String> toUsers = new ArrayList<>();
            toUsers.add(mapOfPhnoAndUUIDs.get(mobileNumber));
            Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();

            Action action = null;
            if (isActionReq) {
                List<ActionItem> items = new ArrayList<>();
                String msg = smsRequests.get(0).getMessage();
                String actionLink = "";

                if (msg.contains(ACTION_PAY)) {
                    actionLink = config.getPayLink().replace("$mobile", mobileNumber)
                            .replace("$receiptNumber", payment.getPaymentDetails().get(0).getReceiptNumber())
                            .replace("$tenantId", payment.getTenantId())
                            .replace("$businessService", BUSINESS_SERVICE_TL);

                    actionLink = config.getUiAppHost() + actionLink;
                    ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
                    items.add(item);
                }

                action = Action.builder().actionUrls(items).build();
            }

            events.add(Event.builder().tenantId(tenantId).description(smsRequests.get(0).getMessage())
                    .eventType(USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
                    .postedBy(USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).actions(action).build());

            log.info("Event Message" + smsRequests.get(0).getMessage());
        });
        return events;
    }

    private String removeForInAppMessage(String message)
    {
        if(message.contains(ACTION_PAY))
            message = message.replace(ACTION_PAY,"");
        return message;
    }

    public Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {

        Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEnpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", "CITIZEN");
        for(String mobileNo: mobileNumbers) {
            userSearchRequest.put("userName", mobileNo);
            try {
                Object user = fetchUserResult(uri, userSearchRequest).get();
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

    public Optional<Object> fetchUserResult(StringBuilder uri, Object request) {

        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;
        log.info("URI: "+uri.toString());
        try {
            log.info("Request: "+mapper.writeValueAsString(request));
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        } catch (HttpClientErrorException e) {

            log.error("External Service threw an Exception: ", e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (Exception e) {

            log.error("Exception while fetching from external service: ", e);
            throw new CustomException("REST_CALL_EXCEPTION : "+uri.toString(),e.getMessage());
        }
        return Optional.ofNullable(response);
    }
}