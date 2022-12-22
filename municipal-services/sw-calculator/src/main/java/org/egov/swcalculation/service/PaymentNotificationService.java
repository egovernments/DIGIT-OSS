package org.egov.swcalculation.service;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.repository.ServiceRequestRepository;
import org.egov.swcalculation.util.CalculatorUtils;
import org.egov.swcalculation.util.SWCalculationUtil;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.web.models.users.User;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import static org.egov.swcalculation.constants.SWCalculationConstant.*;
import static org.springframework.util.StringUtils.capitalize;

@Slf4j
@Component
public class PaymentNotificationService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SWCalculationConfiguration config;

	@Autowired
	private SWCalculationUtil util;

	@Autowired
	private CalculatorUtils calculatorUtils;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private MasterDataService service;
	
	@Autowired
	private SWCalculationUtil sWCalculationUtil;

	String tenantId = "tenantId";
	String serviceName = "serviceName";
	String consumerCode = "consumerCode";
	String totalBillAmount = "billAmount";
	String dueDate = "dueDate";

	String applicationNumberReplacer = "$applicationNumber";

	@SuppressWarnings("unchecked")
	public void process(HashMap<String, Object> record, String topic) {
		try {
			HashMap<String, Object> billRes = (HashMap<String, Object>) record.get("billResponse");
			String jsonString = new JSONObject(billRes).toString();
			DocumentContext context = JsonPath.parse(jsonString);
			HashMap<String, String> mappedRecord = mapRecords(context);
			Map<String, Object> info = (Map<String, Object>) record.get("requestInfo");
			RequestInfo requestInfo = mapper.convertValue(info, RequestInfo.class);

			org.egov.common.contract.request.User userInfoCopy = requestInfo.getUserInfo();
			org.egov.common.contract.request.User userInfo = util.getInternalMicroserviceUser(requestInfo.getUserInfo().getTenantId());
			requestInfo.setUserInfo(userInfo);

			List<SewerageConnection> sewerageConnectionList = calculatorUtils.getSewerageConnection(requestInfo,
					mappedRecord.get(consumerCode), mappedRecord.get(tenantId));
			int size = sewerageConnectionList.size();
			SewerageConnection sewerageConnection = sewerageConnectionList.get(size - 1);

			SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
					.sewerageConnection(sewerageConnection).requestInfo(requestInfo).build();
			Property property = sWCalculationUtil.getProperty(sewerageConnectionRequest);

			sewerageConnectionRequest.getRequestInfo().setUserInfo(userInfoCopy);

			List<String> configuredChannelNames = util.fetchChannelList(sewerageConnectionRequest.getRequestInfo(), sewerageConnectionRequest.getSewerageConnection().getTenantId(), SERVICE_FIELD_VALUE_SW, sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction());

			if (configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
				if (null != config.getIsUserEventsNotificationEnabled()) {
					if (config.getIsUserEventsNotificationEnabled()) {
						if (SWCalculationConstant.SERVICE_FIELD_VALUE_SW.equalsIgnoreCase(mappedRecord.get(serviceName))) {
							if (sewerageConnection == null) {
								throw new CustomException("EG_SW_INVALID_CONNECTION_NO",
										"Sewerage Connection are not present for " + mappedRecord.get(consumerCode)
												+ " connection no");
							}
							EventRequest eventRequest = getEventRequest(mappedRecord, sewerageConnectionRequest, topic,
									property);
							if (null != eventRequest)
								util.sendEventNotification(eventRequest);

						}
					}
				}
			}

			if (configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
				if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
					if (mappedRecord.get(serviceName).equalsIgnoreCase(SWCalculationConstant.SERVICE_FIELD_VALUE_SW)) {
						if (sewerageConnection == null) {
							throw new CustomException("EG_SW_INVALID_CONNECTION_ID",
									"Sewerage Connection are not present for " + mappedRecord.get(consumerCode)
											+ " connection no");
						}
						List<SMSRequest> smsRequests = getSmsRequest(mappedRecord, sewerageConnectionRequest, topic, property);
						if (smsRequests != null && !CollectionUtils.isEmpty(smsRequests)) {
							log.info("SMS Notification :: -> " + mapper.writeValueAsString(smsRequests));
							util.sendSMS(smsRequests);
						}
					}
				}
			}
		}
		catch (Exception ex) {
			log.error("EG_SW Exception while processing record: ", ex);
		}
	}

	/**
	 * Enriches the smsRequest List with the customized messages
	 * @param sewerageConnectionRequest The sewerageConnectionRequest from kafka topic
	 * @return smsRequests List of SMSRequests
	 */
	private List<SMSRequest> getSmsRequest(HashMap<String, String> mappedRecord, SewerageConnectionRequest sewerageConnectionRequest,
			String topic, Property property) {

		//If bill amount is 0 then do not send any notification
		Double zero = Double.valueOf(0);
		if(Double.parseDouble(mappedRecord.get(totalBillAmount)) == zero)
			return null;

		String localizationMessage = util.getLocalizationMessages(mappedRecord.get(tenantId), sewerageConnectionRequest.getRequestInfo());
		String message = util.getCustomizedMsgForSMS(topic, localizationMessage);
		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return Collections.emptyList();
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		//Send the notification to applicant
		if(!org.apache.commons.lang.StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
		}

		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames, mappedRecord,
				message);
		List<SMSRequest> smsRequest = new ArrayList<>();
		String connectionNo = sewerageConnectionRequest.getSewerageConnection().getConnectionNo();

		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			if (msg.contains("{Link to Bill}")) {
				String actionLink = config.getBillDetailsLink()
						.replace("$consumerCode", connectionNo.replace("/", "+"))
						.replace("$tenantId", property.getTenantId())
						.replace("$consumerName", mobileNumbersAndNames.get(mobileNumber));
				actionLink = config.getNotificationUrl() + actionLink;
				msg = msg.replace("{Link to Bill}", actionLink);
			}
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}

	@SuppressWarnings("unused")
	private void enrichNotificationReceivers(List<NotificationReceiver> receiverList,
			DemandNotificationObj notificationObj) {
		try {
			JSONArray receiver = service.getMasterListOfReceiver(notificationObj.getRequestInfo(),
					notificationObj.getTenantId());
			receiverList.addAll(mapper.readValue(receiver.toJSONString(),
					mapper.getTypeFactory().constructCollectionType(List.class, NotificationReceiver.class)));
		} catch (IOException e) {
			throw new CustomException("EG_SW_PARSING_ERROR", " Notification Receiver List Can Not Be Parsed!!");
		}
	}

	/**
	 * Enriches the eventrequest with the customized events
	 * @param sewerageConnectionRequest The sewerageConnectionRequest from kafka topic
	 * @return EventRequest object
	 */
	private EventRequest getEventRequest(HashMap<String, String> mappedRecord, SewerageConnectionRequest sewerageConnectionRequest,
			String topic, Property property) {

		//If bill amount is 0 then do not send any notification
		Double zero = Double.valueOf(0);
		if(Double.parseDouble(mappedRecord.get(totalBillAmount)) == zero)
			return null;

		String localizationMessages = util.getLocalizationMessages(mappedRecord.get(tenantId), sewerageConnectionRequest.getRequestInfo());
		String message = util.getCustomizedMsgForInApp(topic, localizationMessages);

		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return null;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		//Send the notification to applicant
		if(!org.apache.commons.lang.StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
		}
		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames, mappedRecord,
				message);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMessage.keySet());

		Map<String, String> mapOfPhoneNoAndUUIDs = fetchUserUUIDs(mobileNumbers, sewerageConnectionRequest.getRequestInfo(),
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
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			// List<String> payTriggerList =
			// Arrays.asList(config.getPayTriggers().split("[,]"));
			Action action;
			List<ActionItem> items = new ArrayList<>();

			String connectionNo = sewerageConnectionRequest.getSewerageConnection().getConnectionNo();
			String actionLink = config.getBillDetailsLink()
					.replace("$consumerCode", connectionNo.replace("/", "+"))
					.replace("$tenantId", property.getTenantId())
					.replace("$consumerName", mobileNumbersAndNames.get(mobile));

			actionLink = config.getNotificationUrl() + actionLink;
			ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
			items.add(item);
			action = Action.builder().actionUrls(items).build();
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMessage.get(mobile))
					.eventType(SWCalculationConstant.USREVENTS_EVENT_TYPE)
					.name(SWCalculationConstant.USREVENTS_EVENT_NAME)
					.postedBy(SWCalculationConstant.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
					.eventDetails(null).actions(action).build());

		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}
	}

	/**
	 * 
	 * @param context Document Context
	 * @return - Returns list of Bill details
	 */
	public HashMap<String, String> mapRecords(DocumentContext context) {
		HashMap<String, String> mappedRecord = new HashMap<>();
		try {
			mappedRecord.put(tenantId, context.read("$.Bill[0].billDetails[0].tenantId"));
			mappedRecord.put(serviceName, context.read("$.Bill[0].businessService"));
			mappedRecord.put(consumerCode, context.read("$.Bill[0].consumerCode"));
			mappedRecord.put(totalBillAmount, context.read("$.Bill[0].totalAmount").toString());
			mappedRecord.put(dueDate,
					getLatestBillDetails(mapper.writeValueAsString(context.read("$.Bill[0].billDetails"))));
		} catch (Exception ex) {
			log.error("EG_SW Unable to fetch values from bill ",ex);
			throw new CustomException("EG_SW_INVALID_BILL_DETAILS", "Unable to fetch values from bill");
		}

		return mappedRecord;
	}

	private String getLatestBillDetails(String billDetails) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		log.info("Bill Details : -> " + billDetails);
		org.json.JSONArray jsonArray = new org.json.JSONArray(billDetails);
		ArrayList<Long> billDates = new ArrayList<>();
		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject jsonObj = jsonArray.getJSONObject(i);
			billDates.add((Long) jsonObj.get("expiryDate"));
		}
		billDates.sort(Collections.reverseOrder());

		return formatter.format(billDates.get(0));
	}

	public Map<String, String> getMessageForMobileNumber(Map<String, String> mobileNumbersAndNames,
			HashMap<String, String> mapRecords, String message) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Entry<String, String> mobileAndName : mobileNumbersAndNames.entrySet()) {
			String messageToReplace = message;
			if (messageToReplace.contains("{Owner Name}"))
				messageToReplace = messageToReplace.replace("{Owner Name}", mobileAndName.getValue());
			if (messageToReplace.contains("{Service}"))
				messageToReplace = messageToReplace.replace("{Service}", SWCalculationConstant.SERVICE_FIELD_VALUE_SW);
			if (messageToReplace.contains("{bill amount}"))
				messageToReplace = messageToReplace.replace("{bill amount}", mapRecords.get(totalBillAmount));
			if (messageToReplace.contains("{Due Date}"))
				messageToReplace = messageToReplace.replace("{Due Date}", mapRecords.get(dueDate));
			messageToReturn.put(mobileAndName.getKey(), messageToReplace);
		}
		return messageToReturn;
	}

	/**
	 * Fetches UUIDs of CITIZEN based on the phone number.
	 * 
	 * @param mobileNumbers - List of mobile numbers
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return - Returns list of User with UUID
	 */
	private Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
		Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		for (String mobileNo : mobileNumbers) {
			userSearchRequest.put("userName", mobileNo);
			try {
				Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
				if (null != user) {
					String uuid = JsonPath.read(user, "$.user[0].uuid");
					mapOfPhoneNoAndUUIDs.put(mobileNo, uuid);
				} else {
					log.error("Service returned null while fetching user ");
				}
			} catch (Exception e) {
				log.error("Exception while fetching user");
				log.error("Exception trace: ", e);
			}
		}
		return mapOfPhoneNoAndUUIDs;
	}

	/**
	 * Returns message template with replaced placeholders
	 * for Bill Generation Success/Failure Notification
	 *
	 * @param message - Request Info Object
	 * @param user -User object notification will be sent to
	 * @return message after replacing placeholder with values
	 *
	 */
	public String getBillNotificationMessage(String message,Map<String, Object> masterMap,User user) {
		if (message.contains("{Name}"))
			message = message.replace("{Name}", user.getName());
		if (message.contains("{Service}"))
			message = message.replace("{Service}", SERVICE_FIELD_VALUE_SW);
		if (message.contains("{ULB}"))
			message = message.replace("{ULB}", capitalize(user.getTenantId().split("\\.")[1]));
		if (message.contains("{billing cycle}"))
		{
			String billingCycle = calculatorUtils.getBillingCycle(masterMap);
			message = message.replace("{billing cycle}",billingCycle);
		}

		return message;

	}

	/**
	 * Sends Bill Generation Success/Failure Notification
	 *
	 * @param requestInfo - Request Info Object
	 * @param uuid - Uuid of the user notification will be sent to
	 * @param tenantId - Tenant Id
	 * @param isSuccess - Whether Bill generation was a success or failure
	 *
	 */
	public void sendBillNotification(RequestInfo requestInfo, String uuid, String tenantId, Map<String, Object> masterMap, Boolean isSuccess) {

		List<String> configuredChannelNames = util.fetchChannelList(requestInfo, tenantId, SERVICE_FIELD_VALUE_SW, ACTION_FOR_BILL);
//		List<String> configuredChannelNames = Arrays.asList(new String[] {"SMS","EMAIL"});
		User user = util.fetchUserByUUID(uuid, requestInfo, tenantId);
		if(user == null)
		{
			log.info("No user found for uuid - "+ uuid);
			return;
		}
		if (configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				String localizationMessage = util.getLocalizationMessages(tenantId, requestInfo);
				String messageString = null;
				if (isSuccess) {
					messageString = util.getMessageTemplate(BILL_SUCCESS_MESSAGE_SMS, localizationMessage);
				} else {
					messageString = util.getMessageTemplate(BILL_FAILURE_MESSAGE_SMS, localizationMessage);
				}
				if (messageString == null) {
					log.error("EG_SW No message Found For " + SWCalculationConstant.BILL_FAILURE_MESSAGE_SMS+" or "+BILL_SUCCESS_MESSAGE_SMS);
					return;
				}

				messageString = getBillNotificationMessage(messageString,masterMap,user);
				log.info(messageString);
				SMSRequest req = SMSRequest.builder().mobileNumber(user.getMobileNumber()).message(messageString).category(Category.NOTIFICATION).build();
				List<SMSRequest> smsRequests = new ArrayList<>();
				smsRequests.add(req);

				if (!CollectionUtils.isEmpty(smsRequests)) {
					log.info("SMS Notification :: -> ");
					util.sendSMS(smsRequests);
				}
			}
		}

		if (configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
			if (config.getIsMailEnabled() != null && config.getIsMailEnabled()) {
				String localizationMessage = util.getLocalizationMessages(tenantId, requestInfo);
				String messageString = null;
				if (isSuccess) {
					messageString = util.getMessageTemplate(BILL_SUCCESS_MESSAGE_EMAIL, localizationMessage);
				} else {
					messageString = util.getMessageTemplate(BILL_FAILURE_MESSAGE_EMAIL, localizationMessage);
				}
				if (messageString == null) {
					log.error("EG_SW No message Found For " + SWCalculationConstant.BILL_SUCCESS_MESSAGE_EMAIL+" or "+BILL_FAILURE_MESSAGE_EMAIL );
					return;
				}
				String customizedMsg = getBillNotificationMessage(messageString,masterMap,user);
				String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
				String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
				Email emailobj = Email.builder().emailTo(Collections.singleton(user.getEmailId())).isHTML(true).body(body).subject(subject).build();
				EmailRequest email = new EmailRequest(requestInfo,emailobj);

				List<EmailRequest> emailRequests = new ArrayList<>();
				emailRequests.add(email);

				if (!CollectionUtils.isEmpty(emailRequests)) {
					log.info("Email Notification :: -> ");
					util.sendEmail(emailRequests);
				}
			}

		}
	}
}
