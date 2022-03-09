package org.egov.vehicle.util;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.producer.VehicleProducer;
import org.egov.vehicle.repository.ServiceRequestRepository;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.web.model.notification.SMSRequest;
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

	private VehicleConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private VehicleProducer producer;
	
	private RestTemplate restTemplate;
	

	@Autowired
	public NotificationUtil(VehicleConfiguration config, ServiceRequestRepository serviceRequestRepository,
			VehicleProducer producer,RestTemplate restTemplate) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.producer = producer;
		this.restTemplate = restTemplate;
	}

	final String receiptNumberKey = "receiptNumber";

	final String amountPaidKey = "amountPaid";

	
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
		String jsonString = new JSONObject(responseMap).toString();
		return jsonString;
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
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("\\|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(config.getFsmSearchModule());
		return uri;
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
	 * @param message The message for the specific ULB
	 * @param mobileNumbeToOwner Name Map of mobileNumber to OwnerName
	 * @return List of SMSRequest
	 */
	public List<SMSRequest> createSMSRequest(String message, Map<String, String> mobileNumberToOwner) {
		List<SMSRequest> smsRequest = new LinkedList<>();
		if(!StringUtils.isEmpty(message))
		for (Map.Entry<String, String> entryset : mobileNumberToOwner.entrySet()) {
			String customizedMsg = message.replace("{1}", entryset.getValue());
			smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
		}
		return smsRequest;
	}
	
	/**
	 * Creates customized message to be sent to the ULBs
	 * 
	 * @param vehicleTripRequest
	 *            The declined trip for which message is to be sent
	 * @param localizationMessage
	 *            The messages from localization
	 * @return customized message for declined vehicle trip 
	 */
	@SuppressWarnings("unchecked")
	public String getCustomizedMsg(VehicleTripRequest vehicleTripRequest, String localizationMessage,
			String messageCode) {
		String message = getMessageTemplate(messageCode, localizationMessage);

		if (!StringUtils.isEmpty(message)) {
			if (message.contains("{FSM_FSTP_REJECT_REASON}")) {

				Map<String, String> additionalDetails = null;
				String vehicleDeclineReason = null;
				try {
					additionalDetails = vehicleTripRequest.getVehicleTrip().get(0).getAdditionalDetails() != null
							? (Map<String, String>) vehicleTripRequest.getVehicleTrip().get(0).getAdditionalDetails()
							: new HashMap<String, String>();
				} catch (Exception e) {
					throw new CustomException(VehicleTripConstants.INVALID_VEHICLE_DECLINE_REQUEST, e.getMessage());
				}

				if (null != additionalDetails) {
					vehicleDeclineReason = (String) additionalDetails.get("vehicleDeclineReason");
				}

				message = message.replace("{FSM_FSTP_REJECT_REASON}", vehicleDeclineReason);
			}
			if (message.contains("{NEW_FSM_LINK}")) {
				message = message.replace("{NEW_FSM_LINK}",
						getShortenedUrl(config.getUiAppHost() + config.getNewFsmLink()));

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
	public String getMessageTemplate(String messageCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", messageCode);
		String message = null;
		try {
			List data = JsonPath.parse(localizationMessage).read(path);
			if (!CollectionUtils.isEmpty(data))
				message = data.get(0).toString();
			else
				log.error("Fetching from localization failed with code " + messageCode);
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}
	
	/**
	 * Method to shortent the url
	 * returns the same url if shortening fails
	 * @param url
	 */
	public String getShortenedUrl(String url){
		String res = null;
		HashMap<String,String> body = new HashMap<>();
		body.put("url",url);
		StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
		builder.append(config.getUrlShortnerEndpoint());
		try {
			res = restTemplate.postForObject(builder.toString(), body, String.class);

		}catch(Exception e) {
			 log.error("Error while shortening the url: " + url,e);
			
		}
		if(StringUtils.isEmpty(res)){
			log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+url); ;
			return url;
		}
		else return res;
	}
	
}
