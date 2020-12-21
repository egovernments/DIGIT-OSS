package org.egov.pt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.models.Event;
import org.egov.pt.web.models.EventRequest;
import org.egov.pt.web.models.Property;
import org.egov.pt.web.models.PropertyCriteria;
import org.egov.pt.web.models.PropertyDetail;
import org.egov.pt.web.models.PropertyRequest;
import org.egov.pt.web.models.SMSRequest;
import org.egov.pt.web.models.ShortenRequest;
import org.egov.pt.web.models.collection.Bill;
import org.egov.pt.web.models.collection.Payment;
import org.egov.pt.web.models.collection.PaymentDetail;
import org.egov.pt.web.models.collection.PaymentRequest;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static org.egov.pt.util.PTConstants.BUSINESSSERVICE_CODE;

@Slf4j
@Service
public class PaymentNotificationService {

	@Autowired
	private Producer producer;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private PropertyConfiguration propertyConfiguration;

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private PropertyUtil util;

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Generates message from the received object and sends SMSRequest to kafka
	 * queue
	 * 
	 * @param record
	 *            The Object received from kafka topic
	 * @param topic
	 *            The topic name from which Object is received
	 */
	public void process(HashMap<String, Object> record, String topic) {

		if (null == propertyConfiguration.getIsSMSNotificationEnabled())
			propertyConfiguration.setIsSMSNotificationEnabled(true);

		if (propertyConfiguration.getIsSMSNotificationEnabled()) {

			try {
				String jsonString = new JSONObject(record).toString();
				DocumentContext documentContext = JsonPath.parse(jsonString);
				RequestInfo requestInfo = mapper.convertValue(record.get("RequestInfo"), RequestInfo.class);

				List<Map<String, String>> valMaps = new LinkedList<>();

				if (topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic())) {
					valMaps.addAll(getValuesFromPayment(record));
				}
				else {
					valMaps.add(getValuesFromTransaction(documentContext));
				}
				
				if(!CollectionUtils.isEmpty(valMaps)) {
					if(topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic()) && null != valMaps.get(0).get("module")) {
						if(!valMaps.get(0).get("module").equals(BUSINESSSERVICE_CODE)) {
							return;
						}
					}else if(topic.equalsIgnoreCase(propertyConfiguration.getPgTopic()) && null != valMaps.get(0).get("moduleId")) {
						if(!valMaps.get(0).get("moduleId").contains(BUSINESSSERVICE_CODE)) {
							return;
						}
					}else {
						return;
					}
				}else {
					return;
				}

				for (Map<String, String> valMap : valMaps) {

					List<String> mobileNumbers = new LinkedList<>();

					Map<String, List<String>> propertyAttributes = getPropertyAttributes(valMap, requestInfo);
					mobileNumbers = propertyAttributes.get("mobileNumbers");
					addUserNumber(topic, requestInfo, valMap, mobileNumbers);
					valMap.put("financialYear", propertyAttributes.get("financialYear").get(0));
					valMap.put("oldPropertyId", propertyAttributes.get("oldPropertyId").get(0));
					StringBuilder uri = util.getUri(valMap.get("tenantId"), requestInfo);
					LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, requestInfo);
					String messagejson = new JSONObject(responseMap).toString();
					List<SMSRequest> smsRequests = new ArrayList<>();
					String customMessage = null;
					if (topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic())
							|| (topic.equalsIgnoreCase(propertyConfiguration.getPgTopic())
									&& "FAILURE".equalsIgnoreCase(valMap.get("txnStatus")))) {
						String path = getJsonPath(topic, valMap);
						Object messageObj = JsonPath.parse(messagejson).read(path);
						String message = ((ArrayList<String>) messageObj).get(0);
						customMessage = getCustomizedMessage(valMap, message, path);
						smsRequests = getSMSRequests(mobileNumbers, customMessage, valMap);
					}
					/*if (valMap.get("oldPropertyId") == null
							&& topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic()))
						smsRequests.addAll(addOldpropertyIdAbsentSMS(messagejson, valMap, mobileNumbers));*/
					if (!CollectionUtils.isEmpty(smsRequests)) {
						sendSMS(smsRequests);
						if (null == propertyConfiguration.getIsUserEventsNotificationEnabled())
							propertyConfiguration.setIsUserEventsNotificationEnabled(true);
						if (propertyConfiguration.getIsUserEventsNotificationEnabled()) {
							sendEventNotification(requestInfo, customMessage, smsRequests, valMap);
						}
					}
				}
			} catch (Exception e) {
				log.error("Exception: ", e);
				throw new CustomException("LOCALIZATION ERROR", "Unable to get message from localization");
			}
		} else {
			log.info("SMS Notifications have been disabled.");
		}
	}

	/**
	 * Prepares event to be sent to the user as notification and sends it.
	 * 
	 * @param requestInfo
	 * @param customMessage
	 * @param smsRequests
	 * @param valMap
	 */
	public void sendEventNotification(RequestInfo requestInfo, String customMessage, List<SMSRequest> smsRequests,
			Map<String, String> valMap) {
		List<Event> events = new ArrayList<>();
		Set<String> listOfMobileNumber = smsRequests.stream().map(SMSRequest::getMobileNumber)
				.collect(Collectors.toSet());
		PropertyRequest request = null;
		List<Property> properties = new ArrayList<>();
		List<PropertyDetail> propertyDetails = new ArrayList<>();
		PropertyDetail detail = PropertyDetail.builder().assessmentNumber(valMap.get("assessmentNumber"))
				.financialYear(valMap.get("financialYear")).build();
		propertyDetails.add(detail);
		Property property = new Property().builder().propertyId(valMap.get("propertyId"))
				.tenantId(valMap.get("tenantId")).propertyDetails(propertyDetails).build();
		properties.add(property);
		request = PropertyRequest.builder().requestInfo(requestInfo).properties(properties).build();

		List<Event> eventsForAProperty = notificationService.getEvents(listOfMobileNumber, customMessage, request,
				true);
		if (!CollectionUtils.isEmpty(eventsForAProperty)) {
			events.addAll(eventsForAProperty);
		}
		if (!CollectionUtils.isEmpty(events)) {
			Role role = new Role();
			List<Role> roles = new ArrayList<>();
			roles.add(role);
			User user = User.builder().tenantId("tenantId").uuid("uuid").roles(roles).build();
			requestInfo.setUserInfo(user);
			EventRequest eventRequest = EventRequest.builder().requestInfo(requestInfo).events(events).build();
			notificationService.sendEventNotification(eventRequest);
		}

	}

	/**
	 * Generate and returns SMSRequest if oldPropertyId is not present
	 * 
	 * @param messagejson
	 *            The list of messages received from localization
	 * @param valMap
	 *            The map containing all the values as key,value pairs
	 * @param mobileNumbers
	 *            The list of mobileNumbers to which sms are to be sent
	 * @return List of SMS request to be sent
	 */
	private List<SMSRequest> addOldpropertyIdAbsentSMS(String messagejson, Map<String, String> valMap,
			List<String> mobileNumbers) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", PTConstants.NOTIFICATION_OLDPROPERTYID_ABSENT);
		Object messageObj = JsonPath.parse(messagejson).read(path);
		String message = ((ArrayList<String>) messageObj).get(0);
		String customMessage = getCustomizedOldPropertyIdAbsentMessage(message, valMap);
		return getSMSRequests(mobileNumbers, customMessage, valMap);
	}

	/**
	 * Returns the map of the values required from the record
	 * 
	 * @param documentContext
	 *            The DocumentContext of the record Object
	 * @return The required values as key,value pair
	 */
	private Map<String, String> getValuesFromReceipt(DocumentContext documentContext) {
		BigDecimal totalAmount, amountPaid;
		String consumerCode, transactionId, paymentMode, tenantId, mobileNumber, module;
		Map<String, String> valMap = new HashMap<>();

		try {
			totalAmount = new BigDecimal(
					(Integer) documentContext.read("$.Receipt[0].Bill[0].billDetails[0].totalAmount"));
			valMap.put("totalAmount", totalAmount.toString());

			amountPaid = new BigDecimal((Integer) documentContext.read("$.Receipt[0].instrument.amount"));
			valMap.put("amountPaid", amountPaid.toString());
			valMap.put("amountDue", totalAmount.subtract(amountPaid).toString());

			consumerCode = documentContext.read("$.Receipt[0].Bill[0].billDetails[0].consumerCode");
			valMap.put("consumerCode", consumerCode);
			valMap.put("propertyId", consumerCode.split(":")[0]);
			valMap.put("assessmentNumber", consumerCode.split(":")[1]);

			transactionId = documentContext.read("$.Receipt[0].instrument.transactionNumber");
			valMap.put("transactionId", transactionId);

			paymentMode = documentContext.read("$.Receipt[0].instrument.instrumentType.name");
			valMap.put("paymentMode", paymentMode);

			tenantId = documentContext.read("$.Receipt[0].tenantId");
			valMap.put("tenantId", tenantId);

			mobileNumber = documentContext.read("$.Receipt[0].Bill[0].mobileNumber");
			valMap.put("mobileNumber", mobileNumber);

			module = documentContext.read("$.Receipt[0].Bill[0].billDetails[0].businessService");
			valMap.put("module", module);
		} catch (Exception e) {
			throw new CustomException("PARSING ERROR", "Failed to fetch values from the Receipt Object");
		}

		return valMap;
	}

	/**
	 * Returns the map of the values required from the record
	 * 
	 * @return The required values as key,value pair
	 */
	private List<Map<String, String>> getValuesFromPayment(HashMap<String, Object> record) {
		BigDecimal totalAmount, amountPaid;
		String consumerCode, transactionId, paymentMode, tenantId, mobileNumber, module;
		Map<String, String> valMap = new HashMap<>();
		PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
		Payment payment = paymentRequest.getPayment();

		List<Map<String, String>> listOfValMap = new LinkedList<>();

		for (PaymentDetail paymentDetail : payment.getPaymentDetails()) {
			if (paymentDetail.getBill().getBusinessService().equalsIgnoreCase(BUSINESSSERVICE_CODE)) {
				Bill bill = paymentDetail.getBill();

				totalAmount = bill.getTotalAmount();
				valMap.put("totalAmount", totalAmount.toString());

				amountPaid = bill.getAmountPaid();
				valMap.put("amountPaid", amountPaid.toString());
				valMap.put("amountDue", totalAmount.subtract(amountPaid).toString());

				consumerCode = bill.getConsumerCode();
				valMap.put("consumerCode", consumerCode);
				valMap.put("propertyId", consumerCode);

				transactionId = payment.getTransactionNumber();
				valMap.put("transactionId", transactionId);

				paymentMode = payment.getPaymentMode();
				valMap.put("paymentMode", paymentMode);

				tenantId = payment.getTenantId();
				valMap.put("tenantId", tenantId);

				mobileNumber = bill.getMobileNumber();
				valMap.put("mobileNumber", mobileNumber);

				module = bill.getBusinessService();
				valMap.put("module", module);

				listOfValMap.add(valMap);
			}
		}

		return listOfValMap;
	}

	/**
	 * Returns the map of the values required from the record
	 * 
	 * @param documentContext
	 *            The DocumentContext of the record Object
	 * @return The required values as key,value pair
	 */
	private Map<String, String> getValuesFromTransaction(DocumentContext documentContext) {
		String txnStatus, txnAmount, moduleId, tenantId, mobileNumber, module;
		HashMap<String, String> valMap = new HashMap<>();

		try {
			txnStatus = documentContext.read("$.Transaction.txnStatus");
			valMap.put("txnStatus", txnStatus);

			txnAmount = documentContext.read("$.Transaction.txnAmount");
			valMap.put("txnAmount", txnAmount.toString());

			tenantId = documentContext.read("$.Transaction.tenantId");
			valMap.put("tenantId", tenantId);

			moduleId = documentContext.read("$.Transaction.consumerCode");
			valMap.put("moduleId", moduleId);
			valMap.put("propertyId", moduleId);
			// valMap.put("assessmentNumber",moduleId.split(":")[1]);

			mobileNumber = documentContext.read("$.Transaction.user.mobileNumber");
			valMap.put("mobileNumber", mobileNumber);

			// module =
			// documentContext.read("$.Transaction.taxAndPayments[0].businessService");
			// valMap.put("module",module);
		} catch (Exception e) {
			log.error("Transaction Object Parsing: ", e);
			throw new CustomException("PARSING ERROR", "Failed to fetch values from the Transaction Object");
		}

		return valMap;
	}

	/**
	 * Searches the property and extracts the needed values in map
	 * 
	 * @param valMap
	 *            The map of the required values
	 * @param requestInfo
	 *            The requestInfo of the propertyRequest
	 * @return Map of required values fetched from the property
	 */
	private Map<String, List<String>> getPropertyAttributes(Map<String, String> valMap, RequestInfo requestInfo) {
		PropertyCriteria propertyCriteria = new PropertyCriteria();
		propertyCriteria.setIds(Collections.singleton(valMap.get("propertyId")));
		propertyCriteria.setTenantId(valMap.get("tenantId"));
		List<Property> properties = propertyService.getPropertiesWithOwnerInfo(propertyCriteria, requestInfo);

		if (CollectionUtils.isEmpty(properties))
			throw new CustomException("ASSESSMENT NOT FOUND",
					"The assessment for the given consumer code is not available");

		// Extracting all the mobileNumbers to which notification be sent
		Set<String> mobileNumbers = new HashSet<>();
		properties.forEach(property -> {
			property.getPropertyDetails().forEach(propertyDetail -> {
				propertyDetail.getOwners().forEach(owner -> {
					mobileNumbers.add(owner.getMobileNumber());
				});
			});
		});

		String fianancialYear = properties.get(0).getPropertyDetails().get(0).getFinancialYear();
		String oldPropertyId = properties.get(0).getOldPropertyId();

		Map<String, List<String>> propertyAttributes = new HashMap<>();
		propertyAttributes.put("mobileNumbers", new ArrayList<>(mobileNumbers));
		propertyAttributes.put("financialYear", Collections.singletonList(fianancialYear));
		propertyAttributes.put("oldPropertyId", Collections.singletonList(oldPropertyId));

		return propertyAttributes;
	}

	/**
	 * Adds MobileNumber of logged in user
	 * 
	 * @param topic
	 *            topic from which listening
	 * @param requestInfo
	 *            RequestInfo of the request
	 * @param valMap
	 *            The map of the required values
	 * @param mobileNumbers
	 *            The list of mobileNumbers of owner of properties
	 */
	private void addUserNumber(String topic, RequestInfo requestInfo, Map<String, String> valMap,
			List<String> mobileNumbers) {
		// If the requestInfo is of citizen add citizen's MobileNumber
		if ((topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic())
				|| topic.equalsIgnoreCase(propertyConfiguration.getPgTopic()))
				&& !mobileNumbers.contains(valMap.get("mobileNumber")))
			mobileNumbers.add(valMap.get("mobileNumber"));
	}

	/**
	 * Returns the jsonPath
	 * 
	 * @param topic
	 *            The topic name from which object is received
	 * @param valMap
	 *            The map of the required values
	 * @return The jsonPath
	 */
	private String getJsonPath(String topic, Map<String, String> valMap) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		String paymentMode = valMap.get("paymentMode");
		if (topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic()) && paymentMode.equalsIgnoreCase("online"))
			path = path.replace("{}", PTConstants.NOTIFICATION_PAYMENT_ONLINE);

		if (topic.equalsIgnoreCase(propertyConfiguration.getPaymentTopic()) && !paymentMode.equalsIgnoreCase("online"))
			path = path.replace("{}", PTConstants.NOTIFICATION_PAYMENT_OFFLINE);

		if (topic.equalsIgnoreCase(propertyConfiguration.getPgTopic()))
			path = path.replace("{}", PTConstants.NOTIFICATION_PAYMENT_FAIL);

		return path;
	}

	/**
	 * Returns customized message for
	 * 
	 * @param valMap
	 *            The map of the required values
	 * @param message
	 *            The message template from localization
	 * @param path
	 *            The json path used to fetch message
	 * @return Customized message depending on values in valMap
	 */
	private String getCustomizedMessage(Map<String, String> valMap, String message, String path) {
		String customMessage = null;
		if (path.contains(PTConstants.NOTIFICATION_PAYMENT_ONLINE))
			customMessage = getCustomizedOnlinePaymentMessage(message, valMap);
		if (path.contains(PTConstants.NOTIFICATION_PAYMENT_OFFLINE))
			customMessage = getCustomizedOfflinePaymentMessage(message, valMap);
		if (path.contains(PTConstants.NOTIFICATION_PAYMENT_FAIL))
			customMessage = getCustomizedPaymentFailMessage(message, valMap);
		if (path.contains(PTConstants.NOTIFICATION_OLDPROPERTYID_ABSENT))
			customMessage = getCustomizedOldPropertyIdAbsentMessage(message, valMap);
		return customMessage;
	}

	/**
	 * @param message
	 *            The message template from localization
	 * @param valMap
	 *            The map of the required values
	 * @return Customized message depending on values in valMap
	 */
	private String getCustomizedOnlinePaymentMessage(String message, Map<String, String> valMap) {
		message = message.replace("< insert amount paid>", valMap.get("amountPaid"));
		message = message.replace("< insert payment transaction id from PG>", valMap.get("transactionId"));
		message = message.replace("<insert Property Tax Assessment ID>", valMap.get("propertyId"));
		message = message.replace("<pt due>.", valMap.get("amountDue"));
		message = message.replace("<pay_link>", "$paylink");
		// message = message.replace("<FY>",valMap.get("financialYear"));
		return message;
	}

	/**
	 * @param message
	 *            The message template from localization
	 * @param valMap
	 *            The map of the required values
	 * @return Customized message depending on values in valMap
	 */
	private String getCustomizedOfflinePaymentMessage(String message, Map<String, String> valMap) {
		message = message.replace("<amount>", valMap.get("amountPaid"));
		message = message.replace("<insert mode of payment>", valMap.get("paymentMode"));
		message = message.replace("<Enter pending amount>", valMap.get("amountDue"));
		message = message.replace("<pay_link>", "$paylink");
		// message = message.replace("<Insert FY>",valMap.get("financialYear"));
		return message;
	}

	/**
	 * @param message
	 *            The message template from localization
	 * @param valMap
	 *            The map of the required values
	 * @return Customized message depending on values in valMap
	 */
	private String getCustomizedPaymentFailMessage(String message, Map<String, String> valMap) {
		message = message.replace("<insert amount to pay>", valMap.get("txnAmount"));
		message = message.replace("<insert ID>", valMap.get("propertyId"));
		// message = message.replace("<FY>",valMap.get("financialYear"));
		return message;
	}

	/**
	 * @param message
	 *            The message template from localization
	 * @param valMap
	 *            The map of the required values
	 * @return Customized message depending on values in valMap
	 */
	private String getCustomizedOldPropertyIdAbsentMessage(String message, Map<String, String> valMap) {
		message = message.replace("<insert Property Tax Assessment ID>", valMap.get("propertyId"));
		// message = message.replace("<FY>",valMap.get("financialYear"));
		return message;
	}

	/**
	 * Creates SMSRequest for the given mobileNumber with the given message
	 * 
	 * @param mobileNumbers
	 *            The set of mobileNumber for which SMSRequest has to be created
	 * @param customizedMessage
	 *            The message to sent
	 * @return List of SMSRequest
	 */
	private List<SMSRequest> getSMSRequests(List<String> mobileNumbers, String customizedMessage,
			Map<String, String> valMap) {
		List<SMSRequest> smsRequests = new ArrayList<>();
		for (String mobileNumber : mobileNumbers) {
			log.info("mobNo: " + mobileNumber);
			if (!StringUtils.isEmpty(mobileNumber)) {
				String message = customizedMessage;
				if (null != valMap.get("amountDue")) {
					if (Double.valueOf(valMap.get("amountDue")) > 0) {
						String link = propertyConfiguration.getPayLink()
								.replace("$consumerCode", valMap.get("propertyId"))
								.replace("$tenantId", valMap.get("tenantId")).replace("$mobile", mobileNumber);
						link = propertyConfiguration.getUiAppHost() + link;
						link = getShortenedURL(link);
						message = message.replace("$paylink", "You can pay your Property Tax online here - " + link);
					} else {
						message = message.replace("$paylink", "");
					}
				}
				SMSRequest smsRequest = new SMSRequest(mobileNumber, message);
				log.info("smsRequests: " + smsRequests);

				smsRequests.add(smsRequest);
			}
		}

		return smsRequests;
	}

	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * 
	 * @param smsRequestList
	 *            The list of SMSRequest to be sent
	 */
	private void sendSMS(List<SMSRequest> smsRequestList) {
		log.info("Sending SMS.....");
		for (SMSRequest smsRequest : smsRequestList) {
			producer.push(propertyConfiguration.getSmsNotifTopic(), smsRequest);
			log.info(smsRequest.toString());
		}
	}

	private String getShortenedURL(String longURL) {
		ShortenRequest shortenRequest = ShortenRequest.builder().url(longURL).build();
		StringBuilder uri = new StringBuilder();
		uri.append(propertyConfiguration.getShortenerHost()).append(propertyConfiguration.getShortenerEndpoint());
		String shortenedURL = null;
		try {
			shortenedURL = serviceRequestRepository.getShortenedURL(uri, shortenRequest);
			if (StringUtils.isEmpty(shortenedURL)) {
				log.info("Shortened URL generation failed.");
				shortenedURL = longURL;
			}
		} catch (Exception e) {
			log.error("Shortened URL generation failed: ", e);
			shortenedURL = longURL;
		}

		return shortenedURL;
	}

}
