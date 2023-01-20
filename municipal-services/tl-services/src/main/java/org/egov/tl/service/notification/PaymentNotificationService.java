package org.egov.tl.service.notification;

import com.jayway.jsonpath.DocumentContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.TradeLicenseService;
import org.egov.tl.util.BPAConstants;
import org.egov.tl.util.BPANotificationUtil;
import org.egov.tl.util.NotificationUtil;
import org.egov.tl.util.TLRenewalNotificationUtil;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.collection.PaymentDetail;
import org.egov.tl.web.models.collection.PaymentRequest;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.egov.tl.util.BPAConstants.*;
import static org.egov.tl.util.TLConstants.*;
import static org.egov.tl.util.TLConstants.USREVENTS_EVENT_NAME;


@Service
@Slf4j
public class PaymentNotificationService {


    private TLConfiguration config;

    private TradeLicenseService tradeLicenseService;

    private NotificationUtil util;
    
    private ObjectMapper mapper;

    private BPANotificationUtil bpaNotificationUtil;

    private TLNotificationService tlNotificationService;

    private TLRenewalNotificationUtil tlRenewalNotificationUtil;

    @Autowired
    public PaymentNotificationService(TLConfiguration config, TradeLicenseService tradeLicenseService,
                                      NotificationUtil util, ObjectMapper mapper, BPANotificationUtil bpaNotificationUtil,TLNotificationService tlNotificationService,TLRenewalNotificationUtil tlRenewalNotificationUtil) {
        this.config = config;
        this.tradeLicenseService = tradeLicenseService;
        this.util = util;
        this.mapper = mapper;
        this.bpaNotificationUtil = bpaNotificationUtil;
        this.tlNotificationService = tlNotificationService;
        this.tlRenewalNotificationUtil=tlRenewalNotificationUtil;
    }





    final String tenantIdKey = "tenantId";

    final String businessServiceKey = "businessService";

    final String consumerCodeKey = "consumerCode";

    final String payerMobileNumberKey = "mobileNumber";

    final String paidByKey = "paidBy";

    final String amountPaidKey = "amountPaid";

    final String receiptNumberKey = "receiptNumber";

    final String payerNameKey = "payerName";

    /**
     * Generates sms from the input record and Sends smsRequest to SMSService
     * @param record The kafka message from receipt create topic
     */
    public void process(HashMap<String, Object> record){
        processBusinessService(record, businessService_TL);
        processBusinessService(record, businessService_BPA);
    }


    public void processBusinessService(HashMap<String, Object> record, String businessService)
    {
        try{
            TimeUnit.SECONDS.sleep(1);
            String jsonString = new JSONObject(record).toString();
            DocumentContext documentContext = JsonPath.parse(jsonString);
            Map<String,String> valMap = enrichValMap(documentContext, businessService);
            if(!StringUtils.equals(businessService,valMap.get(businessServiceKey)))
                return;
            Map<String, Object> info = documentContext.read("$.RequestInfo");
            RequestInfo requestInfo = mapper.convertValue(info, RequestInfo.class);

            if(valMap.get(businessServiceKey).equalsIgnoreCase(config.getBusinessServiceTL())||valMap.get(businessServiceKey).equalsIgnoreCase(config.getBusinessServiceBPA())){
                TradeLicense license = getTradeLicenseFromConsumerCode(valMap.get(tenantIdKey),valMap.get(consumerCodeKey),
                        requestInfo,valMap.get(businessServiceKey));


                String tenantId = license.getTenantId();
                String action = license.getAction();
                PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
                String receiptno = paymentRequest.getPayment().getPaymentDetails().get(0).getReceiptNumber();

                switch(valMap.get(businessServiceKey)) {
                    case businessService_TL:
                        String applicationType = String.valueOf(license.getApplicationType());
                        if (applicationType.equals(APPLICATION_TYPE_RENEWAL)) {
                            String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(license.getTenantId(), requestInfo);
                            List<SMSRequest> smsRequests = getSMSRequests(license, valMap, localizationMessages);
                            util.sendSMS(smsRequests, config.getIsTLSMSEnabled());
                            //message = tlRenewalNotificationUtil.getOwnerPaymentMsg(license,valMap,localizationMessages);

                            // Event Flow
                            String message = tlRenewalNotificationUtil.getOwnerPaymentMsg(license,valMap,localizationMessages);
                            log.info("Message to be sent: ",message);
                            TradeLicenseRequest tradeLicenseRequest=TradeLicenseRequest.builder().requestInfo(requestInfo).licenses(Collections.singletonList(license)).build();
                            EventRequest eventRequest = bpaNotificationUtil.getEventsForBPA(tradeLicenseRequest,true, message,receiptno, USREVENTS_EVENT_NAME);
                            if(null != eventRequest)
                                util.sendEventNotification(eventRequest);

                        } else {
                            String localizationMessages = util.getLocalizationMessages(license.getTenantId(), requestInfo);
                            List<SMSRequest> smsRequests = getSMSRequests(license, valMap, localizationMessages);
                            util.sendSMS(smsRequests, config.getIsTLSMSEnabled());

                            // Event Flow
                            String message = util.getOwnerPaymentMsg(license,valMap,localizationMessages);
                            log.info("Message to be sent: ",message);
                            TradeLicenseRequest tradeLicenseRequest=TradeLicenseRequest.builder().requestInfo(requestInfo).licenses(Collections.singletonList(license)).build();
                            EventRequest eventRequest = bpaNotificationUtil.getEventsForBPA(tradeLicenseRequest,true, message,receiptno, USREVENTS_EVENT_NAME);
                            if(null != eventRequest)
                                util.sendEventNotification(eventRequest);

                        }

                        break;

                    case businessService_BPA:
                        Map<Object, Object> configuredChannelList = tlNotificationService.fetchChannelList(new RequestInfo(), tenantId, businessService_BPA, action);
                        List<String> configuredChannelNames = (List<String>) configuredChannelList.get(action);

                        String localizationMessages = bpaNotificationUtil.getLocalizationMessages(license.getTenantId(), requestInfo);
                        String locMessage = bpaNotificationUtil.getMessageTemplate(NOTIFICATION_PENDINGDOCVERIFICATION, localizationMessages);
                        String message = bpaNotificationUtil.getReplacedMessage(license, locMessage);

                        if (!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_SMS))
                           {
                                Map<String, String> mobileNumberToOwner = new HashMap<>();

                                license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                                    if (owner.getMobileNumber() != null)
                                        mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
                                });

                                List<SMSRequest> smsList = new ArrayList<>();
                                smsList.addAll(bpaNotificationUtil.createSMSRequestForBPA(message, mobileNumberToOwner,license,receiptno));
                                util.sendSMS(smsList, config.getIsBPASMSEnabled());
                            }

                        if (!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_EVENT))
                        {
                            if(null != config.getIsUserEventsNotificationEnabledForBPA()) {
                                if(config.getIsUserEventsNotificationEnabledForBPA()) {
                                    TradeLicenseRequest tradeLicenseRequest=TradeLicenseRequest.builder().requestInfo(requestInfo).licenses(Collections.singletonList(license)).build();
                                    EventRequest eventRequest = bpaNotificationUtil.getEventsForBPA(tradeLicenseRequest,true, locMessage,receiptno, BPAConstants.USREVENTS_EVENT_NAME);
                                    if(null != eventRequest)
                                        util.sendEventNotification(eventRequest);
                                }
                            }
                        }

                        if (!CollectionUtils.isEmpty(configuredChannelNames) && configuredChannelNames.contains(CHANNEL_NAME_EMAIL))
                        {
                                    Map<String, String> mobileNumberToEmail = new HashMap<>();
                                    Set<String> mobileNumbers = new HashSet<>();
                                    license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                                        if (owner.getMobileNumber() != null)
                                            mobileNumbers.add(owner.getMobileNumber());
                                    });

                                    mobileNumberToEmail = util.fetchUserEmailIds(mobileNumbers, requestInfo, tenantId);

                                    String locMessageEmail = bpaNotificationUtil.getMessageTemplate(NOTIFICATION_PENDINGDOCVERIFICATION_EMAIL, localizationMessages);
                                    message = bpaNotificationUtil.getReplacedEmailMessage(requestInfo, license, locMessageEmail);

                                    List<EmailRequest> emailRequestsForBPA = new LinkedList<>();
                                    emailRequestsForBPA.addAll(bpaNotificationUtil.createEmailRequestForBPA(requestInfo,message, mobileNumberToEmail,license,receiptno));
                                    if (!CollectionUtils.isEmpty(emailRequestsForBPA))
                                        util.sendEmail(emailRequestsForBPA, config.getIsEmailNotificationEnabledForBPA());

                        }
                        break;
                }
            }
        }
        catch (Exception e){
			log.error("NOTIFICATION_ERROR", e);
        }
    }
    /**
     * Creates the SMSRequest
     * @param license The TradeLicense for which the receipt is generated
     * @param valMap The valMap containing the values from receipt
     * @param localizationMessages The localization message to be sent
     * @return
     */
    private List<SMSRequest> getSMSRequests(TradeLicense license, Map<String,String> valMap,String localizationMessages){
            List<SMSRequest> ownersSMSRequest = getOwnerSMSRequest(license,valMap,localizationMessages);
            SMSRequest payerSMSRequest = getPayerSMSRequest(license,valMap,localizationMessages);

            List<SMSRequest> totalSMS = new LinkedList<>();
            totalSMS.addAll(ownersSMSRequest);
            totalSMS.add(payerSMSRequest);

            return totalSMS;
    }


    /**
     * Creates SMSRequest for the owners
     * @param license The tradeLicense for which the receipt is created
     * @param valMap The Map containing the values from receipt
     * @param localizationMessages The localization message to be sent
     * @return The list of the SMS Requests
     */
    private List<SMSRequest> getOwnerSMSRequest(TradeLicense license, Map<String,String> valMap,String localizationMessages){
        String applicationType = String.valueOf(license.getApplicationType());
        String message=null;
        if(applicationType.equals(APPLICATION_TYPE_RENEWAL)){
            message = tlRenewalNotificationUtil.getOwnerPaymentMsg(license,valMap,localizationMessages);
        }
        else
             message = util.getOwnerPaymentMsg(license,valMap,localizationMessages);

        HashMap<String,String> mobileNumberToOwnerName = new HashMap<>();
        license.getTradeLicenseDetail().getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwnerName.put(owner.getMobileNumber(),owner.getName());
        });

        List<SMSRequest> smsRequests = new LinkedList<>();

        for(Map.Entry<String,String> entrySet : mobileNumberToOwnerName.entrySet()){
            String customizedMsg = message.replace("{1}",entrySet.getValue());
            smsRequests.add(new SMSRequest(entrySet.getKey(),customizedMsg));
        }
        return smsRequests;
    }


    /**
     * Creates SMSRequest to be send to the payer
     * @param valMap The Map containing the values from receipt
     * @param localizationMessages The localization message to be sent
     * @return
     */
    private SMSRequest getPayerSMSRequest(TradeLicense license,Map<String,String> valMap,String localizationMessages){
        String applicationType = String.valueOf(license.getApplicationType());
        String message=null;
        if(applicationType.equals(APPLICATION_TYPE_RENEWAL)){
            message = tlRenewalNotificationUtil.getPayerPaymentMsg(license,valMap,localizationMessages);
        }
        else
            message = util.getPayerPaymentMsg(license,valMap,localizationMessages);

        String customizedMsg = message.replace("{1}",valMap.get(payerNameKey));
        SMSRequest smsRequest = new SMSRequest(valMap.get(payerMobileNumberKey),customizedMsg);
        return smsRequest;
    }


    /**
     * Enriches the map with values from receipt
     * @param context The documentContext of the receipt
     * @return The map containing required fields from receipt
     */
    private Map<String,String> enrichValMap(DocumentContext context, String businessService){
        Map<String,String> valMap = new HashMap<>();
        try{

            List <String>businessServiceList=context.read("$.Payment.paymentDetails[?(@.businessService=='"+businessService+"')].businessService");
            List <String>consumerCodeList=context.read("$.Payment.paymentDetails[?(@.businessService=='"+businessService+"')].bill.consumerCode");
            List <String>mobileNumberList=context.read("$.Payment.paymentDetails[?(@.businessService=='"+businessService+"')].bill.mobileNumber");
            List <Integer>amountPaidList=context.read("$.Payment.paymentDetails[?(@.businessService=='"+businessService+"')].bill.amountPaid");
            List <String>receiptNumberList=context.read("$.Payment.paymentDetails[?(@.businessService=='"+businessService+"')].receiptNumber");
            valMap.put(businessServiceKey,businessServiceList.isEmpty()?null:businessServiceList.get(0));
            valMap.put(consumerCodeKey,consumerCodeList.isEmpty()?null:consumerCodeList.get(0));
            valMap.put(tenantIdKey,context.read("$.Payment.tenantId"));
            valMap.put(payerMobileNumberKey,context.read("$.Payment.mobileNumber"));
            valMap.put(paidByKey,context.read("$.Payment.paidBy"));
            valMap.put(amountPaidKey,amountPaidList.isEmpty()?null:String.valueOf(amountPaidList.get(0)));
            valMap.put(receiptNumberKey,receiptNumberList.isEmpty()?null:receiptNumberList.get(0));
            valMap.put(payerNameKey,context.read("$.Payment.payerName"));
        }
        catch (Exception e){
            throw new CustomException("RECEIPT ERROR","Unable to fetch values from receipt");
        }
        return valMap;
    }


    /**
     * Searches the tradeLicense based on the consumer code as applicationNumber
     * @param tenantId tenantId of the tradeLicense
     * @param consumerCode The consumerCode of the receipt
     * @param requestInfo The requestInfo of the request
     * @return TradeLicense for the particular consumerCode
     */
    private TradeLicense getTradeLicenseFromConsumerCode(String tenantId,String consumerCode,RequestInfo requestInfo, String businessService){

        TradeLicenseSearchCriteria searchCriteria = new TradeLicenseSearchCriteria();
        searchCriteria.setApplicationNumber(consumerCode);
        searchCriteria.setTenantId(tenantId);
        searchCriteria.setBusinessService(businessService);
        List<TradeLicense> licenses = tradeLicenseService.getLicensesWithOwnerInfo(searchCriteria,requestInfo);

        if(CollectionUtils.isEmpty(licenses))
            throw new CustomException("INVALID RECEIPT","No license found for the consumerCode: "
                    +consumerCode+" and tenantId: "+tenantId);

        if(licenses.size()!=1)
            throw new CustomException("INVALID RECEIPT","Multiple license found for the consumerCode: "
                    +consumerCode+" and tenantId: "+tenantId);

        return licenses.get(0);

    }


}
