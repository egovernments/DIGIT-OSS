package org.egov.swservice.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.collection.PaymentResponse;
import org.egov.swservice.web.models.workflow.BusinessService;
import org.egov.swservice.web.models.workflow.State;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Service
@Slf4j
public class WorkflowNotificationService {

	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private NotificationUtil notificationUtil;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private WorkflowService workflowService;
	
	@Autowired
	private ValidateProperty validateProperty;

	String tenantIdReplacer = "$tenantId";
	String urlReplacer = "url";
	String requestInfoReplacer = "RequestInfo";
	String sewerageConnectionReplacer = "SewerageConnection";
	String fileStoreIdReplacer = "$fileStoreIds";
	String totalAmount = "totalAmount";
	String applicationFee = "applicationFee";
	String serviceFee = "serviceFee";
	String tax = "tax";
	String applicationNumberReplacer = "$applicationNumber";
	String consumerCodeReplacer = "$consumerCode";
	String connectionNoReplacer = "$connectionNumber";
	String mobileNoReplacer = "$mobileNo";
	String applicationKey = "$applicationkey";
	String propertyKey = "property";
	String businessService = "SW.ONE_TIME_FEE";

	/**
	 * 
	 * @param request - Sewerage Connection Request Object
	 * @param topic - Received Topic Name
	 */
	public void process(SewerageConnectionRequest request, String topic) {
		try {
			String applicationStatus = request.getSewerageConnection().getApplicationStatus();
			if (!SWConstants.NOTIFICATION_ENABLE_FOR_STATUS
					.contains(request.getSewerageConnection().getProcessInstance().getAction() + "_"
							+ applicationStatus)) {
				log.info("Notification Disabled For State :"
						+ applicationStatus);
				return;
			}
			Property property = validateProperty.getOrValidateProperty(request);
			
			if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEventRequest(request, topic, property, applicationStatus);
				if (eventRequest != null) {
					notificationUtil.sendEventNotification(eventRequest);
				}
			}
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(request, topic, property, applicationStatus);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}

		} catch (Exception ex) {
			log.error("Error occured while processing the record from topic : " + topic, ex);
		}
	}

	/**
	 * 
	 * @param sewerageConnectionRequest - Sewerage Connection Request
	 * @param topic - Topic Name
	 * @param property - Property Object
	 * @param applicationStatus - ApplicationStatus
	 * @return EventRequest Object
	 */
	private EventRequest getEventRequest(SewerageConnectionRequest sewerageConnectionRequest, String topic, Property property, String applicationStatus) {
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		int reqType = SWConstants.UPDATE_APPLICATION;
		if ((!sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& sewerageServicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)) {
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		
		String message = notificationUtil.getCustomizedMsgForInApp(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction(), applicationStatus,
				localizationMessage, reqType);
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
		if(!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		Map<String, String> mobileNumberAndMesssage = getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);
		if (message.contains("<receipt download link>"))
			mobileNumberAndMesssage = setRecepitDownloadLink(mobileNumberAndMesssage, sewerageConnectionRequest, message, property);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMesssage.keySet());
		Map<String, String> mapOfPhoneNoAndUUIDs = fetchUserUUIDs(mobileNumbers, sewerageConnectionRequest.getRequestInfo(),
				property.getTenantId());

		if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}
		List<Event> events = new ArrayList<>();
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhoneNoAndUUIDs.get(mobile) || null == mobileNumberAndMesssage.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhoneNoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			// List<String> payTriggerList =
			// Arrays.asList(config.getPayTriggers().split("[,]"));

			Action action = getActionForEventNotification(mobileNumberAndMesssage, mobile, sewerageConnectionRequest,
					property);
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMesssage.get(mobile)).eventType(SWConstants.USREVENTS_EVENT_TYPE)
					.name(SWConstants.USREVENTS_EVENT_NAME).postedBy(SWConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP).recepient(recepient).eventDetails(null).actions(action).build());
		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}
	}

	/**
	 * 
	 * @param mobileNumberAndMessage - List of Mobile and it's messages
	 * @param mobileNumber - MobileNumber
	 * @param sewerageConnectionRequest - SewerageConnection Request Object
	 * @param property Property Object
	 * @return return action link
	 */
	public Action getActionForEventNotification(Map<String, String> mobileNumberAndMessage, String mobileNumber,
			SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		String messageTemplate = mobileNumberAndMessage.get(mobileNumber);
		List<ActionItem> items = new ArrayList<>();
		if (messageTemplate.contains("<Action Button>")) {
			String code = StringUtils.substringBetween(messageTemplate, "<Action Button>", "</Action Button>");
			messageTemplate = messageTemplate.replace("<Action Button>", "");
			messageTemplate = messageTemplate.replace("</Action Button>", "");
			messageTemplate = messageTemplate.replace(code, "");
			String actionLink = "";
			if (code.equalsIgnoreCase("Download Application")) {
				actionLink = config.getNotificationUrl() + config.getViewHistoryLink();
				actionLink = actionLink.replace(mobileNoReplacer, mobileNumber);
				actionLink = actionLink.replace(applicationNumberReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				actionLink = actionLink.replace(tenantIdReplacer, property.getTenantId());
			}
			if (code.equalsIgnoreCase("PAY NOW")) {
				actionLink = config.getNotificationUrl() + config.getUserEventApplicationPayLink();
				actionLink = actionLink.replace(mobileNoReplacer, mobileNumber);
				actionLink = actionLink.replace(consumerCodeReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				actionLink = actionLink.replace(tenantIdReplacer, property.getTenantId());
			}
			if (code.equalsIgnoreCase("DOWNLOAD RECEIPT")) {
				String receiptNumber = getReceiptNumber(sewerageConnectionRequest);
				actionLink = config.getNotificationUrl() + config.getUserEventReceiptDownloadLink();
				actionLink = actionLink.replace("$consumerCode", sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				actionLink = actionLink.replace("$tenantId", property.getTenantId());
				actionLink = actionLink.replace("$businessService", businessService);
				actionLink = actionLink.replace("$receiptNumber", receiptNumber);
				actionLink = actionLink.replace("$mobile", mobileNumber);
			}
			if (code.equalsIgnoreCase("View History Link")) {
				actionLink = config.getNotificationUrl() + config.getViewHistoryLink();
				actionLink = actionLink.replace(mobileNoReplacer, mobileNumber);
				actionLink = actionLink.replace(applicationNumberReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				actionLink = actionLink.replace(tenantIdReplacer, property.getTenantId());
			}
			if (code.equalsIgnoreCase("Connection Detail Page")) {
				actionLink = config.getNotificationUrl() + config.getConnectionDetailsLink();
				actionLink = actionLink.replace(connectionNoReplacer, sewerageConnectionRequest.getSewerageConnection().getConnectionNo());
				actionLink = actionLink.replace(tenantIdReplacer, property.getTenantId());
				actionLink = actionLink.replace(mobileNoReplacer, mobileNumber);
			}
			ActionItem item = ActionItem.builder().actionUrl(actionLink).code(code).build();
			items.add(item);
			mobileNumberAndMessage.replace(mobileNumber, messageTemplate);
		}
		return Action.builder().actionUrls(items).build();

	}

	/**
	 * 
	 * @param sewerageConnectionRequest - Sewerage Connection Request
	 * @param topic - Topic Name
	 * @param property - Property Object
	 * @param applicationStatus - Application Status
	 * @return - Returns the list of SMSRequest Object
	 */
	private List<SMSRequest> getSmsRequest(SewerageConnectionRequest sewerageConnectionRequest, String topic, Property property, String applicationStatus) {
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		int reqType = SWConstants.UPDATE_APPLICATION;
		if ((!sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& sewerageServicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)) {
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		String message = notificationUtil.getCustomizedMsgForSMS(
				sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction(), applicationStatus,
				localizationMessage, reqType);
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
		if(!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		List<SMSRequest> smsRequest = new ArrayList<>();
		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);
		if (message.contains("<receipt download link>"))
			mobileNumberAndMessage = setRecepitDownloadLink(mobileNumberAndMessage, sewerageConnectionRequest, message, property);
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}

	public Map<String, String> getMessageForMobileNumber(Map<String, String> mobileNumbersAndNames,
			SewerageConnectionRequest sewerageConnectionRequest, String message, Property property) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Entry<String, String> mobileAndName : mobileNumbersAndNames.entrySet()) {
			String messageToReplace = message;
			if (messageToReplace.contains("<Owner Name>"))
				messageToReplace = messageToReplace.replace("<Owner Name>", mobileAndName.getValue());
			if (messageToReplace.contains("<Service>"))
				messageToReplace = messageToReplace.replace("<Service>", SWConstants.SERVICE_FIELD_VALUE_NOTIFICATION);

			if (messageToReplace.contains("<Application number>"))
				messageToReplace = messageToReplace.replace("<Application number>",
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());

			if (messageToReplace.contains("<Application download link>"))
				messageToReplace = messageToReplace.replace("<Application download link>",
						sewerageServicesUtil.getShortenedURL(
								getApplicationDownloaderLink(sewerageConnectionRequest, property)));

			if (messageToReplace.contains("<mseva URL>"))
				messageToReplace = messageToReplace.replace("<mseva URL>",
						sewerageServicesUtil.getShortenedURL(config.getNotificationUrl()));
			
			if (messageToReplace.contains("<Plumber Info>"))
				messageToReplace = getMessageForPlumberInfo(sewerageConnectionRequest.getSewerageConnection(), messageToReplace);
			
			if (messageToReplace.contains("<SLA>"))
				messageToReplace = messageToReplace.replace("<SLA>", getSLAForState(
						sewerageConnectionRequest, property));

			if (messageToReplace.contains("<mseva app link>"))
				messageToReplace = messageToReplace.replace("<mseva app link>",
						sewerageServicesUtil.getShortenedURL(config.getMSevaAppLink()));

			if (messageToReplace.contains("<View History Link>")) {
				String historyLink = config.getNotificationUrl() + config.getViewHistoryLink();
				historyLink = historyLink.replace(mobileNoReplacer, mobileAndName.getKey());
				historyLink = historyLink.replace(applicationNumberReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				historyLink = historyLink.replace(tenantIdReplacer, property.getTenantId());
				messageToReplace = messageToReplace.replace("<View History Link>",
						sewerageServicesUtil.getShortenedURL(historyLink));
			}
			if (messageToReplace.contains("<payment link>")) {
				String paymentLink = config.getNotificationUrl() + config.getApplicationPayLink();
				paymentLink = paymentLink.replace(mobileNoReplacer, mobileAndName.getKey());
				paymentLink = paymentLink.replace(consumerCodeReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				paymentLink = paymentLink.replace(tenantIdReplacer, property.getTenantId());
				messageToReplace = messageToReplace.replace("<payment link>",
						sewerageServicesUtil.getShortenedURL(paymentLink));
			}
			/*if (messageToReplace.contains("<receipt download link>"))
				messageToReplace = messageToReplace.replace("<receipt download link>",
						sewerageServicesUtil.getShortenedURL(config.getNotificationUrl()));*/

			if (messageToReplace.contains("<connection details page>")) {
				String connectionDetaislLink = config.getNotificationUrl() + config.getConnectionDetailsLink();
				connectionDetaislLink = connectionDetaislLink.replace(connectionNoReplacer,
						sewerageConnectionRequest.getSewerageConnection().getConnectionNo());
				connectionDetaislLink = connectionDetaislLink.replace(tenantIdReplacer, property.getTenantId());
				messageToReplace = messageToReplace.replace("<connection details page>",
						sewerageServicesUtil.getShortenedURL(connectionDetaislLink));
			}
			if(messageToReplace.contains("<Date effective from>")) {
				if (sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() != null) {
					LocalDate date = Instant
							.ofEpochMilli(sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() > 10 ?
									sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() :
									sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() * 1000)
							.atZone(ZoneId.systemDefault()).toLocalDate();
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
					messageToReplace = messageToReplace.replace("<Date effective from>", date.format(formatter));
				} else {
					messageToReplace = messageToReplace.replace("<Date effective from>", "");
				}
			}
			messageToReturn.put(mobileAndName.getKey(), messageToReplace);
		}
		return messageToReturn;
	}
	
	/**
	 * This method returns message to replace for plumber info depending upon
	 * whether the plumber info type is either SELF or ULB
	 * 
	 * @param sewerageConnection - Sewerage Connection Request Object
	 * @param messageTemplate - Message Template
	 * @return updated messageTemplate
	 */

	@SuppressWarnings("unchecked")
	public String getMessageForPlumberInfo(SewerageConnection sewerageConnection, String messageTemplate) {
		HashMap<String, Object> addDetail = mapper.convertValue(sewerageConnection.getAdditionalDetails(),
				HashMap.class);
		if (!StringUtils.isEmpty(String.valueOf(addDetail.get(SWConstants.DETAILS_PROVIDED_BY)))) {
			String detailsProvidedBy = String.valueOf(addDetail.get(SWConstants.DETAILS_PROVIDED_BY));
			if (StringUtils.isEmpty(detailsProvidedBy) || detailsProvidedBy.equalsIgnoreCase(SWConstants.SELF)) {
				String code = StringUtils.substringBetween(messageTemplate, "<Plumber Info>", "</Plumber Info>");
				messageTemplate = messageTemplate.replace("<Plumber Info>", "");
				messageTemplate = messageTemplate.replace("</Plumber Info>", "");
				messageTemplate = messageTemplate.replace(code, "");
			} else {
				messageTemplate = messageTemplate.replace("<Plumber Info>", "").replace("</Plumber Info>", "");
				messageTemplate = messageTemplate.replace("<Plumber name>",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getName()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getName());
				messageTemplate = messageTemplate.replace("<Plumber Licence No.>",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getLicenseNo()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getLicenseNo());
				messageTemplate = messageTemplate.replace("<Plumber Mobile No.>",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getMobileNumber()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getMobileNumber());
			}

		}else{
			String code = StringUtils.substringBetween(messageTemplate, "<Plumber Info>", "</Plumber Info>");
			messageTemplate = messageTemplate.replace("<Plumber Info>", "");
			messageTemplate = messageTemplate.replace("</Plumber Info>", "");
			messageTemplate = messageTemplate.replace(code, "");
		}

		return messageTemplate;

	}

	/**
	 * Fetches SLA of CITIZEN based on the phone number.
	 * 
	 * @param sewerageConnectionRequest - Sewerage Connection Request Object
	 * @param property - Property Object
	 * @return string consisting SLA
	 */

	public String getSLAForState(SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		String resultSla = "";
		BusinessService businessService = workflowService
				.getBusinessService(config.getBusinessServiceValue(), property.getTenantId(), sewerageConnectionRequest.getRequestInfo());
		if (businessService != null && businessService.getStates() != null && businessService.getStates().size() > 0) {
			for (State state : businessService.getStates()) {
				if (SWConstants.PENDING_FOR_CONNECTION_ACTIVATION.equalsIgnoreCase(state.getState())) {
					resultSla = String.valueOf(
							(state.getSla() == null ? 0L : state.getSla()) / 86400000);
				}
			}
		}
		return resultSla;
	}

	/**
	 * Fetches UUIDs of CITIZEN based on the phone number.
	 * 
	 * @param mobileNumbers - List of Mobile Numbers
	 * @param requestInfo - Request Info Object
	 * @param tenantId - TenantId
	 * @return - Returns list of MobileNumbers and UUIDs
	 */
	public Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
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
				log.error("Exception trace: ", e);
			}
		}
		return mapOfPhoneNoAndUUIDs;
	}

	/**
	 * Fetch URL for application download link
	 * 
	 * @param sewerageConnectionRequest - Sewerage Connection Request Object
	 * @param property - Property Object
	 * @return application download link
	 */
	private String getApplicationDownloaderLink(SewerageConnectionRequest sewerageConnectionRequest,
			Property property) {
		CalculationCriteria criteria = CalculationCriteria.builder()
				.applicationNo(sewerageConnectionRequest.getSewerageConnection().getApplicationNo())
				.sewerageConnection(sewerageConnectionRequest.getSewerageConnection()).tenantId(property.getTenantId())
				.build();
		CalculationReq calRequest = CalculationReq.builder().calculationCriteria(Arrays.asList(criteria))
				.requestInfo(sewerageConnectionRequest.getRequestInfo()).isconnectionCalculation(false).build();
		try {
			Object response = serviceRequestRepository.fetchResult(sewerageServicesUtil.getEstimationURL(), calRequest);
			CalculationRes calResponse = mapper.convertValue(response, CalculationRes.class);
			JSONObject sewerageObject = mapper.convertValue(sewerageConnectionRequest.getSewerageConnection(),
					JSONObject.class);
			if (CollectionUtils.isEmpty(calResponse.getCalculation())) {
				throw new CustomException("NO_ESTIMATION_FOUND", "Estimation not found!!!");
			}
			sewerageObject.put(totalAmount, calResponse.getCalculation().get(0).getTotalAmount());
			sewerageObject.put(applicationFee, calResponse.getCalculation().get(0).getFee());
			sewerageObject.put(serviceFee, calResponse.getCalculation().get(0).getCharge());
			sewerageObject.put(tax, calResponse.getCalculation().get(0).getTaxAmount());
			sewerageObject.put(propertyKey, property);
			String tenantId = property.getTenantId().split("\\.")[0];
			String fileStoreId = getFielStoreIdFromPDFService(sewerageObject,
					sewerageConnectionRequest.getRequestInfo(), tenantId);
			return getApplicationDownloadLink(tenantId, fileStoreId);
		} catch (Exception ex) {
			log.error("Calculation response error!!", ex);
			throw new CustomException("WATER_CALCULATION_EXCEPTION", "Calculation response can not parsed!!!");
		}
	}

	/**
	 * Get file store id from PDF service
	 * 
	 * @param sewerageObject - Sewerage Connection JSON Object
	 * @param requestInfo - Request Info
	 * @param tenantId - Tenant Id
	 * @return file store id
	 */
	private String getFielStoreIdFromPDFService(JSONObject sewerageObject, RequestInfo requestInfo, String tenantId) {
		JSONArray sewerageconnectionlist = new JSONArray();
		sewerageconnectionlist.add(sewerageObject);
		JSONObject requestPayload = new JSONObject();
		requestPayload.put(requestInfoReplacer, requestInfo);
		requestPayload.put(sewerageConnectionReplacer, sewerageconnectionlist);
		try {
			StringBuilder builder = new StringBuilder();
			builder.append(config.getPdfServiceHost());
			String pdfLink = config.getPdfServiceLink();
			pdfLink = pdfLink.replace(tenantIdReplacer, tenantId).replace(applicationKey, SWConstants.PDF_APPLICATION_KEY);
			builder.append(pdfLink);
			Object response = serviceRequestRepository.fetchResult(builder, requestPayload);
			DocumentContext responseContext = JsonPath.parse(response);
			List<Object> fileStoreIds = responseContext.read("$.filestoreIds");
			if (CollectionUtils.isEmpty(fileStoreIds)) {
				throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
						"No file store id found from pdf service");
			}
			return fileStoreIds.get(0).toString();
		} catch (Exception ex) {
			log.error("PDF file store id response error!!", ex);
			throw new CustomException("SEWERAGE_FILESTORE_PDF_EXCEPTION", "PDF response can not parsed!!!");
		}
	}

	/**
	 * 
	 * @param tenantId - TenantId
	 * @param fileStoreId - File Store Id
	 * @return file store id
	 */
	private String getApplicationDownloadLink(String tenantId, String fileStoreId) {
		String fileStoreServiceLink = config.getFileStoreHost() + config.getFileStoreLink();
		fileStoreServiceLink = fileStoreServiceLink.replace(tenantIdReplacer, tenantId);
		fileStoreServiceLink = fileStoreServiceLink.replace(fileStoreIdReplacer, fileStoreId);
		try {
			Object response = serviceRequestRepository.fetchResultUsingGet(new StringBuilder(fileStoreServiceLink));
			DocumentContext responseContext = JsonPath.parse(response);
			List<Object> fileStoreIds = responseContext.read("$.fileStoreIds");
			if (CollectionUtils.isEmpty(fileStoreIds)) {
				throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
						"No file store id found from pdf service");
			}
			JSONObject object = mapper.convertValue(fileStoreIds.get(0), JSONObject.class);
			return object.get(urlReplacer).toString();
		} catch (Exception ex) {
			log.error("PDF file store id response error!!", ex);
			throw new CustomException("SEWERAGE_FILESTORE_PDF_EXCEPTION", "PDF response can not parsed!!!");
		}
	}

	public Map<String, String> setRecepitDownloadLink(Map<String, String> mobileNumberAndMesssage,
													  SewerageConnectionRequest sewerageConnectionRequest, String message, Property property) {

			Map<String, String> messageToReturn = new HashMap<>();
			String receiptNumber = getReceiptNumber(sewerageConnectionRequest);
			for (Entry<String, String> mobileAndMsg : mobileNumberAndMesssage.entrySet()) {
				String messageToReplace = mobileAndMsg.getValue();
				String link = config.getNotificationUrl() + config.getReceiptDownloadLink();
				link = link.replace("$consumerCode", sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				link = link.replace("$tenantId", property.getTenantId());
				link = link.replace("$businessService", businessService);
				link = link.replace("$receiptNumber", receiptNumber);
				link = link.replace("$mobile", mobileAndMsg.getKey());
				link = sewerageServicesUtil.getShortenedURL(link);
				messageToReplace = messageToReplace.replace("<receipt download link>", link);

				messageToReturn.put(mobileAndMsg.getKey(), messageToReplace);
			}
			
		return messageToReturn;

	}

	public String getReceiptNumber(SewerageConnectionRequest sewerageConnectionRequest){
		StringBuilder URL = sewerageServicesUtil.getcollectionURL();
		URL.append("?").append("consumerCodes=").append(sewerageConnectionRequest.getSewerageConnection().getApplicationNo())
				.append("&").append("tenantId=").append(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).build();
		Object response = serviceRequestRepository.fetchResult(URL,requestInfoWrapper);
		PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
		return paymentResponse.getPayments().get(0).getPaymentDetails().get(0).getReceiptNumber();
	}

}
