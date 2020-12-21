package org.egov.wscalculation.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.egov.wscalculation.util.CalculatorUtil;
import org.egov.wscalculation.util.NotificationUtil;
import org.egov.wscalculation.util.WSCalculationUtil;
import org.egov.wscalculation.web.models.Action;
import org.egov.wscalculation.web.models.ActionItem;
import org.egov.wscalculation.web.models.Category;
import org.egov.wscalculation.web.models.Event;
import org.egov.wscalculation.web.models.EventRequest;
import org.egov.wscalculation.web.models.Property;
import org.egov.wscalculation.web.models.Recipient;
import org.egov.wscalculation.web.models.SMSRequest;
import org.egov.wscalculation.web.models.Source;
import org.egov.wscalculation.web.models.WaterConnection;
import org.egov.wscalculation.web.models.WaterConnectionRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PaymentNotificationService {
	
	@Autowired
	private CalculatorUtil calculatorUtil;
	
	@Autowired
	private NotificationUtil notificationUtil;
	
	@Autowired
	private WSCalculationConfiguration config;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private WSCalculationUtil wSCalculationUtil;
	
	
	
	String tenantId = "tenantId";
	String serviceName = "serviceName";
	String consumerCode = "consumerCode";
	String totalBillAmount = "billAmount";
	String dueDate = "dueDate";
	
	/**
	 * 
	 * @param record record is bill response.
	 * @param topic topic is bill generation topic for water.
	 */
	@SuppressWarnings("unchecked")
	public void process(HashMap<String, Object> record, String topic) {
		try {
			HashMap<String, Object> billRes = (HashMap<String, Object>) record.get("billResponse");
			String jsonString = new JSONObject(billRes).toString();
			DocumentContext context = JsonPath.parse(jsonString);
			HashMap<String, String> mappedRecord = mapRecords(context);
			Map<String, Object> info = (Map<String, Object>) record.get("requestInfo");
			RequestInfo requestInfo = mapper.convertValue(info, RequestInfo.class);
			WaterConnection waterConnection = calculatorUtil.getWaterConnection(requestInfo,
					mappedRecord.get(consumerCode), mappedRecord.get(tenantId));
			WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
					.waterConnection(waterConnection).requestInfo(requestInfo).build();
			Property property = wSCalculationUtil.getProperty(waterConnectionRequest);
			if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
				if (mappedRecord.get(serviceName).equalsIgnoreCase(WSCalculationConstant.SERVICE_FIELD_VALUE_WS)) {
					if (waterConnection == null) {
						throw new CustomException("WATER_CONNECTION_NOT_FOUND",
								"Water Connection are not present for " + mappedRecord.get(consumerCode)
										+ " connection no");
					}
					EventRequest eventRequest = getEventRequest(mappedRecord, waterConnectionRequest, topic, property);
					if (eventRequest != null) {
						log.info("In App Notification :: -> " + mapper.writeValueAsString(eventRequest));
						notificationUtil.sendEventNotification(eventRequest);
					}
				}
			}
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				if (mappedRecord.get(serviceName).equalsIgnoreCase(WSCalculationConstant.SERVICE_FIELD_VALUE_WS)) {
					if (waterConnection == null) {
						throw new CustomException("WATER_CONNECTION_NOT_FOUND",
								"Water Connection are not present for " + mappedRecord.get(consumerCode)
										+ " connection no");
					}
					List<SMSRequest> smsRequests = getSmsRequest(mappedRecord, waterConnectionRequest, topic, property);
					if (!CollectionUtils.isEmpty(smsRequests)) {
						log.info("SMS Notification :: -> " + mapper.writeValueAsString(smsRequests));
						notificationUtil.sendSMS(smsRequests);
					}
				}
			}

		} catch (Exception ex) {
			log.error("Error occurred while processing the record: ", ex);
		}
	}
	
	/**
	 * 
	 * @param mappedRecord	List of events
	 * @param waterConnectionRequest WaterConnectionRequest
	 * @param topic Name of the Topic
	 * @param property Property Object
	 * @return returns the EventRequest
	 */
	private EventRequest getEventRequest(HashMap<String, String> mappedRecord, WaterConnectionRequest waterConnectionRequest, String topic,
			Property property) {
		String localizationMessage = notificationUtil.getLocalizationMessages(mappedRecord.get(tenantId), waterConnectionRequest.getRequestInfo());
		String message = notificationUtil.getCustomizedMsgForInApp(topic, localizationMessage);
		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return null;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames, mappedRecord,
				message);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMessage.keySet());
		
		Map<String, String> mapOfPhoneNoAndUUIDs = fetchUserUUIDs(mobileNumbers, waterConnectionRequest.getRequestInfo(),
				property.getTenantId());
		
		if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}
		List<Event> events = new ArrayList<>();
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhoneNoAndUUIDs.get(mobile) || null == mobileNumberAndMessage.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhoneNoAndUUIDs.get(mobile));
			Recipient recepient = Recipient.builder().toUsers(toUsers).toRoles(null).build();
			List<ActionItem> items = new ArrayList<>();
			String actionLink = config.getPayLink().replace("$mobile", mobile)
					.replace("$consumerCode", waterConnectionRequest.getWaterConnection().getConnectionNo())
					.replace("$tenantId", property.getTenantId());
			actionLink = config.getNotificationUrl() + actionLink;
			ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
			items.add(item);
			Action action = Action.builder().actionUrls(items).build();
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMessage.get(mobile))
					.eventType(WSCalculationConstant.USREVENTS_EVENT_TYPE)
					.name(WSCalculationConstant.USREVENTS_EVENT_NAME)
					.postedBy(WSCalculationConstant.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
					.eventDetails(null).actions(action).build());
		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(waterConnectionRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}
	}
	
	/**
	 * 
	 * @param mappedRecord List of MapperRecord
	 * @param waterConnectionRequest WaterCs connectionRequest Object
	 * @param topic Name of the Topic
	 * @param property Property object
	 * @return Returns theList of MSM[[ ss]
	 */
	private List<SMSRequest> getSmsRequest(HashMap<String, String> mappedRecord, WaterConnectionRequest waterConnectionRequest, String topic,
			Property property) {
		String localizationMessage = notificationUtil.getLocalizationMessages(mappedRecord.get(tenantId), waterConnectionRequest.getRequestInfo());
		String message = notificationUtil.getCustomizedMsgForSMS(topic, localizationMessage);
		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return null;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames, mappedRecord,
				message);
		List<SMSRequest> smsRequest = new ArrayList<>();
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			if (msg.contains("<Link to Bill>")) {
				String actionLink = config.getSmsNotificationLink()
						.replace("$consumerCode", waterConnectionRequest.getWaterConnection().getConnectionNo())
						.replace("$tenantId", property.getTenantId());
				actionLink = config.getNotificationUrl() + actionLink;
				msg = msg.replace("<Link to Bill>", actionLink);
			}
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}
	
	public Map<String, String> getMessageForMobileNumber(Map<String, String> mobileNumbersAndNames,
			HashMap<String, String> mapRecords, String message) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Entry<String, String> mobileAndName : mobileNumbersAndNames.entrySet()) {
			String messageToReplace = message;
			if (messageToReplace.contains("<Owner Name>"))
				messageToReplace = messageToReplace.replace("<Owner Name>", mobileAndName.getValue());
			if (messageToReplace.contains("<Service>"))
				messageToReplace = messageToReplace.replace("<Service>", WSCalculationConstant.SERVICE_FIELD_VALUE_WS);
			if (messageToReplace.contains("<bill amount>"))
				messageToReplace = messageToReplace.replace("<bill amount>", mapRecords.get(totalBillAmount));
			if (messageToReplace.contains("<Due Date>"))
				messageToReplace = messageToReplace.replace("<Due Date>", mapRecords.get(dueDate));
			messageToReturn.put(mobileAndName.getKey(), messageToReplace);
		}
		return messageToReturn;
	}
	
	
	/**
	 * 
	 * @param context - DocumentContext object
	 * @return - Returns Map of records
	 */
	public HashMap<String, String> mapRecords(DocumentContext context) {
		try {
			HashMap<String, String> mappedRecord = new HashMap<>();
			mappedRecord.put(tenantId, context.read("$.Bill[0].billDetails[0].tenantId"));
			mappedRecord.put(serviceName, context.read("$.Bill[0].businessService"));
			mappedRecord.put(consumerCode, context.read("$.Bill[0].consumerCode"));
			mappedRecord.put(totalBillAmount, context.read("$.Bill[0].totalAmount").toString());
			mappedRecord.put(dueDate, getLatestBillDetails(mapper.writeValueAsString(context.read("$.Bill[0].billDetails"))));
			return mappedRecord;
		} catch (Exception ex) {
			log.error("", ex);
			throw new CustomException("BILLING_SERVER_ERROR","Unable to fetch values from billing service");
		}
	}
	
	private String getLatestBillDetails(String billDetails) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		log.info("Bill Details : -> " + billDetails);
		JSONArray jsonArray = new JSONArray(billDetails);
		ArrayList<Long> billDates = new ArrayList<>();
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject jsonObj = jsonArray.getJSONObject(i);
			billDates.add((Long) jsonObj.get("expiryDate"));
		}
		billDates.sort(Collections.reverseOrder());
		
		return formatter.format(billDates.get(0));
	}
	/**
     * Fetches UUIDs of CITIZEN based on the phone number.
     * 
     * @param mobileNumbers - Mobile Number
     * @param requestInfo - Request Info Object
     * @param tenantId - Tenant Id
     * @return - Returns map of User Details
     */
    private Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
    	Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();
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
    				String uuid = JsonPath.read(user, "$.user[0].uuid");
    				mapOfPhoneNoAndUUIDs.put(mobileNo, uuid);
    			}else {
        			log.error("Service returned null while fetching user");
    			}
    		}catch(Exception e) {
    			log.error("Exception trace: ",e);
    		}
    	}
    	return mapOfPhoneNoAndUUIDs;
    }

}
