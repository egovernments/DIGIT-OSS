package org.egov.collection.util;

import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.*;
import org.egov.collection.notification.consumer.NotificationConsumer;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.web.contract.Bill;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

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
            String phNo = bill.getMobileNumber();
            String message = notificationConsumer.buildSmsBody(bill, detail, receiptReq.getRequestInfo());
            if (!StringUtils.isEmpty(message)) {
                Map<String, Object> request = new HashMap<>();
                request.put("mobileNumber", phNo);
                request.put("message", message);

                producer.producer(eventTopic, request);
            } else {
                log.error("No message configured! Notification will not be sent.");
            }


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
                producer.producer(eventTopic, request);

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
            String customizedMsg = message.replace("XXXX",entryset.getValue());
            customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());

            String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
            String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+4);
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }



}