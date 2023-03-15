package org.egov.fsm.util;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.producer.Producer;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.service.DSOService;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.dso.Vendor;
import org.egov.fsm.web.model.dso.VendorSearchCriteria;
import org.egov.fsm.web.model.notification.EventRequest;
import org.egov.fsm.web.model.notification.SMSRequest;
import org.egov.fsm.web.model.vehicle.Vehicle;
import org.egov.fsm.web.model.workflow.ProcessInstance;
import org.egov.fsm.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class NotificationUtil {

	private FSMConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private Producer producer;

	private DSOService dsoSerevice;

	private RestTemplate restTemplate;

	private WorkflowService workflowService;

	@Autowired
	public NotificationUtil(FSMConfiguration config, ServiceRequestRepository serviceRequestRepository,
			Producer producer, DSOService dsoService, RestTemplate restTemplate, WorkflowService workflowService) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.producer = producer;
		this.dsoSerevice = dsoService;
		this.restTemplate = restTemplate;
		this.workflowService = workflowService;
	}

	static final String RECEIPT_NUMBER_KEY = FSMConstants.RECEIPT_NUMBER;

	static final String AMOUNT_PAID_KEY = "amountPaid";

	/**
	 * Creates customized message based on fsm
	 * 
	 * @param fsm                 The fsm for which message is to be sent
	 * @param localizationMessage The messages from localization
	 * @return customized message based on fsm
	 */
	@SuppressWarnings("unchecked")
	public String getCustomizedMsg(FSMRequest fsmRequest, String localizationMessage, String messageCode) {
		String message = null;

		FSM fsm = fsmRequest.getFsm();

		VendorSearchCriteria vendorSearchCriteria = VendorSearchCriteria.builder().ids(Arrays.asList(fsm.getDsoId()))
				.tenantId(fsm.getTenantId()).build();

		Vendor vendor = this.dsoSerevice.getVendor(vendorSearchCriteria, fsmRequest.getRequestInfo());

		String messageTemplate = getMessageTemplate(messageCode, localizationMessage);

		if (null != messageTemplate && !StringUtils.isEmpty(messageTemplate)) {
			message = getInitiatedMsg(fsm, messageTemplate);

			message = callNotificationMessage(message, fsm, fsmRequest, vendor);

			if (message.contains("{VEHICLE_REG_NO}") && vendor != null
					&& !CollectionUtils.isEmpty(vendor.getVehicles())) {
				Map<String, Vehicle> vehilceIdMap = vendor.getVehicles().stream()
						.collect(Collectors.toMap(Vehicle::getId, Function.identity()));
				Vehicle vehicle = vehilceIdMap.get(fsm.getVehicleId());
				if (vehicle != null) {
					message = message.replace("{VEHICLE_REG_NO}", vehicle.getRegistrationNumber());
				}

			}

			if (message.contains("{POSSIBLE_SERVICE_DATE}") && vendor != null) {
				Calendar possibleSrvdt = Calendar.getInstance();
				possibleSrvdt.setTimeInMillis(fsm.getPossibleServiceDate());
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				dateFormat.setTimeZone(possibleSrvdt.getTimeZone());
				message = message.replace("{POSSIBLE_SERVICE_DATE}", dateFormat.format(possibleSrvdt.getTime()));
			}
			message = callFSMReasonsAndPaymentLink(message, fsmRequest, localizationMessage, fsm);

			message = callReceiptDetails(message, fsm, fsmRequest);
		}
		return message;
	}

	private String callFSMReasonsAndPaymentLink(String message, FSMRequest fsmRequest, String localizationMessage,
			FSM fsm) {
		if (message.contains("{FSM_DSO_REJECT_REASON}")) {

			String reasonComment = fsmRequest.getWorkflow().getComments();
			reasonComment = reasonComment.split("~")[0];
			String localizedCmt = getMessageTemplate(reasonComment, localizationMessage);
			message = message.replace("{FSM_DSO_REJECT_REASON}",
					org.springframework.util.StringUtils.isEmpty(localizedCmt) ? reasonComment : localizedCmt);
		}
		if (message.contains("{FSM_CANCEL_REASON}")) {
			String reasonComment = fsmRequest.getWorkflow().getComments();
			reasonComment = reasonComment.split("~")[0];
			String localizedCmt = getMessageTemplate(reasonComment, localizationMessage);
			message = message.replace("{FSM_CANCEL_REASON}",
					org.springframework.util.StringUtils.isEmpty(localizedCmt) ? reasonComment : localizedCmt);
		}

		if (message.contains("{PAY_LINK}")) {
			String actionLink = config.getPayLink().replace("$mobile", fsm.getCitizen().getMobileNumber())
					.replace("$applicationNo", fsm.getApplicationNo()).replace("$tenantId", fsm.getTenantId())
					.replace("$businessService", FSMConstants.FSM_PAY_BUSINESS_SERVICE);
			message = message.replace("{PAY_LINK}", getShortenedUrl(config.getUiAppHost() + actionLink));
		}
		return message;
	}

	private String callReceiptDetails(String message, FSM fsm, FSMRequest fsmRequest) {
		if (message.contains("{APPLICATION_ID}")) {
			message = message.replace("{APPLICATION_ID}", fsm.getApplicationNo());
		}

		if (message.contains("{RECEIPT_LINK}")) {

			String actionLink = config.getDownloadLink().replace("$mobile", fsm.getCitizen().getMobileNumber())
					.replace("$consumerCode", fsm.getApplicationNo()).replace("$tenantId", fsm.getTenantId())
					.replace("$receiptNumber", getPaymentData(FSMConstants.RECEIPT_NUMBER, fsmRequest))
					.replace("$businessService", FSMConstants.FSM_PAY_BUSINESS_SERVICE);
			message = message.replace("{RECEIPT_LINK}", getShortenedUrl(config.getUiAppHost() + actionLink));

		}

		if (message.contains("{RECEIPT_NO}")) {
			message = message.replace("{RECEIPT_NO}", getPaymentData(FSMConstants.RECEIPT_NUMBER, fsmRequest));
		}

		if (message.contains("{FSM_APPL_LINK}")) {
			message = message.replace("{FSM_APPL_LINK}",
					getShortenedUrl(config.getUiAppHost() + config.getFsmAppLink() + fsm.getApplicationNo()));
		}

		if (message.contains("{NEW_FSM_LINK}")) {
			message = message.replace("{NEW_FSM_LINK}",
					getShortenedUrl(config.getUiAppHost() + config.getNewFsmLink()));

		}
		if (message.contains("{NO_OF_TRIPS}") && fsm.getNoOfTrips() != null) {

			message = message.replace("{NO_OF_TRIPS}", fsm.getNoOfTrips().toString());
		}
		return message;
	}

	private String callNotificationMessage(String message, FSM fsm, FSMRequest fsmRequest, Vendor vendor) {
		if (message.contains("{SLA_HOURS}")) {
			ProcessInstance processInstance = workflowService.getProcessInstance(fsm, fsmRequest.getRequestInfo());
			Long slatime = null;
			slatime = ((processInstance.getStateSla() != null) ? processInstance.getStateSla()
					: processInstance.getBusinesssServiceSla());
			Double slaValue = 0.0;
			if (slatime != null) {
				slaValue = Math.ceil(slatime.doubleValue() / (60 * 60 * 1000));

			}
			message = message.replace("{SLA_HOURS}", String.valueOf(slaValue.intValue()));
		}

		if (message.contains("{AMOUNT_TO_BE_PAID}")) {
			BigDecimal amount;
			if (fsm.getAdvanceAmount() != null
					&& (fsm.getApplicationStatus().equalsIgnoreCase(FSMConstants.WF_STATUS_PENDING_APPL_FEE_PAYMENT)
							|| fsm.getApplicationStatus().equalsIgnoreCase(FSMConstants.ASSIGN_DSO))) {
				amount = fsm.getAdvanceAmount();
			}

			else {
				amount = getAmountToBePaid(fsmRequest.getRequestInfo(), fsmRequest.getFsm());
			}

			message = message.replace("{AMOUNT_TO_BE_PAID}", amount.toString());
		}
		if (message.contains("{DSO_MOBILE_NUMBER}") && vendor != null) {

			message = message.replace("{DSO_MOBILE_NUMBER}", vendor.getOwner().getMobileNumber());
		}
		return message;
	}

	private String getPaymentData(String properyName, FSMRequest fsmRequest) {
		StringBuilder builder = new StringBuilder(config.getCollectionServiceHost());
		builder.append(config.getCollectionServiceSearchEndPoint()).append(FSMConstants.FSM_PAY_BUSINESS_SERVICE);
		builder.append("/_search?tenantId=").append(fsmRequest.getFsm().getTenantId()).append("&consumerCodes=")
				.append(fsmRequest.getFsm().getApplicationNo());
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(builder,
				new RequestInfoWrapper(fsmRequest.getRequestInfo()));
		JSONObject jsonObject = new JSONObject(responseMap);
		String proeprtyValue = "";
		try {
			JSONArray paymentsArray = (JSONArray) jsonObject.get("Payments");
			if (paymentsArray != null) {
				JSONObject firstElement = (JSONObject) paymentsArray.get(0);
				if (firstElement != null) {
					String payerMobileNumber = firstElement.get("mobileNumber").toString();
					String payerName = firstElement.get("paidBy").toString();
					((Map) fsmRequest.getFsm().getAdditionalDetails()).put("payerMobileNumber", payerMobileNumber);
					((Map) fsmRequest.getFsm().getAdditionalDetails()).put("payerName", payerName);
					JSONArray paymentDetails = (JSONArray) firstElement.get("paymentDetails");
					if (paymentDetails != null) {
						for (int i = 0; i < paymentDetails.length(); i++) {
							JSONObject object = (JSONObject) paymentDetails.get(i);
							proeprtyValue = object.get(properyName.trim()).toString();
						}
					}
				}
			}
			return proeprtyValue;
		} catch (Exception e) {
			throw new CustomException("PARSING ERROR", "Failed to parse the response using jsonPath: ");
		}
	}

	/**
	 * Creates customized message for initiate
	 * 
	 * @param bpa     tenantId of the bpa
	 * @param message Message from localization for initiate
	 * @return customized message for initiate
	 */
	@SuppressWarnings("unchecked")
	private String getInitiatedMsg(FSM fsm, String message) {
		message = message.replace("{2}", fsm.getApplicationNo());
		return message;
	}

	/**
	 * Extracts message for the specific code
	 * 
	 * @param notificationCode    The code for which message is required
	 * @param localizationMessage The localization messages
	 * @return message for the specific code
	 */
	@SuppressWarnings("rawtypes")
	public String getMessageTemplate(String notificationCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		String message = null;
		log.info("notificationCode :::  {} " + notificationCode);
		if (null != notificationCode) {
			try {
				path = path.replace("{}", notificationCode.trim());
				List data = JsonPath.parse(localizationMessage).read(path);
				if (!CollectionUtils.isEmpty(data))
					message = data.get(0).toString();
				else
					log.error("Fetching from localization failed with code " + notificationCode);
			} catch (Exception e) {
				log.warn("Fetching from localization failed", e);
			}
		}
		return message;
	}

	/**
	 * Fetches the amount to be paid from getBill API
	 * 
	 * @param requestInfo The RequestInfo of the request
	 * @param FSM         The FSM object for which
	 * @return
	 */
	private BigDecimal getAmountToBePaid(RequestInfo requestInfo, FSM fsm) {
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getBillUri(fsm),
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
						if (fsm.getAdvanceAmount() != null) {
							Double collAmt = fsm.getAdvanceAmount().doubleValue();

							amount = amount - collAmt;

						}
					}
				}
			}
			amountToBePaid = BigDecimal.valueOf(amount);
		} catch (Exception e) {
			throw new CustomException("PARSING ERROR", "Failed to parse the response using jsonPath: ");
		}
		return amountToBePaid;
	}

	/**
	 * Creates the uri for getBill by adding query params from the license
	 * 
	 * @param license The TradeLicense for which getBill has to be called
	 * @return The uri for the getBill
	 */
	private StringBuilder getBillUri(FSM fsm) {
		StringBuilder builder = new StringBuilder(config.getBillingHost());
		builder.append(config.getDemandSearchEndpoint());
		builder.append("?tenantId=");
		builder.append(fsm.getTenantId());
		builder.append("&consumerCode=");
		builder.append(fsm.getApplicationNo());
		builder.append("&businessService=");
		builder.append(FSMConstants.FSM_PAY_BUSINESS_SERVICE);
		return builder;
	}

	/**
	 * Returns the uri for the localization call
	 * 
	 * @param tenantId TenantId of the propertyRequest
	 * @return The uri for localization search call
	 */
	public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

		if (config.getIsLocalizationStateLevel())
			tenantId = tenantId.split("\\.")[0];

		String locale = "en_IN";
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("\\|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(FSMConstants.SEARCH_MODULE).append(",")
				.append(FSMConstants.FSM_LOC_SEARCH_MODULE);
		return uri;
	}

	/**
	 * Fetches messages from localization service
	 * 
	 * @param tenantId    tenantId of the fsm
	 * @param requestInfo The requestInfo of the request
	 * @return Localization messages for the module
	 */
	@SuppressWarnings("rawtypes")
	public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {

		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
				requestInfo);
		return new JSONObject(responseMap).toString();
	}

	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * 
	 * @param smsRequestList The list of SMSRequest to be sent
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

	/**
	 * Creates sms request for the each owners
	 * 
	 * @param message                 The message for the specific fsm
	 * @param mobileNumberToOwnerName Map of mobileNumber to OwnerName
	 * @return List of SMSRequest
	 */
	public List<SMSRequest> createSMSRequest(String message, Map<String, String> mobileNumberToOwner) {
		List<SMSRequest> smsRequest = new LinkedList<>();

		for (Map.Entry<String, String> entryset : mobileNumberToOwner.entrySet()) {
			String customizedMsg = message.replace("{1}", entryset.getValue());
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

	/**
	 * Method to shortent the url returns the same url if shortening fails
	 * 
	 * @param url
	 */
	public String getShortenedUrl(String url) {
		String res = null;
		HashMap<String, String> body = new HashMap<>();
		body.put("url", url);
		StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
		builder.append(config.getUrlShortnerEndpoint());
		try {
			res = restTemplate.postForObject(builder.toString(), body, String.class);

		} catch (Exception e) {
			log.error("Error while shortening the url: " + url, e);

		}
		if (StringUtils.isEmpty(res)) {
			log.error("URL_SHORTENING_ERROR", "Unable to shorten url: " + url);
			return url;
		} else {
			return res;
		}
	}

}