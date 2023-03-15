package org.egov.waterconnection.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.repository.WaterDao;
import org.egov.waterconnection.util.NotificationUtil;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.validator.ValidateProperty;
import org.egov.waterconnection.web.models.*;
import org.egov.waterconnection.web.models.collection.PaymentDetail;
import org.egov.waterconnection.web.models.collection.PaymentRequest;
import org.egov.waterconnection.web.models.users.UserDetailResponse;
import org.egov.waterconnection.web.models.workflow.ProcessInstance;
import org.egov.waterconnection.workflow.WorkflowIntegrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.egov.waterconnection.constants.WCConstants.*;
import static org.egov.waterconnection.constants.WCConstants.PENDING_FOR_PAYMENT_STATUS_CODE;

@Slf4j
@Service
public class PaymentUpdateService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WSConfiguration config;

	@Autowired
	private WaterServiceImpl waterService;

	@Autowired
	private WorkflowIntegrator wfIntegrator;

	@Autowired
	private WaterDao repo;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ValidateProperty validateProperty;

	@Autowired
	private EnrichmentService enrichmentService;

	@Autowired
	private NotificationUtil notificationUtil;

	@Autowired
	private WorkflowNotificationService workflowNotificationService;

	@Autowired
	private WaterServicesUtil waterServiceUtil;
	/**
	 * After payment change the application status
	 *
	 * @param record
	 *            payment request
	 */
	public void process(HashMap<String, Object> record) {
		try {
			PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
			boolean isServiceMatched = false;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				if (WCConstants.WATER_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService()) ||
            paymentDetail.getBusinessService().equalsIgnoreCase(config.getReceiptBusinessservice())) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			paymentRequest.getRequestInfo().setUserInfo(fetchUser(
					paymentRequest.getRequestInfo().getUserInfo().getUuid(), paymentRequest.getRequestInfo()));
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service : {}" , paymentDetail.getBusinessService());
				SearchCriteria criteria = new SearchCriteria();
				if (paymentDetail.getBusinessService().equalsIgnoreCase(config.getReceiptDisconnectionBusinessservice())) {
					criteria = SearchCriteria.builder()
							.tenantId(paymentRequest.getPayment().getTenantId())
							.connectionNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet()))
							.applicationStatus(Collections.singleton(PENDING_FOR_PAYMENT_STATUS_CODE)).build();
				}
				if (paymentDetail.getBusinessService().equalsIgnoreCase(config.getReceiptBusinessservice())) {
					criteria = SearchCriteria.builder()
							.tenantId(paymentRequest.getPayment().getTenantId())
							.applicationNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet())).build();
				}
				criteria.setIsInternalCall(Boolean.TRUE);
				List<WaterConnection> waterConnections = waterService.search(criteria,
							paymentRequest.getRequestInfo());
					if (CollectionUtils.isEmpty(waterConnections)) {
						throw new CustomException("INVALID_RECEIPT",
								"No waterConnection found for the consumerCode " + criteria.getApplicationNumber());
					}
					Optional<WaterConnection> connections = waterConnections.stream().findFirst();
					WaterConnection connection = connections.get();
					if (waterConnections.size() > 1) {
						throw new CustomException("INVALID_RECEIPT",
								"More than one application found on consumerCode " + criteria.getApplicationNumber());
					}
					waterConnections.forEach(waterConnection -> waterConnection.getProcessInstance().setAction((WCConstants.ACTION_PAY)));
					WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
							.waterConnection(connection).requestInfo(paymentRequest.getRequestInfo())
							.build();
					try {
						log.info("WaterConnection Request " + mapper.writeValueAsString(waterConnectionRequest));
					} catch (Exception ex) {
						log.error("Temp Catch Excption:", ex);
					}

					Property property = validateProperty.getOrValidateProperty(waterConnectionRequest);

					// Enrich tenantId in userInfo for workflow call
					RequestInfo requestInfo = waterConnectionRequest.getRequestInfo();
					Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(property.getTenantId()).build();
					requestInfo.getUserInfo().getRoles().add(role);
					wfIntegrator.callWorkFlow(waterConnectionRequest, property);
					enrichmentService.enrichFileStoreIds(waterConnectionRequest);
					repo.updateWaterConnection(waterConnectionRequest, false);
				}
			sendNotificationForPayment(paymentRequest);
		} catch (Exception ex) {
			log.error("Failed to process payment topic message. Exception: ", ex);
		}
	}

	/**
	 *
	 * @param uuid
	 * @param requestInfo
	 * @return User
	 */
	private User fetchUser(String uuid, RequestInfo requestInfo) {
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		List<String> uuids = Arrays.asList(uuid);
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("uuid", uuids);
		Object response = serviceRequestRepository.fetchResult(uri, userSearchRequest);
		List<Object> users = new ArrayList<>();
		try {
			log.info("user info response" + mapper.writeValueAsString(response));
			DocumentContext context = JsonPath.parse(mapper.writeValueAsString(response));
			users = context.read("$.user");
		} catch (JsonProcessingException e) {
			log.error("error occured while parsing user info", e);
		}
		if (CollectionUtils.isEmpty(users)) {
			throw new CustomException("INVALID_SEARCH_ON_USER",
					"No user found on given criteria!!!");
		}
		return mapper.convertValue(users.get(0), User.class);
	}

	/**
	 *
	 * @param paymentRequest
	 */
	public void sendNotificationForPayment(PaymentRequest paymentRequest) {
		try {
			log.info("Payment Notification consumer :");
			boolean isServiceMatched = false;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				String businessservice = paymentDetail.getBusinessService();
				if (WCConstants.WATER_SERVICE_BUSINESS_ID.equals(businessservice) || WATER_SERVICE_ONE_TIME_FEE_BUSINESS_ID.equals(businessservice)) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service : {}", paymentDetail.getBusinessService());
				if (WCConstants.WATER_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService()) ||
						config.getReceiptBusinessservice().equals(paymentDetail.getBusinessService())) {
					SearchCriteria criteria = new SearchCriteria();
					if (WCConstants.WATER_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.connectionNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet())).build();
					} else {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.applicationNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet())).build();
					}
					criteria.setIsInternalCall(Boolean.TRUE);
					List<WaterConnection> waterConnections = waterService.search(criteria,
							paymentRequest.getRequestInfo());
					if (CollectionUtils.isEmpty(waterConnections)) {
						throw new CustomException("INVALID_RECEIPT",
								"No waterConnection found for the consumerCode " + paymentDetail.getBill().getConsumerCode());
					}
					Collections.sort(waterConnections, Comparator.comparing(wc -> wc.getAuditDetails().getLastModifiedTime()));
					long count = waterConnections.stream().count();
					Optional<WaterConnection> connections = Optional.of(waterConnections.stream().skip(count - 1).findFirst().get());
					WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
							.waterConnection(connections.get()).requestInfo(paymentRequest.getRequestInfo())
							.build();
					sendPaymentNotification(waterConnectionRequest, paymentDetail);
				}
			}
		} catch (Exception ex) {
			log.error("Failed to process payment topic message. Exception: ", ex);
		}
	}

	/**
	 *
	 * @param waterConnectionRequest
	 */
	public void sendPaymentNotification(WaterConnectionRequest waterConnectionRequest, PaymentDetail paymentDetail) {
		User userInfoCopy = waterConnectionRequest.getRequestInfo().getUserInfo();
		User userInfo = notificationUtil.getInternalMicroserviceUser(waterConnectionRequest.getWaterConnection().getTenantId());
		waterConnectionRequest.getRequestInfo().setUserInfo(userInfo);

		Property property = validateProperty.getOrValidateProperty(waterConnectionRequest);

		waterConnectionRequest.getRequestInfo().setUserInfo(userInfoCopy);
		List<String> configuredChannelNames =  notificationUtil.fetchChannelList(waterConnectionRequest.getRequestInfo(), waterConnectionRequest.getWaterConnection().getTenantId(), WATER_SERVICE_BUSINESS_ID, waterConnectionRequest.getWaterConnection().getProcessInstance().getAction());

		if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
			if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEventRequest(waterConnectionRequest, property, paymentDetail);
				if (eventRequest != null) {
					notificationUtil.sendEventNotification(eventRequest);
				}
			}
		}
		if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(waterConnectionRequest, property, paymentDetail);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
			if (config.getIsEmailNotificationEnabled() != null && config.getIsEmailNotificationEnabled()) {
				List<EmailRequest> emailRequests = getEmailRequest(waterConnectionRequest, property, paymentDetail);
				if (!CollectionUtils.isEmpty(emailRequests)) {
					notificationUtil.sendEmail(emailRequests);
				}
			}
		}
	}
	/**
	 *
	 * @param request
	 * @param property
	 * @return
	 */
	private EventRequest getEventRequest(WaterConnectionRequest request, Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;

		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), request.getRequestInfo());

		String applicationStatus = request.getWaterConnection().getApplicationStatus();
		String notificationTemplate = WCConstants.PAYMENT_NOTIFICATION_APP;
		ProcessInstance workflow = request.getWaterConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(WCConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && waterServiceUtil.isDisconnectConnectionRequest(request)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForInAppForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + WCConstants.PAYMENT_NOTIFICATION_APP);
			return null;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();

		Set<String> ownersMobileNumbers = new HashSet<>();

		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				ownersMobileNumbers.add(owner.getMobileNumber());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(request.getWaterConnection().getConnectionHolders())) {
			request.getWaterConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					ownersMobileNumbers.add(holder.getMobileNumber());
				}
			});
		}

		for(String mobileNumber:ownersMobileNumbers) {
			UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUsername(mobileNumber, request.getRequestInfo(), request.getWaterConnection().getTenantId());
			if(!CollectionUtils.isEmpty(userDetailResponse.getUser()))
			{
				OwnerInfo user = userDetailResponse.getUser().get(0);
				mobileNumbersAndNames.put(user.getMobileNumber(),user.getName());
				mapOfPhnoAndUUIDs.put(user.getMobileNumber(),user.getUuid());
			}
			else
			{	log.info("No User for mobile {} skipping event", mobileNumber);}

		}

		//Send the notification to applicant
		if(!org.apache.commons.lang.StringUtils.isEmpty(request.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(request.getRequestInfo().getUserInfo().getMobileNumber(), request.getRequestInfo().getUserInfo().getName());
			mapOfPhnoAndUUIDs.put(request.getRequestInfo().getUserInfo().getMobileNumber(), request.getRequestInfo().getUserInfo().getUuid());
		}
		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames, request,
				message, property);
		Map<String, String> mobileNumberAndMesssage = replacePaymentInfo(getReplacedMessage, paymentDetail);
		Set<String> mobileNumbers = mobileNumberAndMesssage.keySet().stream().collect(Collectors.toSet());
		if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}
		List<Event> events = new ArrayList<>();
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberAndMesssage.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			Action action = workflowNotificationService.getActionForEventNotification(mobileNumberAndMesssage, mobile, request, property);
			events.add(Event.builder().tenantId(property.getTenantId())
					.description(mobileNumberAndMesssage.get(mobile)).eventType(WCConstants.USREVENTS_EVENT_TYPE)
					.name(WCConstants.USREVENTS_EVENT_NAME).postedBy(WCConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP).recepient(recepient).eventDetails(null).actions(action).build());
		}
		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
		} else {
			return null;
		}
	}

	/**
	 *
	 * @param waterConnectionRequest
	 * @param property
	 * @return
	 */
	private List<SMSRequest> getSmsRequest(WaterConnectionRequest waterConnectionRequest,
										   Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;

		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				waterConnectionRequest.getRequestInfo());

		String applicationStatus = waterConnectionRequest.getWaterConnection().getApplicationStatus();
		String notificationTemplate = WCConstants.PAYMENT_NOTIFICATION_SMS;
		ProcessInstance workflow = waterConnectionRequest.getWaterConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(WCConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && waterServiceUtil.isDisconnectConnectionRequest(waterConnectionRequest)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForSMSForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + WCConstants.PAYMENT_NOTIFICATION_SMS);
			return Collections.emptyList();
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
			waterConnectionRequest.getWaterConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}

		//Send the notification to applicant
		if(!org.apache.commons.lang.StringUtils.isEmpty(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), waterConnectionRequest.getRequestInfo().getUserInfo().getName());
		}

		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames,
				waterConnectionRequest, message, property);
		Map<String, String> mobileNumberAndMessage = replacePaymentInfo(getReplacedMessage, paymentDetail);
		List<SMSRequest> smsRequest = new ArrayList<>();
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}


	/**
	 * Creates email request for each owner
	 *
	 * @param waterConnectionRequest Water Connection Request
	 * @param property Property Object
	 * @param paymentDetail Payment Detail Object
	 * @return List of EmailRequest
	 */
	private List<EmailRequest> getEmailRequest(WaterConnectionRequest waterConnectionRequest,
											   Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;

		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				waterConnectionRequest.getRequestInfo());

		String applicationStatus = waterConnectionRequest.getWaterConnection().getApplicationStatus();
		String notificationTemplate = PAYMENT_NOTIFICATION_EMAIL;
		ProcessInstance workflow = waterConnectionRequest.getWaterConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(WCConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && waterServiceUtil.isDisconnectConnectionRequest(waterConnectionRequest)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForEmailForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + WCConstants.PAYMENT_NOTIFICATION_EMAIL);
			return Collections.emptyList();
		}

		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		Set<String> mobileNumbers = new HashSet<>();

		//Send the notification to all owners
		Set<String> ownersUuids = new HashSet<>();

		property.getOwners().forEach(owner -> {
			if (owner.getUuid() != null)
				ownersUuids.add(owner.getUuid());
		});

		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
			waterConnectionRequest.getWaterConnection().getConnectionHolders().forEach(holder -> {
				if (!org.apache.commons.lang.StringUtils.isEmpty(holder.getUuid())) {
					ownersUuids.add(holder.getUuid());
				}
			});
		}

		UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUUID(ownersUuids, waterConnectionRequest.getRequestInfo(), waterConnectionRequest.getWaterConnection().getTenantId());
		for (OwnerInfo user : userDetailResponse.getUser()) {
			mobileNumbersAndNames.put(user.getMobileNumber(), user.getName());
		}

		mobileNumbers.addAll(mobileNumbersAndNames.keySet());

		Map<String, String> mobileNumberAndEmailId = new HashMap<>();
		for (OwnerInfo user : userDetailResponse.getUser()) {
			mobileNumberAndEmailId.put(user.getMobileNumber(), user.getEmailId());
		}

		//Send the notification to applicant
		if (!StringUtils.isEmpty(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber())) {
			mobileNumbersAndNames.put(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), waterConnectionRequest.getRequestInfo().getUserInfo().getName());
			mobileNumbers.add(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber());
			mobileNumberAndEmailId.put(waterConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), waterConnectionRequest.getRequestInfo().getUserInfo().getEmailId());
		}

		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames,
				waterConnectionRequest, message, property);

		Map<String, String> mobileNumberAndMessage =replacePaymentInfo(getReplacedMessage, paymentDetail);
		List<EmailRequest> emailRequest = new LinkedList<>();
		for (Map.Entry<String, String> entryset : mobileNumberAndEmailId.entrySet()) {
			String customizedMsg = mobileNumberAndMessage.get(entryset.getKey());
			String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
			String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
			Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
			EmailRequest email = new EmailRequest(waterConnectionRequest.getRequestInfo(),emailobj);
			emailRequest.add(email);
		}
		return emailRequest;

	}

	/**
	 *
	 * @param mobileAndMessage
	 * @param paymentDetail
	 * @return replaced message
	 */
	private Map<String, String> replacePaymentInfo(Map<String, String> mobileAndMessage, PaymentDetail paymentDetail) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Map.Entry<String, String> mobAndMesg : mobileAndMessage.entrySet()) {
			String message = mobAndMesg.getValue();
			if (message.contains("{Amount paid}")) {
				message = message.replace("{Amount paid}", paymentDetail.getTotalAmountPaid().toString());
			}
			if (message.contains("{Billing Period}")) {
				int fromDateLength = (int) (Math.log10(paymentDetail.getBill().getBillDetails().get(0).getFromPeriod()) + 1);
				LocalDate fromDate = Instant
						.ofEpochMilli(fromDateLength > 10 ? paymentDetail.getBill().getBillDetails().get(0).getFromPeriod() :
								paymentDetail.getBill().getBillDetails().get(0).getFromPeriod() * 1000)
						.atZone(ZoneId.systemDefault()).toLocalDate();
				int toDateLength = (int) (Math.log10(paymentDetail.getBill().getBillDetails().get(0).getToPeriod()) + 1);
				LocalDate toDate = Instant
						.ofEpochMilli(toDateLength > 10 ? paymentDetail.getBill().getBillDetails().get(0).getToPeriod() :
								paymentDetail.getBill().getBillDetails().get(0).getToPeriod() * 1000)
						.atZone(ZoneId.systemDefault()).toLocalDate();
				StringBuilder builder = new StringBuilder();
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
				String billingPeriod = builder.append(fromDate.format(formatter)).append(" - ").append(toDate.format(formatter)).toString();
				message = message.replace("{Billing Period}", billingPeriod);
			}

			if (message.contains("{receipt download link}")){
				String link = config.getNotificationUrl() + config.getMyPaymentsLink();
				link = link.replace("$consumerCode", paymentDetail.getBill().getConsumerCode());
				link = link.replace("$tenantId", paymentDetail.getTenantId());
				link = link.replace("$businessService",paymentDetail.getBusinessService());
				link = link.replace("$receiptNumber",paymentDetail.getReceiptNumber());
				link = link.replace("$mobile", mobAndMesg.getKey());
				link = waterServiceUtil.getShortnerURL(link);
				message = message.replace("{receipt download link}",link);
			}

			messageToReturn.put(mobAndMesg.getKey(), message);
		}
		return messageToReturn;
	}

	public void noPaymentWorkflow(WaterConnectionRequest request, Property property, RequestInfo requestInfo) {
		//Updating the workflow from approve for disconnection to pending for disconnection execution when there are no dues
		WaterConnection waterRequest = request.getWaterConnection();
		SearchCriteria criteria = new SearchCriteria();
		criteria = SearchCriteria.builder()
				.tenantId(waterRequest.getTenantId())
				.connectionNumber(Stream.of(waterRequest.getConnectionNo().toString()).collect(Collectors.toSet()))
				.applicationStatus(Collections.singleton(PENDING_FOR_PAYMENT_STATUS_CODE)).build();
		List<WaterConnection> waterConnections = waterService.search(criteria,
				requestInfo);
		waterConnections.forEach(waterConnection -> waterConnection.getProcessInstance().setAction((WCConstants.ACTION_PAY)));
		Optional<WaterConnection> connections = waterConnections.stream().findFirst();
		WaterConnection connection = connections.get();
		WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
				.waterConnection(connection).requestInfo(requestInfo)
				.build();
		ProcessInstance processInstanceReq = waterConnectionRequest.getWaterConnection().getProcessInstance();
		processInstanceReq.setComment(WORKFLOW_NO_PAYMENT_CODE + " : " +WORKFLOW_NODUE_COMMENT);
		// Enrich tenantId in userInfo for workflow call
		Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(property.getTenantId()).build();
		Role counterEmployeeRole = Role.builder().name(COUNTER_EMPLOYEE_ROLE_NAME).code(COUNTER_EMPLOYEE_ROLE_CODE).tenantId(property.getTenantId()).build();
		requestInfo.getUserInfo().getRoles().add(role);
		requestInfo.getUserInfo().getRoles().add(counterEmployeeRole);
		//move the workflow
		wfIntegrator.callWorkFlow(waterConnectionRequest, property);
		enrichmentService.enrichFileStoreIds(waterConnectionRequest);
		repo.updateWaterConnection(waterConnectionRequest, false);
	}
}
