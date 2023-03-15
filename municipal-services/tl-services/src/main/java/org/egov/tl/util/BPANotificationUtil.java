package org.egov.tl.util;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.producer.Producer;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.service.notification.TLNotificationService;
import org.egov.tl.web.models.*;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static org.egov.tl.util.BPAConstants.*;
import static org.egov.tl.util.TLConstants.BILL_AMOUNT_JSONPATH;
import static org.egov.tl.util.TLConstants.CHANNEL_NAME_EVENT;
import static org.springframework.util.StringUtils.capitalize;

@Component
@Slf4j
public class BPANotificationUtil {

    private TLConfiguration config;

    private ServiceRequestRepository serviceRequestRepository;

    private Producer producer;

    private NotificationUtil notificationUtil;

    @Autowired
    private TradeUtil tradeUtil;

    @Value("${egov.ui.app.host}")
    private String egovhost;

    @Value("${egov.common.pay.bpareg.endpoint}")
    private String commonPayEndpoint;

    @Value("${egov.citizen.home.endpoint}")
    private String citizenHomeEndpoint;

    @Autowired
    public BPANotificationUtil(TLConfiguration config, ServiceRequestRepository serviceRequestRepository,
                               Producer producer, NotificationUtil notificationUtil) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
        this.producer = producer;
        this.notificationUtil = notificationUtil;

    }

    final String receiptNumberKey = "receiptNumber";

    final String amountPaidKey = "amountPaid";

    /**
     * Creates customized message based on tradelicense
     *
     * @param license
     *            The tradeLicense for which message is to be sent
     * @param localizationMessage
     *            The messages from localization
     * @return customized message based on tradelicense
     */

    /**
     * Returns the uri for the localization call
     *
     * @param tenantId TenantId of the propertyRequest
     * @return The uri for localization search call
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

        if (config.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;
        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
            locale = requestInfo.getMsgId().split("\\|")[1];

        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
                .append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(BPAConstants.MODULE);

        return uri;
    }

    /**
     * Fetches messages from localization service
     *
     * @param tenantId    tenantId of the tradeLicense
     * @param requestInfo The requestInfo of the request
     * @return Localization messages for the module
     */
    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
                requestInfo);
        String jsonString = new JSONObject(responseMap).toString();
        return jsonString;
    }

    public String getCustomizedMsg(RequestInfo requestInfo, TradeLicense license, String localizationMessage) {
        String message = null, messageTemplate;
        String ACTION_STATUS = license.getAction() + "_" + license.getStatus();

        switch (ACTION_STATUS) {

            case ACTION_STATUS_PENDINGPAYMENT:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGPAYMENT, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                BigDecimal amountToBePaid =  notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            // payment notification handled in receipt consumer
//            case ACTION_STATUS_PENDINGDOCVERIFICATION:
//                break;

            case ACTION_STATUS_PENDINGAPPROVAL:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGAPPROVAL, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                break;

            case ACTION_STATUS_APPROVED:
                messageTemplate = getMessageTemplate(NOTIFICATION_APPROVED, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                break;


            case ACTION_STATUS_REJECTED:
                messageTemplate = getMessageTemplate(NOTIFICATION_REJECTED, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                break;

            case ACTION_STATUS_INITIATED:
                messageTemplate = getMessageTemplate(BPAConstants.NOTIFICATION_PENDINGPAYMENT, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                amountToBePaid =  notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            case ACTION_STATUS_INITIATED_PARTIAL:
                messageTemplate = getMessageTemplate(BPAConstants.NOTIFICATION_INITIATED, localizationMessage);
                message = getReplacedMessage(license, messageTemplate);
                break;

        }

        return message;
    }

    public String getEventCustomizedMsg(RequestInfo requestInfo, TradeLicense license, String localizationMessage) {
        String message = null, messageTemplate;
        String ACTION_STATUS = license.getAction() + "_" + license.getStatus();

        switch (ACTION_STATUS) {

            case ACTION_STATUS_PENDINGPAYMENT:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGPAYMENT, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                BigDecimal amountToBePaid =  notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            // payment notification handled in receipt consumer
//            case ACTION_STATUS_PENDINGDOCVERIFICATION:
//                break;

            case ACTION_STATUS_PENDINGAPPROVAL:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGAPPROVAL, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                break;

            case ACTION_STATUS_APPROVED:
                messageTemplate = getMessageTemplate(NOTIFICATION_APPROVED, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                break;


            case ACTION_STATUS_REJECTED:
                messageTemplate = getMessageTemplate(NOTIFICATION_REJECTED, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                break;

            case ACTION_STATUS_INITIATED:
                messageTemplate = getMessageTemplate(BPAConstants.NOTIFICATION_PENDINGPAYMENT, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                amountToBePaid =  notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            case ACTION_STATUS_INITIATED_PARTIAL:
                messageTemplate = getMessageTemplate(BPAConstants.NOTIFICATION_INITIATED, localizationMessage);
                message = getLinksRemoved(messageTemplate);
                message = getReplacedMessage(license, message);
                break;

        }

        return message;
    }

    public String getEmailCustomizedMsg(RequestInfo requestInfo, TradeLicense license, String localizationMessage) {

        String message = null, messageTemplate;
        String ACTION_STATUS = license.getAction() + "_" + license.getStatus();

        switch (ACTION_STATUS) {

            case ACTION_STATUS_PENDINGPAYMENT:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGPAYMENT_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                BigDecimal amountToBePaid = notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            // payment notification handled in receipt consumer
//            case ACTION_STATUS_PENDINGDOCVERIFICATION:
//                break;

            case ACTION_STATUS_PENDINGAPPROVAL:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGAPPROVAL_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                break;

            case ACTION_STATUS_APPROVED:
                messageTemplate = getMessageTemplate(NOTIFICATION_APPROVED_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                break;

            case ACTION_STATUS_REJECTED:
                messageTemplate = getMessageTemplate(NOTIFICATION_REJECTED_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                break;

            case ACTION_STATUS_INITIATED:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGPAYMENT_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                amountToBePaid =  notificationUtil.getAmountToBePaid(requestInfo, license);

                if (message.contains("{AMOUNT_TO_BE_PAID}")) {
                    message = message.replace("{AMOUNT_TO_BE_PAID}", amountToBePaid.toString());
                }
                break;

            case ACTION_STATUS_INITIATED_PARTIAL:
                messageTemplate = getMessageTemplate(NOTIFICATION_INITIATED_EMAIL, localizationMessage);
                message = getReplacedEmailMessage(requestInfo, license, messageTemplate);
                break;

        }

        return message;
    }

    public String getReplacedEmailMessage(RequestInfo requestInfo, TradeLicense license, String messageTemplate) {
        String message = messageTemplate.replace("{APPLICATION_NUMBER}",license.getApplicationNumber());
        String stateName = tradeUtil.mDMSCallForStateName(requestInfo, license.getTenantId());
        if(license.getTenantId().split("\\.").length!=1)
            message = message.replace("{ULB}", capitalize(stateName));
        else if (license.getTenantId().split("\\.").length == 1){
            message = message.replace("{ULB}", capitalize(stateName) + " State");
        }
        message = message.replace("{PORTAL_LINK}",egovhost+citizenHomeEndpoint);

        if(license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType().split("\\.").length!=1)
            message = message.replace("{TRADE_TYPE}",license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType().split("\\.")[0]);
        else
            message = message.replace("{TRADE_TYPE}",license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType());

        //CCC - Designaion configurable according to ULB
        // message = message.replace("CCC","");

        for(OwnerInfo owner :license.getTradeLicenseDetail().getOwners())
        {
            if(owner.getIsPrimaryOwner()!=null && owner.getIsPrimaryOwner())
            {
                message = message.replace("{STAKEHOLDER_NAME}",owner.getName());
            }
        }

        if(message.contains("{STAKEHOLDER_NAME}"))
            message = message.replace("{STAKEHOLDER_NAME}",license.getTradeLicenseDetail().getOwners().get(0).getName());

        if(message.contains("{PAYMENT_LINK}"))
        {
            String payEndpoint = commonPayEndpoint.replace("$applicationNo", license.getApplicationNumber()).replace("$tenantId", license.getTenantId());
            message = message.replace("{PAYMENT_LINK}", notificationUtil.getShortenedUrl(egovhost + payEndpoint));
        }

        return message;
    }


    /**
     * Extracts message for the specific code
     *
     * @param notificationCode    The code for which message is required
     * @param localizationMessage The localization messages
     * @return message for the specific code
     */
    public String getMessageTemplate(String notificationCode, String localizationMessage) {
        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            Object messageObj = JsonPath.parse(localizationMessage).read(path);
            message = ((ArrayList<String>) messageObj).get(0);
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }
        return message;
    }

    /**
     * Creates customized message for apply
     *
     * @param license tenantId of the tradeLicense
     * @param messageTemplate Message from localization for apply
     * @return customized message for apply
     */
    public String getReplacedMessage(TradeLicense license, String messageTemplate) {
        String message = messageTemplate.replace("{APPLICATION_NUMBER}",license.getApplicationNumber());

        if(license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType().split("\\.").length!=1)
            message = message.replace("{TRADE_TYPE}",license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType().split("\\.")[0]);
        else
            message = message.replace("{TRADE_TYPE}",license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType());

        for(OwnerInfo owner :license.getTradeLicenseDetail().getOwners())
        {
            if(owner.getIsPrimaryOwner()!=null && owner.getIsPrimaryOwner())
            {
                message = message.replace("{STAKEHOLDER_NAME}",owner.getName());
            }
        }
        if(message.contains("{STAKEHOLDER_NAME}"))
            message = message.replace("{STAKEHOLDER_NAME}",license.getTradeLicenseDetail().getOwners().get(0).getName());

        if(message.contains("{PORTAL_LINK}"))
            message = message.replace("{PORTAL_LINK}",egovhost+citizenHomeEndpoint);

        if(message.contains("{PAYMENT_LINK}"))
        {
            String payEndpoint = commonPayEndpoint.replace("$applicationNo", license.getApplicationNumber()).replace("$tenantId", license.getTenantId());
            message = message.replace("{PAYMENT_LINK}", notificationUtil.getShortenedUrl(egovhost + payEndpoint));
        }
        return message;
    }


    public String getLinksRemoved(String message)
    {

        if (message.contains("{RECEIPT_DOWNLOAD_LINK}")) {
            message = message.replace("{RECEIPT_DOWNLOAD_LINK}", "");
        }

        if (message.contains("{PAYMENT_LINK}")) {
            message = message.replace("{PAYMENT_LINK}", "");
        }

        if (message.contains("{PORTAL_LINK}")) {
            message = message.replace("{PORTAL_LINK}", "");
        }

        return message;
    }

    public List<EmailRequest> createEmailRequestForBPA(RequestInfo requestInfo,String message, Map<String, String> mobileNumberToEmailId, TradeLicense license,String receiptno) {

        List<EmailRequest> emailRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
            String customizedMsg = message.replace("{RECEIPT_DOWNLOAD_LINK}",getRecepitDownloadLink(license,entryset.getKey(),receiptno));
            customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());
            String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
            String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    public List<SMSRequest> createSMSRequestForBPA(String message, Map<String, String> mobileNumberToOwnerName,TradeLicense license,String receiptno) {
        List<SMSRequest> smsRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToOwnerName.entrySet()) {
            String customizedMsg = message;
            if(customizedMsg.contains("{RECEIPT_DOWNLOAD_LINK}"))
                customizedMsg = customizedMsg.replace("{RECEIPT_DOWNLOAD_LINK}", getRecepitDownloadLink(license,entryset.getKey(),receiptno));
            customizedMsg = customizedMsg.replace("{1}",entryset.getValue());
            smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
        }
        return smsRequest;
    }

    public String getRecepitDownloadLink(TradeLicense license, String mobileno,String receiptNumber) {

        String consumerCode;
        consumerCode = license.getApplicationNumber();
        String link = config.getUiAppHost() + config.getReceiptDownloadLink();
        link = link.replace("$consumerCode", consumerCode);
        link = link.replace("$tenantId", license.getTenantId());
        link = link.replace("$businessService", license.getBusinessService());
        link = link.replace("$receiptNumber", receiptNumber);
        link = link.replace("$mobile", mobileno);
        link = notificationUtil.getShortenedUrl(link);
//        log.info(link);
        return link;
    }

    public EventRequest getEventsForBPA(TradeLicenseRequest request, boolean isStatusPaid, String message,String receiptno, String userEventName) {
        if(message == null)
            return null;

        List<Event> events = new ArrayList<>();
        TradeLicense license = request.getLicenses().get(0);

        Map<String,String > mobileNumberToOwner = new HashMap<>();
        license.getTradeLicenseDetail().getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
        });

        message = getLinksRemoved(message);
        message = getReplacedMessage(license, message);

        //get links removed
        List<SMSRequest> smsRequests = createSMSRequestForBPA(message, mobileNumberToOwner,license,receiptno);
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mapOfPhnoAndUUIDs = notificationUtil.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
            log.info("UUID search failed!");
            return null;
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
            if (license.getStatus().equals(PENDINGDOCVERIFICATION_STATUS)) {
                List<ActionItem> items = new ArrayList<>();
                String actionLink = getRecepitDownloadLink(license, mobile, receiptno);
                ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getDownloadReceiptCode()).build();
                items.add(item);
                action = Action.builder().actionUrls(items).build();
            }

            events.add(Event.builder().tenantId(license.getTenantId()).description(mobileNumberToMsg.get(mobile))
                    .eventType(BPAConstants.USREVENTS_EVENT_TYPE).name(userEventName)
                    .postedBy(BPAConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).actions(action).build());
            }
        if(!CollectionUtils.isEmpty(events)) {
                return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
                }else {
                return null;
                }
       }

    }
