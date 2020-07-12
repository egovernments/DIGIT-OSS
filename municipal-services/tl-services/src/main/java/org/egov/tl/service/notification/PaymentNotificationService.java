package org.egov.tl.service.notification;

import com.jayway.jsonpath.DocumentContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import net.minidev.json.JSONArray;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.TradeLicenseService;
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

import static org.egov.tl.util.BPAConstants.NOTIFICATION_APPROVED;
import static org.egov.tl.util.BPAConstants.NOTIFICATION_PENDINGDOCVERIFICATION;
import static org.egov.tl.util.TLConstants.*;


@Service
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


    /**
     * Generates sms from the input record and Sends smsRequest to SMSService
     * @param record The kafka message from receipt create topic
     */
    public void process(HashMap<String, Object> record){
        processBusinessService(record, businessService_TL);
        processBusinessService(record, businessService_BPA);
    }


    private void processBusinessService(HashMap<String, Object> record, String businessService)
    {
        try{
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
                switch(valMap.get(businessServiceKey))
                {
                    case businessService_TL:
                        String applicationType = String.valueOf(license.getApplicationType());
                        if(applicationType.equals(APPLICATION_TYPE_RENEWAL)){
                            String localizationMessages = tlRenewalNotificationUtil.getLocalizationMessages(license.getTenantId(), requestInfo);
                            List<SMSRequest> smsRequests = getSMSRequests(license, valMap, localizationMessages);
                            util.sendSMS(smsRequests, config.getIsTLSMSEnabled());
                        }
                        else{
                            String localizationMessages = util.getLocalizationMessages(license.getTenantId(), requestInfo);
                            List<SMSRequest> smsRequests = getSMSRequests(license, valMap, localizationMessages);
                            util.sendSMS(smsRequests, config.getIsTLSMSEnabled());
                        }

                        break;

                    case businessService_BPA:
                        String localizationMessages = bpaNotificationUtil.getLocalizationMessages(license.getTenantId(), requestInfo);
                        PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
                        String totalAmountPaid = paymentRequest.getPayment().getTotalAmountPaid().toString();
                        Map<String, String> mobileNumberToOwner = new HashMap<>();
                        String locMessage = bpaNotificationUtil.getMessageTemplate(NOTIFICATION_PENDINGDOCVERIFICATION, localizationMessages);
                        String message = bpaNotificationUtil.getPendingDocVerificationMsg(license, locMessage, localizationMessages, totalAmountPaid);
                        license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                            if (owner.getMobileNumber() != null)
                                mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
                        });
                        List<SMSRequest> smsList = new ArrayList<>();
                        smsList.addAll(util.createSMSRequest(message, mobileNumberToOwner));
                        util.sendSMS(smsList, config.getIsBPASMSEnabled());

                        if(null != config.getIsUserEventsNotificationEnabledForBPA()) {
                            if(config.getIsUserEventsNotificationEnabledForBPA()) {
                                TradeLicenseRequest tradeLicenseRequest=TradeLicenseRequest.builder().requestInfo(requestInfo).licenses(Collections.singletonList(license)).build();
                                EventRequest eventRequest = tlNotificationService.getEventsForBPA(tradeLicenseRequest,true, message);
                                if(null != eventRequest)
                                    util.sendEventNotification(eventRequest);
                            }
                        }
                        break;
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
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
            String payerMobileNumber=valMap.get(payerMobileNumberKey);
            long count= license.getTradeLicenseDetail().getOwners().stream().filter(owner->owner.getMobileNumber().equals(payerMobileNumber)).count();
           		 		 
            if(count==0){
              totalSMS.add(payerSMSRequest);
            }

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
            String customizedMsg = message.replace("<1>",entrySet.getValue());
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

        String customizedMsg = message.replace("<1>",valMap.get(paidByKey));
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
            valMap.put(payerMobileNumberKey,mobileNumberList.isEmpty()?null:mobileNumberList.get(0));
            valMap.put(paidByKey,context.read("$.Payment.paidBy"));
            valMap.put(amountPaidKey,amountPaidList.isEmpty()?null:String.valueOf(amountPaidList.get(0)));
            valMap.put(receiptNumberKey,receiptNumberList.isEmpty()?null:receiptNumberList.get(0));
        }
        catch (Exception e){
            e.printStackTrace();
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
