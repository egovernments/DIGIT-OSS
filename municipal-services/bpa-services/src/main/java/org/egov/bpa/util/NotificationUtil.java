package org.egov.bpa.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.producer.Producer;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.service.EDCRService;
import org.egov.bpa.service.UserService;
import org.egov.bpa.web.model.*;
import org.egov.bpa.web.model.collection.PaymentResponse;
import org.egov.bpa.web.model.user.UserDetailResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.bpa.util.BPAConstants.*;
import static org.springframework.util.StringUtils.capitalize;

@Component
@Slf4j
public class NotificationUtil {

	private static final String STAKEHOLDER_TYPE = "{STAKEHOLDER_TYPE}";

    private static final String STAKEHOLDER_NAME = "{STAKEHOLDER_NAME}";

    private static final String AMOUNT_TO_BE_PAID = "{AMOUNT_TO_BE_PAID}";

    private BPAConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private Producer producer;
	
	private EDCRService edcrService;
	
	private BPAUtil bpaUtil;

	private RestTemplate restTemplate;

	@Autowired
	private UserService userService;

	@Autowired
	private ObjectMapper mapper;


	@Autowired
	public NotificationUtil(BPAConfiguration config, ServiceRequestRepository serviceRequestRepository,
			Producer producer, EDCRService edcrService, BPAUtil bpaUtil) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.producer = producer;
		this.edcrService = edcrService;
		this.bpaUtil = bpaUtil;
		this.restTemplate = restTemplate;
	}

	final String receiptNumberKey = "receiptNumber";

	final String amountPaidKey = "amountPaid";
	private String URL = "url";


	/**
	 * Creates customized message based on bpa
	 * 
	 * @param bpa
	 *            The bpa for which message is to be sent
	 * @param localizationMessage
	 *            The messages from localization
	 * @return customized message based on bpa
	 */
	@SuppressWarnings("unchecked")
	public String getCustomizedMsg(RequestInfo requestInfo, BPA bpa, String localizationMessage) {
		String message = null, messageTemplate;
		Map<String, String> edcrResponse = edcrService.getEDCRDetails(requestInfo, bpa);
		
		String applicationType = edcrResponse.get(BPAConstants.APPLICATIONTYPE);
		String serviceType = edcrResponse.get(BPAConstants.SERVICETYPE);

		if (bpa.getStatus().toString().toUpperCase().equals(BPAConstants.STATUS_REJECTED)) {
			messageTemplate = getMessageTemplate(
					applicationType + "_" + serviceType + "_" + BPAConstants.STATUS_REJECTED, localizationMessage);
			message = getInitiatedMsg(bpa, messageTemplate, serviceType);
		} else {

			String messageCode = applicationType + "_" + serviceType + "_" + bpa.getWorkflow().getAction() + "_"
					+ bpa.getStatus();

			messageTemplate = getMessageTemplate(messageCode, localizationMessage);
			if (!StringUtils.isEmpty(messageTemplate)) {
				message = getInitiatedMsg(bpa, messageTemplate, serviceType);

				if (message.contains(AMOUNT_TO_BE_PAID)) {
					BigDecimal amount = getAmountToBePaid(requestInfo, bpa);
					message = message.replace(AMOUNT_TO_BE_PAID, amount.toString());
				}
				message = getLinksReplaced(message,bpa);
			}
		}
		return message;
	}

	@SuppressWarnings("unchecked")
	// As per OAP-304, keeping the same messages for Events and SMS, so removed
	// "M_" prefix for the localization codes.
	// so it will be same as the getCustomizedMsg
	public String getEventsCustomizedMsg(RequestInfo requestInfo, BPA bpa, Map<String, String> edcrResponse, String localizationMessage) {
		String message = null, messageTemplate;
		String applicationType = edcrResponse.get(BPAConstants.APPLICATIONTYPE);
		String serviceType = edcrResponse.get(BPAConstants.SERVICETYPE);
		
		if (bpa.getStatus().toString().toUpperCase().equals(BPAConstants.STATUS_REJECTED)) {
			messageTemplate = getMessageTemplate(BPAConstants.M_APP_REJECTED, localizationMessage);
			message = getInitiatedMsg(bpa, messageTemplate, serviceType);
		} else {
			String messageCode = applicationType + "_" + serviceType + "_" + bpa.getWorkflow().getAction()
					+ "_" + bpa.getStatus();
			messageTemplate = getMessageTemplate(messageCode, localizationMessage);
			if (!StringUtils.isEmpty(messageTemplate)) {
				message = getInitiatedMsg(bpa, messageTemplate, serviceType);
				if (message.contains(AMOUNT_TO_BE_PAID)) {
					BigDecimal amount = getAmountToBePaid(requestInfo, bpa);
					message = message.replace(AMOUNT_TO_BE_PAID, amount.toString());
				}
				message = getLinksRemoved(message,bpa);
			}
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

	/**
	 * Fetches the amount to be paid from getBill API
	 * 
	 * @param requestInfo
	 *            The RequestInfo of the request
	 * @param bpa
	 *            The BPA object
	 * @return
	 */
	private BigDecimal getAmountToBePaid(RequestInfo requestInfo, BPA bpa) {

		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(bpaUtil.getBillUri(bpa),
				new RequestInfoWrapper(requestInfo));
		JSONObject jsonObject = new JSONObject(responseMap);
		BigDecimal amountToBePaid;
		double amount = 0.0;
		try {
			JSONArray demandArray = (JSONArray) jsonObject.get("Demands");
			if (demandArray != null) {
				JSONObject firstElement = (JSONObject) demandArray.get(0);
				if (firstElement != null) {
					JSONArray demandDetails = (JSONArray) firstElement.get("demandDetails");
					if (demandDetails != null) {
						for (int i = 0; i < demandDetails.length(); i++) {
							JSONObject object = (JSONObject) demandDetails.get(i);
							Double taxAmt = Double.valueOf((object.get("taxAmount").toString()));
							amount = amount + taxAmt;
						}
					}
				}
			}
			amountToBePaid = BigDecimal.valueOf(amount);
		} catch (Exception e) {
			throw new CustomException("PARSING ERROR",
					"Failed to parse the response using jsonPath: "
							+ BILL_AMOUNT);
		}
		return amountToBePaid;
	}

	

	/**
	 * Returns the uri for the localization call
	 * 
	 * @param tenantId
	 *            TenantId of the propertyRequest
	 * @return The uri for localization search call
	 */
	public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

		if (config.getIsLocalizationStateLevel())
			tenantId = tenantId.split("\\.")[0];

		String locale = "en_IN";
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(BPAConstants.SEARCH_MODULE);
		return uri;
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
	 * Creates customized message for initiate
	 * 
	 * @param bpa
	 *            tenantId of the bpa
	 * @param message
	 *            Message from localization for initiate
	 * @return customized message for initiate
	 */
	private String getInitiatedMsg(BPA bpa, String message, String serviceType) {
		if("NEW_CONSTRUCTION".equals(serviceType))
			message = message.replace("{2}", "New Construction");
		else
			message = message.replace("{2}", serviceType);

		message = message.replace("{3}", bpa.getApplicationNo());
		return message;
	}


	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * 
	 * @param smsRequestList
	 *            The list of SMSRequest to be sent
	 */
	public void sendSMS(List<org.egov.bpa.web.model.SMSRequest> smsRequestList, boolean isSMSEnabled) {
		if (isSMSEnabled) {
			if (CollectionUtils.isEmpty(smsRequestList))
				log.info("Messages from localization couldn't be fetched!");
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.debug("MobileNumber: " + smsRequest.getMobileNumber() + " Messages: " + smsRequest.getMessage());
			}
			log.info("SMS notifications sent!");
		}
	}

	/**
	 * Creates sms request for the each owners
	 * 
	 * @param message
	 *            The message for the specific bpa
	 * @param mobileNumberToOwner
	 *            Map of mobileNumber to OwnerName
	 * @return List of SMSRequest
	 */
	public List<SMSRequest> createSMSRequest(BPARequest bpaRequest,String message, Map<String, String> mobileNumberToOwner) {
		List<SMSRequest> smsRequest = new LinkedList<>();

		for (Map.Entry<String, String> entryset : mobileNumberToOwner.entrySet()) {
			String customizedMsg = message.replace("{1}", entryset.getValue());
			if (customizedMsg.contains("{RECEIPT_LINK}")) {
				String linkToReplace = getApplicationDetailsPageLink(bpaRequest, entryset.getKey());
//				log.info("Link to replace - "+linkToReplace);
				customizedMsg = customizedMsg.replace("{RECEIPT_LINK}",linkToReplace);
			}
			if (customizedMsg.contains(PAYMENT_LINK_PLACEHOLDER)) {
				BPA bpa = bpaRequest.getBPA();
				String busineService = bpaUtil.getFeeBusinessSrvCode(bpa);
				String link = config.getUiAppHost() + config.getPayLink()
						.replace("$applicationNo", bpa.getApplicationNo()).replace("$mobile", entryset.getKey())
						.replace("$tenantId", bpa.getTenantId()).replace("$businessService", busineService);
				link = getShortnerURL(link);
				customizedMsg = customizedMsg.replace(PAYMENT_LINK_PLACEHOLDER, link);
			}
			smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
		}
		return smsRequest;
	}
	
	
	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request
	 */
	public void sendEventNotification(EventRequest request) {
		producer.push(config.getSaveUserEventsTopic(), request);

		log.debug("STAKEHOLDER:: " + request.getEvents().get(0).getDescription());
	}

	public String getEmailCustomizedMsg(RequestInfo requestInfo, BPA bpa, String localizationMessage) {
		String message = null, messageTemplate;
		Map<String, String> edcrResponse = edcrService.getEDCRDetails(requestInfo, bpa);

		String applicationType = edcrResponse.get(BPAConstants.APPLICATIONTYPE);
		String serviceType = edcrResponse.get(BPAConstants.SERVICETYPE);

		if (bpa.getStatus().toString().toUpperCase().equals(BPAConstants.STATUS_REJECTED)) {
			messageTemplate = getMessageTemplate(
					applicationType + "_" + serviceType + "_" + BPAConstants.STATUS_REJECTED + "_" + "EMAIL", localizationMessage);
			message = getReplacedMessage(bpa, messageTemplate,serviceType);
		} else {
			String messageCode = applicationType + "_" + serviceType + "_" + bpa.getWorkflow().getAction() + "_"
					+ bpa.getStatus() + "_" + "EMAIL";

			messageTemplate = getMessageTemplate(messageCode, localizationMessage);

			if (!StringUtils.isEmpty(messageTemplate)) {
				message = getReplacedMessage(bpa, messageTemplate,serviceType);

				if (message.contains(AMOUNT_TO_BE_PAID)) {
					BigDecimal amount = getAmountToBePaid(requestInfo, bpa);
					message = message.replace(AMOUNT_TO_BE_PAID, amount.toString());
				}
				if(message.contains(STAKEHOLDER_NAME) || message.contains(STAKEHOLDER_TYPE))
				{
					message  = getStakeHolderDetailsReplaced(requestInfo,bpa, message);
				}
				message = getLinksReplaced(message,bpa);
			}
		}
		return message;
	}
			public String getStakeHolderDetailsReplaced(RequestInfo requestInfo, BPA bpa, String message)
		{
				String stakeUUID = bpa.getAuditDetails().getCreatedBy();
				List<String> ownerId = new ArrayList<String>();
				ownerId.add(stakeUUID);
				BPASearchCriteria bpaSearchCriteria = new BPASearchCriteria();
				bpaSearchCriteria.setOwnerIds(ownerId);
				bpaSearchCriteria.setTenantId(bpa.getTenantId());
				UserDetailResponse userDetailResponse = userService.getUser(bpaSearchCriteria,requestInfo);
				if(message.contains(STAKEHOLDER_TYPE))
				{message = message.replace(STAKEHOLDER_TYPE, userDetailResponse.getUser().get(0).getType());}
			if(message.contains(STAKEHOLDER_NAME))
			{message = message.replace(STAKEHOLDER_NAME, userDetailResponse.getUser().get(0).getName());}

			 return message;
		}

		private String getReplacedMessage(BPA bpa, String message,String serviceType) {

		if("NEW_CONSTRUCTION".equals(serviceType))
			message = message.replace("{2}", "New Construction");
		else
			message = message.replace("{2}", serviceType);

			message = message.replace("{3}", bpa.getApplicationNo());
		message = message.replace("{Ulb Name}", capitalize(bpa.getTenantId().split("\\.")[1]));
		message = message.replace("{PORTAL_LINK}",config.getUiAppHost());
		//CCC - Designaion configurable according to ULB
		// message = message.replace("CCC","");
		return message;
	}

	public List<EmailRequest> createEmailRequest(BPARequest bpaRequest,String message, Map<String, String> mobileNumberToEmailId, Map<String, String> mobileNumberToOwner) {

		List<EmailRequest> emailRequest = new LinkedList<>();

		for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
			String customizedMsg = message.replace("{1}",mobileNumberToOwner.get(entryset.getKey()));
			customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());
			if (customizedMsg.contains("{RECEIPT_LINK}")) {
				String linkToReplace = getApplicationDetailsPageLink(bpaRequest, entryset.getKey());
//				log.info("Link to replace - "+linkToReplace);
				customizedMsg = customizedMsg.replace("{RECEIPT_LINK}",linkToReplace);
			}
			if (customizedMsg.contains(PAYMENT_LINK_PLACEHOLDER)) {
				BPA bpa = bpaRequest.getBPA();
				String busineService = bpaUtil.getFeeBusinessSrvCode(bpa);
				String link = config.getUiAppHost() + config.getPayLink()
						.replace("$applicationNo", bpa.getApplicationNo()).replace("$mobile", entryset.getKey())
						.replace("$tenantId", bpa.getTenantId()).replace("$businessService", busineService);
                link = getShortnerURL(link);
				customizedMsg = customizedMsg.replace(PAYMENT_LINK_PLACEHOLDER, link);
			}
			String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
			String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
			Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
			EmailRequest email = new EmailRequest(bpaRequest.getRequestInfo(),emailobj);
			emailRequest.add(email);
		}
		return emailRequest;
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
				log.info("Messages from localization couldn't be fetched!");
			for (EmailRequest emailRequest : emailRequestList) {
				producer.push(config.getEmailNotifTopic(), emailRequest);
				log.info("Email Request -> "+emailRequest.toString());
				log.info("EMAIL notification sent!");
			}
		}
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
						mapOfPhnoAndEmailIds.put(mobileNo, email);
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

	public String getRecepitDownloadLink(BPARequest bpaRequest, String mobileno) {

		String receiptNumber = getReceiptNumber(bpaRequest);
		String consumerCode;
		consumerCode = bpaRequest.getBPA().getApplicationNo();
			String link = config.getUiAppHost() + config.getReceiptDownloadLink();
			link = link.replace("$consumerCode", consumerCode);
			link = link.replace("$tenantId", bpaRequest.getBPA().getTenantId());
			link = link.replace("$businessService", bpaRequest.getBPA().getBusinessService());
			link = link.replace("$receiptNumber", receiptNumber);
			link = link.replace("$mobile", mobileno);
			link = getShortnerURL(link);
        log.info(link);
		return link;
	}

	public String getReceiptNumber(BPARequest bpaRequest){
		String consumerCode,service;

		consumerCode = bpaRequest.getBPA().getApplicationNo();
		service = bpaUtil.getFeeBusinessSrvCode(bpaRequest.getBPA());

		StringBuilder URL = getcollectionURL();
		URL.append(service).append("/_search").append("?").append("consumerCodes=").append(consumerCode)
				.append("&").append("tenantId=").append(bpaRequest.getBPA().getTenantId());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(bpaRequest.getRequestInfo()).build();
		Object response = serviceRequestRepository.fetchResult(URL,requestInfoWrapper);
		PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
		return paymentResponse.getPayments().get(0).getPaymentDetails().get(0).getReceiptNumber();
	}

	public StringBuilder getcollectionURL() {
		StringBuilder builder = new StringBuilder();
		return builder.append(config.getCollectionHost()).append(config.getPaymentSearch());
	}

	public String getShortnerURL(String actualURL) {
		net.minidev.json.JSONObject obj = new net.minidev.json.JSONObject();
		obj.put(URL, actualURL);
		String url = config.getUrlShortnerHost() + config.getShortenerURL();

		Object response = serviceRequestRepository.getShorteningURL(new StringBuilder(url), obj);
		return response.toString();
	}

	public String getLinksReplaced(String message, BPA bpa)
	{
		if (message.contains(DOWNLOAD_OC_LINK_PLACEHOLDER)) {
			String link = config.getUiAppHost() + config.getDownloadOccupancyCertificateLink();
			link = link.replace("$applicationNo", bpa.getApplicationNo());
			link = getShortnerURL(link);
			message = message.replace(DOWNLOAD_OC_LINK_PLACEHOLDER, link);
		}

		if (message.contains(DOWNLOAD_PERMIT_LINK_PLACEHOLDER)) {
			String link = config.getUiAppHost() + config.getDownloadPermitOrderLink();
			link = link.replace("$applicationNo", bpa.getApplicationNo());
			link = getShortnerURL(link);
			message = message.replace(DOWNLOAD_PERMIT_LINK_PLACEHOLDER, link);
		}

		return message;
	}

	public String getLinksRemoved(String message, BPA bpa)
	{
		if (message.contains(DOWNLOAD_OC_LINK_PLACEHOLDER)) {
			message = message.replace(DOWNLOAD_OC_LINK_PLACEHOLDER, "");
		}

		if (message.contains(DOWNLOAD_PERMIT_LINK_PLACEHOLDER)) {
			message = message.replace(DOWNLOAD_PERMIT_LINK_PLACEHOLDER, "");
		}

		if (message.contains("{RECEIPT_LINK}")) {
			message = message.replace("{RECEIPT_LINK}", "");
		}

		if (message.contains("{PAYMENT_LINK}")) {
			message = message.replace("{PAYMENT_LINK}", "");
		}

		return message;
	}

	public String getApplicationDetailsPageLink(BPARequest bpaRequest, String mobileno) {

		String receiptNumber = getReceiptNumber(bpaRequest);
		String applicationNo;
		applicationNo = bpaRequest.getBPA().getApplicationNo();
		String link = config.getUiAppHost() + config.getApplicationDetailsLink();
		link = link.replace("$applicationNo", applicationNo);
		link = getShortnerURL(link);
		log.info(link);
		return link;
	}

}
