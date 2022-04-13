package org.egov.pt.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.collection.PaymentDetail;
import org.egov.pt.models.collection.PaymentRequest;
import org.egov.pt.models.event.Action;
import org.egov.pt.models.event.ActionItem;
import org.egov.pt.models.event.Event;
import org.egov.pt.models.event.EventRequest;
import org.egov.pt.models.event.Recepient;
import org.egov.pt.models.event.Source;
import org.egov.pt.models.transaction.Transaction;
import org.egov.pt.models.transaction.TransactionRequest;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.util.NotificationUtil;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.EmailRequest;
import org.egov.pt.web.contracts.SMSRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;
import static org.egov.pt.util.PTConstants.*;

@Slf4j
@Service
public class PaymentNotificationService {

    @Autowired
    private PropertyConfiguration propertyConfiguration;

    @Autowired
    private PropertyRepository PropertyRepository;

    @Autowired
    private NotificationUtil util;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private RestTemplate restTemplate;

    private PropertyConfiguration config;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    /**
     *
     * @param record
     * @param topic
     */
    public void process(HashMap<String, Object> record, String topic){


        if(topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic())){
            processPaymentTopic(record, topic);
        }

        else if(topic.equalsIgnoreCase(propertyConfiguration.getPgTopic())){
            processTransaction(record, topic);
        }


    }




    public void processTransaction(HashMap<String, Object> record, String topic){

        TransactionRequest transactionRequest = mapper.convertValue(record, TransactionRequest.class);

        RequestInfo requestInfo = transactionRequest.getRequestInfo();
        Transaction transaction = transactionRequest.getTransaction();
        String tenantId = transaction.getTenantId();

        if(transaction.getTxnStatus().equals(Transaction.TxnStatusEnum.FAILURE)){

            String localizationMessages = util.getLocalizationMessages(tenantId,requestInfo);
            String consumerCode = transaction.getConsumerCode();
            String path = getJsonPath(topic, ONLINE_PAYMENT_MODE, false);

            String messageTemplate = null;
            List<String> configuredChannelNames  = util.fetchChannelList(requestInfo, tenantId, PT_BUSINESSSERVICE, ACTION_FOR_PAYMENT_FAILURE);
            try {
                Object messageObj = JsonPath.parse(localizationMessages).read(path);
                messageTemplate = ((ArrayList<String>) messageObj).get(0);
            } catch (Exception e) {
                log.error("Fetching from localization failed", e);
            };
            Map<String, String> valMap = getValuesFromTransaction(transaction);
            String customMessage = getCustomizedMessage(valMap,messageTemplate,path);

            PropertyCriteria criteria = PropertyCriteria.builder().tenantId(tenantId)
                    .propertyIds(Collections.singleton(consumerCode))
                    .build();

            List<Property> properties = PropertyRepository.getPropertiesWithOwnerInfo(criteria, requestInfo, true);

            if(CollectionUtils.isEmpty(properties)){
                log.error("PROPERTY_NOT_FOUND","Unable to send payment notification to propertyId: "+consumerCode);
                return;
            }

            Property property = properties.get(0);


            Set<String> mobileNumbers = new HashSet<>();
            property.getOwners().forEach(owner -> {
                mobileNumbers.add(owner.getMobileNumber());
                if (owner.getAlternatemobilenumber()!= null) {
                    mobileNumbers.add(owner.getAlternatemobilenumber());
                }
            });

            List<SMSRequest> smsRequests = getSMSRequests(mobileNumbers, customMessage, valMap);
            String payerMobileNo = transaction.getUser().getMobileNumber();
            if (!mobileNumbers.contains(payerMobileNo)) {
                smsRequests.add(getSMSRequestsWithoutReceipt(payerMobileNo, customMessage, valMap));
            }

            if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
                util.sendSMS(smsRequests);
            }

            if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
                List<Event> events = new LinkedList<>();
                if (null == propertyConfiguration.getIsUserEventsNotificationEnabled() || propertyConfiguration.getIsUserEventsNotificationEnabled()) {
                    events.addAll(getEvents(smsRequests, requestInfo, property, false,valMap));
                    util.sendEventNotification(new EventRequest(requestInfo, events));
                }
            }

            if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
                List<EmailRequest> emailRequests = util.createEmailRequestFromSMSRequests(requestInfo,smsRequests,tenantId);
                util.sendEmail(emailRequests);
            }
        }
        else return;
    }








    /**
     * Generates message from the received object and sends SMSRequest to kafka queue
     * @param record The Object received from kafka topic
     * @param topic The topic name from which Object is received
     */
    public void processPaymentTopic(HashMap<String, Object> record, String topic){



        PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
        RequestInfo requestInfo = paymentRequest.getRequestInfo();

        List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
        String tenantId = paymentRequest.getPayment().getTenantId();
        String paymentMode = paymentRequest.getPayment().getPaymentMode();
        String transactionNumber = paymentRequest.getPayment().getTransactionNumber();
        List<String> configuredChannelNames  = util.fetchChannelList(requestInfo, tenantId, PT_BUSINESSSERVICE, ACTION_PAID);

        List<PaymentDetail> ptPaymentDetails = new LinkedList<>();

        paymentDetails.forEach(paymentDetail -> {
            if(paymentDetail.getBusinessService().equalsIgnoreCase(PT_BUSINESSSERVICE))
                ptPaymentDetails.add(paymentDetail);
        });

        if(CollectionUtils.isEmpty(ptPaymentDetails))
            return;

        String localizationMessages = util.getLocalizationMessages(tenantId,requestInfo);
        List<SMSRequest> smsRequests = new ArrayList<>();
        List<Event> events = new ArrayList<>();
        Set<String> mobileNumbers = new HashSet<>();

        for(PaymentDetail paymentDetail : ptPaymentDetails){


            String consumerCode = paymentDetail.getBill().getConsumerCode();

            PropertyCriteria criteria = PropertyCriteria.builder().tenantId(tenantId)
                    .propertyIds(Collections.singleton(consumerCode))
                    .build();

            List<Property> properties = PropertyRepository.getPropertiesWithOwnerInfo(criteria, requestInfo, true);

            if(CollectionUtils.isEmpty(properties)){
                log.error("PROPERTY_NOT_FOUND","Unable to send payment notification to propertyId: "+consumerCode);
                continue;
            }

            Property property = properties.get(0);

            Boolean isPartiallyPayment = !(paymentDetail.getTotalAmountPaid().compareTo(paymentDetail.getTotalDue())==0);

            String customMessage = null;
            String path = getJsonPath(topic, paymentMode, isPartiallyPayment);
            String messageTemplate = null;
            try {
                Object messageObj = JsonPath.parse(localizationMessages).read(path);
                messageTemplate = ((ArrayList<String>) messageObj).get(0);
            } catch (Exception e) {
                log.error("Fetching from localization failed", e);
            }
            Map<String, String> valMap = getValuesFromPayment(transactionNumber, paymentMode, paymentDetail);
            customMessage = getCustomizedMessage(valMap,messageTemplate,path);

            property.getOwners().forEach(owner -> {
                mobileNumbers.add(owner.getMobileNumber());
                if (owner.getAlternatemobilenumber()!= null) {
                    mobileNumbers.add(owner.getAlternatemobilenumber());
                }
            });

            smsRequests.addAll(getSMSRequests(mobileNumbers,customMessage, valMap));
            String payerMobileNo = paymentRequest.getPayment().getMobileNumber();
            if (!mobileNumbers.contains(payerMobileNo)) {
                smsRequests.add(getSMSRequestsWithoutReceipt(payerMobileNo, customMessage, valMap));
            }

            if(null == propertyConfiguration.getIsUserEventsNotificationEnabled() || propertyConfiguration.getIsUserEventsNotificationEnabled()) {
                if(paymentDetail.getTotalDue().compareTo(paymentDetail.getTotalAmountPaid())==0)
                    events.addAll(getEvents(smsRequests,requestInfo,property,false,valMap));
                else events.addAll(getEvents(smsRequests,requestInfo,property,true,valMap));

            }
        }

        if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
            util.sendSMS(smsRequests);
        }

        if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
            if (!CollectionUtils.isEmpty(events))
                util.sendEventNotification(new EventRequest(requestInfo, events));
        }

        if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
            List<EmailRequest> emailRequests = util.createEmailRequestFromSMSRequests(requestInfo,smsRequests,tenantId);
            util.sendEmail(emailRequests);
        }

    }



    /**
     * Generate and returns SMSRequest if oldPropertyId is not present
     * @param messagejson The list of messages received from localization
     * @param valMap The map containing all the values as key,value pairs
     * @param mobileNumbers The list of mobileNumbers to which sms are to be sent
     * @return List of SMS request to be sent
     */
/*    private List<SMSRequest> addOldpropertyIdAbsentSMS(String messagejson,Map<String,String> valMap,List<String> mobileNumbers){
        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}",NOTIFICATION_OLDPROPERTYID_ABSENT);
        Object messageObj = JsonPath.parse(messagejson).read(path);
        String message = ((ArrayList<String>)messageObj).get(0);
        String customMessage = getCustomizedOldPropertyIdAbsentMessage(message,valMap);
        return getSMSRequests(mobileNumbers,customMessage);
    }*/


    /**
     * Returns the map of the values required from the record
     * @return The required values as key,value pair
     */
    private Map<String,String> getValuesFromPayment(String transactionNumber, String paymentMode,PaymentDetail paymentDetail){
        BigDecimal totalAmount,amountPaid;
        Map<String,String> valMap = new HashMap<>();



        try{
            totalAmount = paymentDetail.getTotalDue();
            valMap.put("totalAmount",totalAmount.toString());

            amountPaid = paymentDetail.getTotalAmountPaid();
            valMap.put("amountPaid",amountPaid.toString());
            valMap.put("amountDue",totalAmount.subtract(amountPaid).toString());

            valMap.put("consumerCode",paymentDetail.getBill().getConsumerCode());
            valMap.put("propertyId",paymentDetail.getBill().getConsumerCode());

            valMap.put("transactionId",transactionNumber);

            valMap.put("paymentMode",paymentMode);

            valMap.put("tenantId", paymentDetail.getTenantId());

            valMap.put("mobileNumber",paymentDetail.getBill().getMobileNumber());

            valMap.put("module",paymentDetail.getBusinessService());

            valMap.put("receiptNumber",paymentDetail.getReceiptNumber());
        }
        catch (Exception e)
        {
            throw new CustomException("PARSING ERROR","Failed to fetch values from the Receipt Object");
        }

        return valMap;
    }

    /**
     * Returns the map of the values required from the record
     * @return The required values as key,value pair
     */
    private Map<String,String> getValuesFromTransaction(Transaction transaction){
        HashMap<String,String> valMap = new HashMap<>();

        try{
            valMap.put("txnStatus",transaction.getTxnStatus().toString());

            valMap.put("txnAmount",transaction.getTxnAmount());

            valMap.put("tenantId",transaction.getTenantId());

            valMap.put("moduleId",transaction.getConsumerCode());
            valMap.put("propertyId",transaction.getConsumerCode());

            valMap.put("mobileNumber",transaction.getUser().getMobileNumber());

            valMap.put("module",transaction.getModule());
        }
        catch (Exception e)
        {   log.error("Transaction Object Parsing: ",e);
            throw new CustomException("PARSING ERROR","Failed to fetch values from the Transaction Object");
        }

        return valMap;
    }



    /**
     * Adds MobileNumber of logged in user
     * @param topic topic from which listening
     * @param requestInfo RequestInfo of the request
     * @param valMap The map of the required values
     * @param mobileNumbers The list of mobileNumbers of owner of properties
     */
    private void addUserNumber(String topic,RequestInfo requestInfo,Map<String,String> valMap,List<String> mobileNumbers)
    {
      //  If the requestInfo is of citizen add citizen's MobileNumber
        if((topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic())
                || topic.equalsIgnoreCase(propertyConfiguration.getPgTopic())) && !mobileNumbers.contains(valMap.get("mobileNumber")))
            mobileNumbers.add(valMap.get("mobileNumber"));
    }


    /**
     *  Returns the jsonPath
     * @param topic The topic name from which object is received
     * @param paymentMode The payment mode used for payment
     * @return  The jsonPath
     */
    private String getJsonPath(String topic,String paymentMode, Boolean isPartiallyPayment){
        String path = "$..messages[?(@.code==\"{}\")].message";
        if(topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic()) && !isPartiallyPayment && paymentMode.equalsIgnoreCase("online"))
            path = path.replace("{}",NOTIFICATION_PAYMENT_ONLINE);

        if(topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic()) && !isPartiallyPayment && !paymentMode.equalsIgnoreCase("online"))
            path = path.replace("{}",NOTIFICATION_PAYMENT_OFFLINE);

        if(topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic())&& isPartiallyPayment && paymentMode.equalsIgnoreCase("online"))
            path = path.replace("{}",NOTIFICATION_PAYMENT_PARTIAL_ONLINE);

        if(topic.equalsIgnoreCase(propertyConfiguration.getReceiptTopic()) && isPartiallyPayment&& !paymentMode.equalsIgnoreCase("online"))
            path = path.replace("{}",NOTIFICATION_PAYMENT_PARTIAL_OFFLINE);

        if(topic.equalsIgnoreCase(propertyConfiguration.getPgTopic()))
            path = path.replace("{}",NOTIFICATION_PAYMENT_FAIL);

        return path;
    }

    /**
     * Returns customized message for
     * @param valMap The map of the required values
     * @param message The message template from localization
     * @param path The json path used to fetch message
     * @return Customized message depending on values in valMap
     */
    private String getCustomizedMessage(Map<String,String> valMap,String message,String path){
        String customMessage = null;
        if(path.contains(NOTIFICATION_PAYMENT_ONLINE) || path.contains(NOTIFICATION_PAYMENT_PARTIAL_ONLINE))
            customMessage = getCustomizedOnlinePaymentMessage(message,valMap);
        if(path.contains(NOTIFICATION_PAYMENT_OFFLINE) || path.contains(NOTIFICATION_PAYMENT_PARTIAL_OFFLINE))
            customMessage = getCustomizedOfflinePaymentMessage(message,valMap);
        if(path.contains(NOTIFICATION_PAYMENT_FAIL))
            customMessage = getCustomizedPaymentFailMessage(message,valMap);
        if(path.contains(NOTIFICATION_OLDPROPERTYID_ABSENT))
            customMessage = getCustomizedOldPropertyIdAbsentMessage(message,valMap);
        return customMessage;
    }

    private String getReceiptLink(Map<String,String> valMap,String mobileNumber){
        StringBuilder builder = new StringBuilder(propertyConfiguration.getUiAppHost());
        builder.append(propertyConfiguration.getReceiptDownloadLink());
        String link = builder.toString();
        link = link.replace("$consumerCode", valMap.get("propertyId"));
        link = link.replace("$tenantId", valMap.get("tenantId"));
        link = link.replace("$receiptNumber", valMap.get("receiptNumber"));
        link = link.replace("$businessService",PT_BUSINESSSERVICE);
        link = link.replace("$mobile", mobileNumber);
        link = util.getShortenedUrl(link);
        return  link;
    }

    private String getReceiptLinkForInApp(Map<String,String> valMap,String mobileNumber, String businessService){
        StringBuilder builder = new StringBuilder(propertyConfiguration.getUiAppHost());
        builder.append(propertyConfiguration.getUserEventReceiptDownloadLink());
        String link = builder.toString();
        link = link.replace("$consumerCode", valMap.get("propertyId"));
        link = link.replace("$tenantId", valMap.get("tenantId"));
        link = link.replace("$receiptNumber", valMap.get("receiptNumber"));
        link = link.replace("$businessService",businessService);
        link = link.replace("$mobile", mobileNumber);
        return  link;
    }

    /**
     * @param message The message template from localization
     * @param valMap The map of the required values
     * @return Customized message depending on values in valMap
     */
    private String getCustomizedOnlinePaymentMessage(String message,Map<String,String> valMap){
        message = message.replace("{insert amount paid}",valMap.get("amountPaid"));
        message = message.replace("{insert payment transaction id from PG}",valMap.get("transactionId"));
        message = message.replace("{insert Property Tax Assessment ID}",valMap.get("propertyId"));
        message = message.replace("{pt due}.",valMap.get("amountDue"));
    //    message = message.replace("{FY}",valMap.get("financialYear"));
        return message;
    }


    /**
     * @param message The message template from localization
     * @param valMap The map of the required values
     * @return Customized message depending on values in valMap
     */
    private String getCustomizedOfflinePaymentMessage(String message,Map<String,String> valMap){
        message = message.replace("{amount}",valMap.get("amountPaid"));
        message = message.replace("{insert mode of payment}",valMap.get("paymentMode"));
        message = message.replace("{Enter pending amount}",valMap.get("amountDue"));
        message = message.replace("{insert inactive citizen application web URL}.",propertyConfiguration.getNotificationURL());
//        message = message.replace("{Insert FY}",valMap.get("financialYear"));
        return message;
    }


    /**
     * @param message The message template from localization
     * @param valMap The map of the required values
     * @return Customized message depending on values in valMap
     */
    private String getCustomizedPaymentFailMessage(String message,Map<String,String> valMap){
        message = message.replace("{insert amount to pay}",valMap.get("txnAmount"));
        message = message.replace("{insert ID}",valMap.get("propertyId"));
//        message = message.replace("{FY}",valMap.get("financialYear"));
        return message;
    }


    /**
     * @param message The message template from localization
     * @param valMap The map of the required values
     * @return Customized message depending on values in valMap
     */
    private String getCustomizedOldPropertyIdAbsentMessage(String message,Map<String,String> valMap){
        message = message.replace("{insert Property Tax Assessment ID}",valMap.get("propertyId"));
        message = message.replace("{FY}",valMap.get("financialYear"));
        return  message;
    }


    /**
     * Creates SMSRequest for the given mobileNumber with the given message
     * @param mobileNumbers The set of mobileNumber for which SMSRequest has to be created
     * @param customizedMessage The message to sent
     * @return List of SMSRequest
     */
    private List<SMSRequest> getSMSRequests(Set<String> mobileNumbers, String customizedMessage, Map<String, String> valMap){
        List<SMSRequest> smsRequests = new ArrayList<>();
        for(String mobileNumber : mobileNumbers){
            if(mobileNumber!=null)
            {   String finalMessage = customizedMessage.replace("$mobile", mobileNumber);
                if(customizedMessage.contains("{payLink}")){
                    finalMessage = finalMessage.replace("{payLink}", getPaymentLink(valMap));
                }
                if(customizedMessage.contains("{receipt download link}")){
                    String receiptDownloadLink = getReceiptLink(valMap, mobileNumber);
                    finalMessage = finalMessage.replace("{receipt download link}", receiptDownloadLink);
                }                
                SMSRequest smsRequest = new SMSRequest(mobileNumber,finalMessage);
                smsRequests.add(smsRequest);
            }
        }
        return smsRequests;
    }
    
    /**
     * Creates SMSRequest for the given mobileNumber with the given message removing receipt link
     * @param mobileNumber The set of mobileNumber for which SMSRequest has to be created
     * @param customizedMessage The message to sent
     * @return SMSRequest
     */
	private SMSRequest getSMSRequestsWithoutReceipt(String mobileNumber, String customizedMessage, Map<String, String> valMap) {

		String finalMessage = customizedMessage.replace("$mobile", mobileNumber);
		if (customizedMessage.contains("{receipt download link}")) {
			finalMessage = finalMessage.replace("Click on the link to download payment receipt <receipt download link}", "");
		}
		if (customizedMessage.contains("{payLink}")) {
			finalMessage = finalMessage.replace("{payLink}", getPaymentLink(valMap));
		}
		return new SMSRequest(mobileNumber, finalMessage);
	}

    /**
     *
     * @param requestInfo
     * @param property
     * @param isActionReq
     * @return
     */
    public List<Event> getEvents(List<SMSRequest> smsRequests, RequestInfo requestInfo,Property property, Boolean isActionReq,Map<String, String> valMap) {

        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
        String customizedMessage = smsRequests.get(0).getMessage();
        Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers,requestInfo, property.getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet()) || StringUtils.isEmpty(customizedMessage))
            return null;
        List<Event> events = new ArrayList<>();
        for(String mobile: mobileNumbers) {
            if(null == mapOfPhnoAndUUIDs.get(mobile)) {
                log.error("No UUID for mobile {} skipping event", mobile);
                continue;
            }
            List<String> toUsers = new ArrayList<>();
            toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
            Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
            Action action = null;
            if(isActionReq) {
                List<ActionItem> items = new ArrayList<>();
                String businessService = "";
                if(property.getChannel().toString().equalsIgnoreCase(MUTATION_PROCESS_CONSTANT)){
                    businessService = MUTATION_BUSINESSSERVICE;
                }else{
                    businessService = PT_BUSINESSSERVICE;
                }

                if(customizedMessage.contains("{payLink}") && customizedMessage.contains("{receipt download link}"))
                {
                    String actionLink = propertyConfiguration.getPayLink().replace("$mobile", mobile)
                            .replace("propertyId", property.getPropertyId())
                            .replace("$tenantId", property.getTenantId())
                            .replace("$businessService" , businessService);

                    actionLink = propertyConfiguration.getUiAppHost() + actionLink;

                    ActionItem item = ActionItem.builder().actionUrl(actionLink).code(PAY_PENDING_PAYMENT_CODE).build();
                    items.add(item);
                }

                if(customizedMessage.contains("{receipt download link}"))
                {
                    String actionLink = getReceiptLinkForInApp(valMap, mobile,businessService);
                    ActionItem item = ActionItem.builder().actionUrl(actionLink).code(DOWNLOAD_MUTATION_RECEIPT_CODE).build();
                    items.add(item);
                }
                action = Action.builder().actionUrls(items).build();

            }

            String description = removeForInAppMessage(customizedMessage);
            events.add(Event.builder().tenantId(property.getTenantId()).description(description)
                    .eventType(PTConstants.USREVENTS_EVENT_TYPE).name(PTConstants.USREVENTS_EVENT_NAME)
                    .postedBy(PTConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).actions(action).build());

        }


        return events;
    }


    private String getPaymentLink(Map<String,String> valMap){
        StringBuilder builder = new StringBuilder(propertyConfiguration.getUiAppHost());
        builder.append(propertyConfiguration.getPayLink());
        String url = builder.toString();
        url = url.replace("$propertyId", valMap.get("propertyId"));
        url = url.replace("$tenantId", valMap.get("tenantId"));
        url = url.replace("$businessService",PT_BUSINESSSERVICE);

        url = util.getShortenedUrl(url);
        return url;
    }

    /**
     * Method to remove certain lines from SMS templates
     * so that we can reuse the templates for in app notifications
     * returns the message minus some lines to match In App Templates
     * @param message
     */
    private String removeForInAppMessage(String message)
    {
        if(message.contains(PT_TAX_FAIL))
            message = message.replace(PT_TAX_FAIL,"");

        if(message.contains(PT_TAX_PARTIAL))
            message = message.replace(PT_TAX_PARTIAL,"");

        if(message.contains(PT_TAX_FULL))
            message = message.replace(PT_TAX_FULL,"");

        return message;
    }

}
