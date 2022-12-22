package org.egov.swservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.collection.PaymentResponse;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.users.UserSearchRequest;
import org.egov.swservice.web.models.workflow.BusinessService;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.web.models.workflow.State;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Map.Entry;

import static org.egov.swservice.util.SWConstants.*;

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

	@Autowired
	private UserService userService;

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
			User userInfoCopy = request.getRequestInfo().getUserInfo();
			User userInfo = notificationUtil.getInternalMicroserviceUser(request.getSewerageConnection().getTenantId());
			request.getRequestInfo().setUserInfo(userInfo);

			Property property = validateProperty.getOrValidateProperty(request);

			request.getRequestInfo().setUserInfo(userInfoCopy);

			List<String> configuredChannelNames =  notificationUtil.fetchChannelList(request.getRequestInfo(), request.getSewerageConnection().getTenantId(), SEWERAGE_SERVICE_BUSINESS_ID, request.getSewerageConnection().getProcessInstance().getAction());


			if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
				if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
					EventRequest eventRequest = getEventRequest(request, topic, property, applicationStatus);
					if (eventRequest != null) {
						notificationUtil.sendEventNotification(eventRequest);
					}
				}
			}
			if(configuredChannelNames.contains(CHANNEL_NAME_SMS)){

				if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(request, topic, property, applicationStatus);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}
			}
			if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)){
				if (config.getIsEmailNotificationEnabled() != null && config.getIsEmailNotificationEnabled()) {
					List<EmailRequest> emailRequests = getEmailRequest(request, topic, property, applicationStatus);
					if (!CollectionUtils.isEmpty(emailRequests)) {
						notificationUtil.sendEmail(emailRequests);
					}
				}}

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
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();

		int reqType = SWConstants.UPDATE_APPLICATION;
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& sewerageServicesUtil.isModifyConnectionRequestForNotification(sewerageConnectionRequest)) {
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		if((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) &&
				sewerageServicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest))
		{
			reqType = DISCONNECT_CONNECTION;
		}
		
		String message = notificationUtil.getCustomizedMsgForInApp(
				workflow.getAction(), applicationStatus,
				localizationMessage, reqType);
		if(workflow.getAction().equalsIgnoreCase(APPROVE_DISCONNECTION_CONST) && workflow.getComment()!=null
				&&workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			message = notificationUtil.getCustomizedMsgForInApp(workflow.getAction(), PENDING_FOR_DISCONNECTION_EXECUTION_STATUS_CODE,
					localizationMessage, reqType);
		}
		if(workflow.getAction().equalsIgnoreCase(ACTION_PAY) && workflow.getComment()!=null
				&& workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			log.info("Skipping for action status -> "+workflow.getAction().equalsIgnoreCase(ACTION_PAY)+"_"+sewerageConnectionRequest.getSewerageConnection().getApplicationStatus()
					+" because -> "+workflow.getComment());
			return null;
		}
		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return null;
		}

		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();

		Set<String> ownersMobileNumbers = new HashSet<>();
		//Send the notification to all owners
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				ownersMobileNumbers.add(owner.getMobileNumber());
		});

		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					ownersMobileNumbers.add(holder.getMobileNumber());
				}
			});
		}

		for (String mobileNumber : ownersMobileNumbers) {
			UserDetailResponse userDetailResponse = fetchUserByUsername(mobileNumber, sewerageConnectionRequest.getRequestInfo(), sewerageConnectionRequest.getSewerageConnection().getTenantId());
			if (!CollectionUtils.isEmpty(userDetailResponse.getUser())) {
				OwnerInfo user = userDetailResponse.getUser().get(0);
				mobileNumbersAndNames.put(user.getMobileNumber(), user.getName());
				mapOfPhoneNoAndUUIDs.put(user.getMobileNumber(), user.getUuid());
			} else {
				log.info("No User for mobile {} skipping event", mobileNumber);
			}
		}

			//Send the notification to applicant
			if(!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
			{
				mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
				mapOfPhoneNoAndUUIDs.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid());
			}


		Map<String, String> mobileNumberAndMesssage = getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);
		if (message.contains("{receipt download link}"))
			mobileNumberAndMesssage = setRecepitDownloadLink(mobileNumberAndMesssage, sewerageConnectionRequest, message, property);
		Set<String> mobileNumbers = new HashSet<>(mobileNumberAndMesssage.keySet());

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
		if (messageTemplate.contains("{Action Button}")) {
			String code = StringUtils.substringBetween(messageTemplate, "{Action Button}", "{/Action Button}");
			messageTemplate = messageTemplate.replace("{Action Button}", "");
			messageTemplate = messageTemplate.replace("{/Action Button}", "");
			messageTemplate = messageTemplate.replace(code, "");
			String actionLink = "";
			if (code.equalsIgnoreCase("Download Application")) {
				actionLink = config.getNotificationUrl() + config.getViewHistoryLink();
				actionLink = actionLink.replace(applicationNumberReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
			}
			if (code.equalsIgnoreCase("PAY NOW")||code.equalsIgnoreCase("Pay Dues")) {
				actionLink = config.getNotificationUrl() + config.getViewHistoryLink();
				actionLink = actionLink.replace(applicationNumberReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
			}
			if (code.equalsIgnoreCase("DOWNLOAD RECEIPT")) {
				actionLink = config.getNotificationUrl() + config.getMyPaymentsLink();
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
				actionLink = actionLink.replace(applicationNumberReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
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
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();

		int reqType = SWConstants.UPDATE_APPLICATION;
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& sewerageServicesUtil.isModifyConnectionRequestForNotification(sewerageConnectionRequest)) {
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		if((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) &&
				sewerageServicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest))
		{
			reqType = DISCONNECT_CONNECTION;
		}
		String message = notificationUtil.getCustomizedMsgForSMS(
				workflow.getAction(), applicationStatus,
				localizationMessage, reqType);
		if(workflow.getAction().equalsIgnoreCase(APPROVE_DISCONNECTION_CONST) && workflow.getComment()!=null
				&& workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			message = notificationUtil.getCustomizedMsgForSMS(workflow.getAction(), PENDING_FOR_DISCONNECTION_EXECUTION_STATUS_CODE,
					localizationMessage, reqType);
		}
		if(workflow.getAction().equalsIgnoreCase(ACTION_PAY) && workflow.getComment()!=null
				&& workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			log.info("Skipping for action status -> "+workflow.getAction().equalsIgnoreCase(ACTION_PAY)+"_"+sewerageConnectionRequest.getSewerageConnection().getApplicationStatus()
					+" because -> "+workflow.getComment());
			return Collections.emptyList();
		}

		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return Collections.emptyList();
		}

		//Send the notification to all owners
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
			{
				mobileNumbersAndNames.put(owner.getMobileNumber(),owner.getName());
			}
		});


		//send the notification to the connection holders
			if(!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
				sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
					if (!StringUtils.isEmpty(holder.getMobileNumber())) {
						mobileNumbersAndNames.put(holder.getMobileNumber(),holder.getName());
					}
				});
			}

			//Send the notification to applicant
			if(!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
			{
				mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
			}

		List<SMSRequest> smsRequest = new ArrayList<>();
		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);
		if (message.contains("{receipt download link}"))
			mobileNumberAndMessage = setRecepitDownloadLink(mobileNumberAndMessage, sewerageConnectionRequest, message, property);
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.NOTIFICATION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}

	/**
	 * Creates email request for each owner
	 *
	 * @param sewerageConnectionRequest Sewerage Connection Request
	 * @param topic Topic Name
	 * @param property Property Object
	 * @param applicationStatus Application Status
	 * @return List of EmailRequest
	 */
	private List<EmailRequest> getEmailRequest(SewerageConnectionRequest sewerageConnectionRequest, String topic,
											   Property property, String applicationStatus) {
		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				sewerageConnectionRequest.getRequestInfo());
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();

		int reqType = SWConstants.UPDATE_APPLICATION;
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION))
				&& sewerageServicesUtil.isModifyConnectionRequestForNotification(sewerageConnectionRequest)) {
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		if((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) &&
				sewerageServicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest))
		{
			reqType = DISCONNECT_CONNECTION;
		}
		String message = notificationUtil.getCustomizedMsgForEmail(
				workflow.getAction(), applicationStatus,
				localizationMessage, reqType);
		if(workflow.getAction().equalsIgnoreCase(APPROVE_DISCONNECTION_CONST) && workflow.getComment()!=null
				&& workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			message = notificationUtil.getCustomizedMsgForEmail(workflow.getAction(), PENDING_FOR_DISCONNECTION_EXECUTION_STATUS_CODE,
					localizationMessage, reqType);
		}
		if(workflow.getAction().equalsIgnoreCase(ACTION_PAY) && workflow.getComment()!=null
				&& workflow.getComment().contains(WORKFLOW_NO_PAYMENT_CODE))
		{
			log.info("Skipping for action status -> "+workflow.getAction().equalsIgnoreCase(ACTION_PAY)+"_"+sewerageConnectionRequest.getSewerageConnection().getApplicationStatus()
					+" because -> "+workflow.getComment());
			return Collections.emptyList();
		}
		if (message == null) {
			log.info("No message Found For Topic : " + topic);
			return Collections.emptyList();
		}

		//Send the notification to all owners
		Set<String> ownersUuids = new HashSet<>();

		property.getOwners().forEach(owner -> {
			if (owner.getUuid() != null)
				ownersUuids.add(owner.getUuid());
		});

		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getUuid())) {
					ownersUuids.add(holder.getUuid());
				}
			});
		}

		UserDetailResponse userDetailResponse = fetchUserByUUID(ownersUuids,sewerageConnectionRequest.getRequestInfo(),sewerageConnectionRequest.getSewerageConnection().getTenantId());
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		for(OwnerInfo user:userDetailResponse.getUser())
		{
			mobileNumbersAndNames.put(user.getMobileNumber(),user.getName());
		}

		Set<String> mobileNumbers = new HashSet<String>();
		mobileNumbers.addAll(mobileNumbersAndNames.keySet());

		Map<String,String> mobileNumberAndEmailId = new HashMap<>();
		for(OwnerInfo user:userDetailResponse.getUser()) {
			mobileNumberAndEmailId.put(user.getMobileNumber(), user.getEmailId());
		}

		//Send the notification to applicant
		if(!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
			mobileNumbers.add(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber());
			mobileNumberAndEmailId.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getEmailId());
		}

		Map<String, String> mobileNumberAndMessage = getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);

		if (message.contains("{receipt download link}"))
			mobileNumberAndMessage = setRecepitDownloadLink(mobileNumberAndMessage, sewerageConnectionRequest, message, property);

		List<EmailRequest> emailRequest = new LinkedList<>();
		for (Map.Entry<String, String> entryset : mobileNumberAndEmailId.entrySet()) {
			String customizedMsg = mobileNumberAndMessage.get(entryset.getKey());
			String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
			String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
			Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
			EmailRequest email = new EmailRequest(sewerageConnectionRequest.getRequestInfo(),emailobj);
			emailRequest.add(email);
		}
		return emailRequest;
	}
	public Map<String, String> getMessageForMobileNumber(Map<String, String> mobileNumbersAndNames,
			SewerageConnectionRequest sewerageConnectionRequest, String message, Property property) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Entry<String, String> mobileAndName : mobileNumbersAndNames.entrySet()) {
			String messageToReplace = message;
			Boolean isConnectionNoPresent = !StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionNo());

			if (messageToReplace.contains("{Owner Name}"))
				messageToReplace = messageToReplace.replace("{Owner Name}", mobileAndName.getValue());
			if (messageToReplace.contains("{Service}"))
				messageToReplace = messageToReplace.replace("{Service}", SWConstants.SERVICE_FIELD_VALUE_NOTIFICATION);

			if (messageToReplace.contains("{Application number}"))
				messageToReplace = messageToReplace.replace("{Application number}",
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());

			if (messageToReplace.contains("{Connection number}"))
				messageToReplace = messageToReplace.replace("{Connection number}", isConnectionNoPresent ? sewerageConnectionRequest.getSewerageConnection().getConnectionNo() : "NA");

			if(messageToReplace.contains("{Reason for Rejection}"))
				messageToReplace = messageToReplace.replace("{Reason for Rejection}",  sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getComment());

			if (messageToReplace.contains("{Application download link}")) {
				String actionLink = config.getNotificationUrl() + config.getViewHistoryLink();
				actionLink = actionLink.replace(applicationNumberReplacer, sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				messageToReplace = messageToReplace.replace("{Application download link}", sewerageServicesUtil.getShortenedURL(actionLink));
			}

			if (messageToReplace.contains("{mseva URL}"))
				messageToReplace = messageToReplace.replace("{mseva URL}",
						sewerageServicesUtil.getShortenedURL(config.getNotificationUrl()));
			
			if (messageToReplace.contains("{Plumb Info}"))
				messageToReplace = getMessageForPlumberInfo(sewerageConnectionRequest.getSewerageConnection(), messageToReplace);
			
			if (messageToReplace.contains("{SLA}"))
				messageToReplace = messageToReplace.replace("{SLA}", getSLAForState(
						sewerageConnectionRequest, property));

			if (messageToReplace.contains("{mseva app link}"))
				messageToReplace = messageToReplace.replace("{mseva app link}",
						sewerageServicesUtil.getShortenedURL(config.getMSevaAppLink()));

			if (messageToReplace.contains("{View History Link}")) {
				String historyLink = config.getNotificationUrl() + config.getViewHistoryLink();
				historyLink = historyLink.replace(mobileNoReplacer, mobileAndName.getKey());
				historyLink = historyLink.replace(applicationNumberReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				historyLink = historyLink.replace(tenantIdReplacer, property.getTenantId());
				messageToReplace = messageToReplace.replace("{View History Link}",
						sewerageServicesUtil.getShortenedURL(historyLink));
			}
			if (messageToReplace.contains("{payment link}")) {
				String paymentLink = config.getNotificationUrl() + config.getViewHistoryLink();
				paymentLink = paymentLink.replace(mobileNoReplacer, mobileAndName.getKey());
				paymentLink = paymentLink.replace(applicationNumberReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				paymentLink = paymentLink.replace(tenantIdReplacer, property.getTenantId());
				messageToReplace = messageToReplace.replace("{payment link}",
						sewerageServicesUtil.getShortenedURL(paymentLink));
			}
			/*if (messageToReplace.contains("{receipt download link}"))
				messageToReplace = messageToReplace.replace("{receipt download link}",
						sewerageServicesUtil.getShortenedURL(config.getNotificationUrl()));*/

			if (messageToReplace.contains("{connection details page}")) {
				String connectionDetaislLink = config.getNotificationUrl() + config.getConnectionDetailsLink();
				connectionDetaislLink = connectionDetaislLink.replace(applicationNumberReplacer,
						sewerageConnectionRequest.getSewerageConnection().getApplicationNo());
				messageToReplace = messageToReplace.replace("{connection details page}",
						sewerageServicesUtil.getShortenedURL(connectionDetaislLink));
			}
			if(messageToReplace.contains("{Date effective from}")) {
				if (sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() != null) {
					LocalDate date = Instant
							.ofEpochMilli(sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() > 10 ?
									sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() :
									sewerageConnectionRequest.getSewerageConnection().getDateEffectiveFrom() * 1000)
							.atZone(ZoneId.systemDefault()).toLocalDate();
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
					messageToReplace = messageToReplace.replace("{Date effective from}", date.format(formatter));
				} else {
					messageToReplace = messageToReplace.replace("{Date effective from}", "");
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
				String code = StringUtils.substringBetween(messageTemplate, "{Plumb Info}", "{/Plumb Info}");
				messageTemplate = messageTemplate.replace("{Plumb Info}", "");
				messageTemplate = messageTemplate.replace("{/Plumb Info}", "");
				messageTemplate = messageTemplate.replace(code, "");
			} else {
				messageTemplate = messageTemplate.replace("{Plumb Info}", "").replace("{/Plumb Info}", "");
				messageTemplate = messageTemplate.replace("{Plumb name}",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getName()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getName());
				messageTemplate = messageTemplate.replace("{Plumb Licence No.}",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getLicenseNo()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getLicenseNo());
				messageTemplate = messageTemplate.replace("{Plumb Mobile No.}",
						StringUtils.isEmpty(sewerageConnection.getPlumberInfo().get(0).getMobileNumber()) ? ""
								: sewerageConnection.getPlumberInfo().get(0).getMobileNumber());
			}

		}else{
			String code = StringUtils.substringBetween(messageTemplate, "{Plumb Info}", "{/Plumb Info}");
			messageTemplate = messageTemplate.replace("{Plumb Info}", "");
			messageTemplate = messageTemplate.replace("{/Plumb Info}", "");
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
					log.error("Service returned null while fetching user for username - " + mobileNo);
				}
			} catch (Exception e) {
				log.error("Exception while fetching user for username - " + mobileNo);
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
			for (Entry<String, String> mobileAndMsg : mobileNumberAndMesssage.entrySet()) {
				String messageToReplace = mobileAndMsg.getValue();
				String link = config.getNotificationUrl() + config.getMyPaymentsLink();
				link = sewerageServicesUtil.getShortenedURL(link);
				messageToReplace = messageToReplace.replace("{receipt download link}", link);
				messageToReturn.put(mobileAndMsg.getKey(), messageToReplace);
			}
			
		return messageToReturn;

	}

	public String getReceiptNumber(SewerageConnectionRequest sewerageConnectionRequest){
		String consumerCode,service;
		if(StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionNo())){
			consumerCode = sewerageConnectionRequest.getSewerageConnection().getApplicationNo();
			service = businessService;
		}
		else{
			consumerCode = sewerageConnectionRequest.getSewerageConnection().getConnectionNo();
			service = "SW";
		}
		StringBuilder URL = sewerageServicesUtil.getcollectionURL();
		URL.append(service).append("/_search").append("?").append("consumerCodes=").append(consumerCode)
				.append("&").append("tenantId=").append(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).build();
		Object response = serviceRequestRepository.fetchResult(URL,requestInfoWrapper);
		PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
		return paymentResponse.getPayments().get(0).getPaymentDetails().get(0).getReceiptNumber();
	}

	/**
	 * Fetches User Object based on the UUID.
	 *
	 * @param uuids - set of UUIDs of User
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return - Returns User object with given UUID
	 */
	public UserDetailResponse fetchUserByUUID(Set<String> uuids, RequestInfo requestInfo, String tenantId) {
		User userInfoCopy = requestInfo.getUserInfo();

		User userInfo = notificationUtil.getInternalMicroserviceUser(tenantId);
		requestInfo.setUserInfo(userInfo);

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(tenantId, requestInfo);
		userSearchRequest.setUuid(uuids);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		requestInfo.setUserInfo(userInfoCopy);
		return userDetailResponse;
	}

	/**
	 * Fetches User Object based on the UUID.
	 *
	 * @param username - username of User
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return - Returns User object with given UUID
	 */
	public UserDetailResponse fetchUserByUsername(String username, RequestInfo requestInfo, String tenantId) {
		User userInfoCopy = requestInfo.getUserInfo();

		User userInfo = notificationUtil.getInternalMicroserviceUser(tenantId);
		requestInfo.setUserInfo(userInfo);

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(tenantId, requestInfo);
		userSearchRequest.setUserName(username);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		requestInfo.setUserInfo(userInfoCopy);
		return userDetailResponse;
	}
}
