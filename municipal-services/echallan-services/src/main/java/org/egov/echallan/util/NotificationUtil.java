package org.egov.echallan.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.*;

import org.egov.echallan.model.*;
import org.egov.echallan.producer.Producer;
import org.egov.echallan.web.models.collection.PaymentResponse;
import org.egov.echallan.web.models.uservevents.EventRequest;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.repository.ServiceRequestRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.egov.echallan.util.ChallanConstants.*;


import java.math.BigDecimal;
import java.util.*;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.echallan.util.ChallanConstants.*;
import static org.springframework.util.StringUtils.capitalize;


@Component
@Slf4j
public class NotificationUtil {
	public static final String NOTIFICATION_LOCALE = "en_IN";
	public static final String MODULE ="rainmaker-uc";
	private static final String CODES = "echallan.create.sms";
	public static final String BILL_AMOUNT_JSONPATH = "$.Bill[0].totalAmount";
	public static final String BILL_DUEDATE = "$.Bill[0].billDetails[0].expiryDate";
	public static final String BUSINESSSERVICELOCALIZATION_CODE_PREFIX = "BILLINGSERVICE_BUSINESSSERVICE_";
	public static final String LOCALIZATION_CODES_JSONPATH = "$.messages[0].code";
	public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages[0].message";
	public static final String LOCALIZATION_TEMPLATEID_JSONPATH = "$.messages[0].templateId";
	public static final String MSG_KEY="message";
	public static final String TEMPLATE_KEY="templateId";
//	private static final String CREATE_CODE = "echallan.create.sms";
//	private static final String UPDATE_CODE = "echallan.update.sms";
//	private static final String CANCEL_CODE = "echallan.cancel.sms";
	private ChallanConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private RestTemplate restTemplate;

	private Producer producer;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	public NotificationUtil(ChallanConfiguration config, ServiceRequestRepository serviceRequestRepository,
			RestTemplate restTemplate, Producer producer) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.restTemplate = restTemplate;
		this.producer=producer;
	}


	
	private String getReplacedMsg(RequestInfo requestInfo,Challan challan, String message) {
		if (challan.getApplicationStatus() != Challan.StatusEnum.CANCELLED) {
			String billDetails = getBillDetails(requestInfo, challan);
			Object obj = JsonPath.parse(billDetails).read(BILL_AMOUNT_JSONPATH);
			BigDecimal amountToBePaid = new BigDecimal(obj.toString());
			message = message.replace("{challanAmount}", amountToBePaid.toString());
		}

		message = message.replace("{User}",challan.getCitizen().getName());
        message = message.replace("{challanno}", challan.getChallanNo());
		if(message.contains("{ULB}"))
			message = message.replace("{ULB}", capitalize(challan.getTenantId().split("\\.")[1]));

		String[] split_array = capitalize(challan.getBusinessService().split("\\.")[1]).split("_");
		String service = String.join(" ", split_array);
		message = message.replace("{service}", service);

        String UIHost = config.getUiAppHost();
		String paymentPath = config.getPayLinkSMS();
		paymentPath = paymentPath.replace("$consumercode",challan.getChallanNo());
		paymentPath = paymentPath.replace("$tenantId",challan.getTenantId());
		paymentPath = paymentPath.replace("$businessservice",challan.getBusinessService());
		String finalPath = UIHost + paymentPath;
		if(message.contains("{Link}"))
			message = message.replace("{Link}",getShortenedUrl(finalPath));

        return message;
    }

	private String getPaymentMsg(RequestInfo requestInfo,Challan challan, String message) {
		ChallanRequest challanRequest = new ChallanRequest(requestInfo,challan);
		message = message.replace("{User}",challan.getCitizen().getName());
		message = message.replace("{challanno}", challan.getChallanNo());

        PaymentResponse paymentResponse = getPaymentObject(challanRequest);

		message = message.replace("{Payment_Amount}",paymentResponse.getPayments().get(0).getTotalAmountPaid().toString());
		message = message.replace("{Payment_Mode}",paymentResponse.getPayments().get(0).getPaymentMode().toLowerCase());
		message = message.replace("{Payment_No}",paymentResponse.getPayments().get(0).getPaymentDetails().get(0).getReceiptNumber());
		message = message.replace("{challanno}",paymentResponse.getPayments().get(0).getPaymentMode());

		if(message.contains("{Online_Receipt_Link}"))
			message = message.replace("{Online_Receipt_Link}", getRecepitDownloadLink(challanRequest,paymentResponse,challanRequest.getChallan().getCitizen().getMobileNumber()));

	    if(message.contains("{ULB}"))
			message = message.replace("{ULB}", capitalize(challan.getTenantId().split("\\.")[1]));

		return message;
	}

	private String formatCodes(String code) {
		String regexForSpecialCharacters = "[$&+,:;=?@#|'<>.^*()%!-]";
		code = code.replaceAll(regexForSpecialCharacters, "_");
		code = code.replaceAll(" ", "_");

		return BUSINESSSERVICELOCALIZATION_CODE_PREFIX + code.toUpperCase();
	}

	
	private String getBillDetails(RequestInfo requestInfo, Challan challan) {

		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getBillUri(challan),
				new RequestInfoWrapper(requestInfo));
		
		String jsonString = new JSONObject(responseMap).toString();

		return jsonString;
	}
	
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
	 * Returns the uri for the localization call
	 * 
	 * @param tenantId
	 *            TenantId of the challan
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
				.append("&tenantId=").append(tenantId).append("&module=").append(MODULE);

		return uri;
	}
	
	private StringBuilder getBillUri(Challan challan) {
		StringBuilder builder = new StringBuilder(config.getBillingHost());
		builder.append(config.getFetchBillEndpoint());
		builder.append("?tenantId=");
		builder.append(challan.getTenantId());
		builder.append("&consumerCode=");
		builder.append(challan.getChallanNo());
		builder.append("&businessService=");
		builder.append(challan.getBusinessService());
		return builder;
	}

	public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getMdmsHost()).append(config.getMdmsEndPoint());
		if(StringUtils.isEmpty(tenantId))
			return masterData;
		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

		Filter masterDataFilter = filter(
				where(ChallanConstants.MODULE).is(moduleName).and(ACTION).is(action)
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
	 * Send the EmailRequest on the EmailNotification kafka topic
	 *
	 * @param emailRequestList
	 *            The list of EmailRequest to be sent
	 */
	public void sendEmail(List<EmailRequest> emailRequestList) {

		if (config.getIsEmailNotificationEnabled()) {
			if (CollectionUtils.isEmpty(emailRequestList))
				log.debug("Messages from localization couldn't be fetched!");
			for (EmailRequest emailRequest : emailRequestList) {
				producer.push(config.getEmailNotifTopic(), emailRequest);
				log.debug("Email Request -> "+emailRequest.getEmail().toString());
				log.debug("EMAIL notification sent!");
			}
		}
	}

	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 *
	 * @param smsRequestList
	 *            The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList, boolean isSMSEnabled) {
		if (isSMSEnabled) {
			if (CollectionUtils.isEmpty(smsRequestList))
				log.debug("Messages from localization couldn't be fetched!");
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.debug("MobileNumber: " + smsRequest.getMobileNumber() + " Messages: " + smsRequest.getMessage());
			}
		}
	}


	public void sendEventNotification(EventRequest request) {
		producer.push(config.getSaveUserEventsTopic(), request);
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
				Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
				if(null != user) {
					if(JsonPath.read(user, "$.user[0].emailId")!=null) {
						String email = JsonPath.read(user, "$.user[0].emailId");
						if(email!=null && !StringUtils.isEmpty(email) )
							mapOfPhnoAndEmailIds.put(mobileNo, email);
					}
					else {
						log.error("Service returned null while fetching email for username - "+mobileNo);
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
	 * Fetches messages from localization service
	 *
	 * @param tenantId
	 *            tenantId of the BPA
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return Localization messages for the module
	 */
	@SuppressWarnings("rawtypes")
	public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {

		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
				requestInfo);
		String jsonString = new JSONObject(responseMap).toString();
		return jsonString;
	}

	/**
	 * Creates customized message based on bpa
	 *
	 * @param challan
	 *            The challan for which message is to be sent
	 * @param messageCode
	 *            The message code for localization
	 * @return customized message based on challan and code
	 */
	@SuppressWarnings("unchecked")
	public String getCustomizedMsg(RequestInfo requestInfo, Challan challan, String messageCode) {
		String localizationMessages = getLocalizationMessages(challan.getTenantId(), requestInfo);
		String message = null, messageTemplate;

		if(messageCode.equals(CREATE_CODE) || messageCode.equals(CREATE_CODE_INAPP))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(UPDATE_CODE) || messageCode.equals(UPDATE_CODE_INAPP))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(CANCEL_CODE) || messageCode.equals(CANCEL_CODE_INAPP))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(PAYMENT_CODE) || messageCode.equals(PAYMENT_CODE_INAPP))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getPaymentMsg(requestInfo,challan,messageTemplate);
		}

		return message;
	}

	/**
	 * Creates customized message based on bpa
	 *
	 * @param challan
	 *            The challan for which message is to be sent
	 * @param messageCode
	 *            The message code for localization
	 * @return customized message based on bpa
	 */
	@SuppressWarnings("unchecked")
	public String getEmailCustomizedMsg(RequestInfo requestInfo, Challan challan, String messageCode) {
		String localizationMessages = getLocalizationMessages(challan.getTenantId(), requestInfo);
		String message = null, messageTemplate;

		if(messageCode.equals(CREATE_CODE_EMAIL))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(UPDATE_CODE_EMAIL))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(CANCEL_CODE_EMAIL))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getReplacedMsg(requestInfo,challan,messageTemplate);
		}
		else if(messageCode.equals(PAYMENT_CODE_EMAIL))
		{
			messageTemplate = getMessageTemplate(messageCode, localizationMessages);
			message  = getPaymentMsg(requestInfo,challan,messageTemplate);
		}

		return message;
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
	@SuppressWarnings("rawtypes")
	public String getMessageTemplate(String notificationCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", notificationCode);
		String message = null;
		try {
			List data = JsonPath.parse(localizationMessage).read(path);
			if (!CollectionUtils.isEmpty(data))
				message = data.get(0).toString();
			else
				log.error("Fetching from localization failed with code " + notificationCode);
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}

	public String getRecepitDownloadLink(ChallanRequest challanRequest, PaymentResponse paymentResponse, String mobileno) {

		String receiptNumber = paymentResponse.getPayments().get(0).getPaymentDetails().get(0).getReceiptNumber();
		String consumerCode = challanRequest.getChallan().getChallanNo();

		String link = config.getUiAppHost() + config.getReceiptDownloadLink();
		link = link.replace("$consumerCode", consumerCode);
		link = link.replace("$tenantId", challanRequest.getChallan().getTenantId());
		link = link.replace("$businessService", challanRequest.getChallan().getBusinessService());
		link = link.replace("$receiptNumber", receiptNumber);
		link = link.replace("$mobile", mobileno);
		link = getShortenedUrl(link);
		log.info(link);
		return link;
	}

	public PaymentResponse getPaymentObject(ChallanRequest challanRequest){
		String consumerCode,service;

		consumerCode = challanRequest.getChallan().getChallanNo();
		service = challanRequest.getChallan().getBusinessService();

		StringBuilder URL = getcollectionURL();
		URL.append(service).append("/_search").append("?").append("consumerCodes=").append(consumerCode)
				.append("&").append("tenantId=").append(challanRequest.getChallan().getTenantId());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(challanRequest.getRequestInfo()).build();
		Object response = serviceRequestRepository.fetchResult(URL,requestInfoWrapper);
		PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
		return paymentResponse;
	}

	public StringBuilder getcollectionURL() {
		StringBuilder builder = new StringBuilder();
		return builder.append(config.getCollectionServiceHost()).append(config.getCollectionServiceSearchEndPoint());
	}

}
