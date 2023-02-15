package org.egov.swservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.collection.PaymentDetail;
import org.egov.swservice.web.models.collection.PaymentRequest;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.workflow.WorkflowIntegrator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.egov.swservice.util.SWConstants.*;

@Slf4j
@Service
public class PaymentUpdateService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private SewerageServiceImpl sewerageService;

	@Autowired
	private WorkflowIntegrator wfIntegrator;

	@Autowired
	private SewerageDao repo;

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
	private SewerageServicesUtil sewerageServicesUtil;

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
				if (paymentDetail.getBusinessService().equalsIgnoreCase(config.getReceiptBusinessservice()) ||
						SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			paymentRequest.getRequestInfo().setUserInfo(fetchUser(
					paymentRequest.getRequestInfo().getUserInfo().getUuid(), paymentRequest.getRequestInfo()));
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service: {}", paymentDetail.getBusinessService());
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
					List<SewerageConnection> sewerageConnections = sewerageService.search(criteria,
							paymentRequest.getRequestInfo());
					if (CollectionUtils.isEmpty(sewerageConnections)) {
						throw new CustomException("INVALID_RECEIPT",
								"No sewerageConnection found for the consumerCode " + criteria.getApplicationNumber());
					}
					Optional<SewerageConnection> connections = sewerageConnections.stream().findFirst();
					SewerageConnection connection = connections.get();
					if (sewerageConnections.size() > 1) {
						throw new CustomException("INVALID_RECEIPT",
								"More than one application found on consumerCode " + criteria.getApplicationNumber());
					}
					sewerageConnections
							.forEach(sewerageConnection -> sewerageConnection.getProcessInstance().setAction(SWConstants.ACTION_PAY));
					SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
							.sewerageConnection(connection).requestInfo(paymentRequest.getRequestInfo())
							.build();

					Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
					// Enrich tenantId in userInfo for workflow call
					RequestInfo requestInfo = sewerageConnectionRequest.getRequestInfo();
					Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(property.getTenantId()).build();
					requestInfo.getUserInfo().getRoles().add(role);
					wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
					enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
					repo.updateSewerageConnection(sewerageConnectionRequest, false);
			}
			sendNotificationForPayment(paymentRequest);
		} catch (Exception ex) {
			log.error("Failed to process Payment Update message.", ex);
		}
	}

	/**
	 *
	 * @param uuid - UUID for the User
	 * @param requestInfo - RequestInfo Object
	 * @return User
	 */
	private User fetchUser(String uuid, RequestInfo requestInfo) {
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		List<String> uuidList = Arrays.asList(uuid);
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("uuid", uuidList);
		Object response = serviceRequestRepository.fetchResult(uri, userSearchRequest);
		List<Object> users = new ArrayList<>();
		try {
			DocumentContext context = JsonPath.parse(mapper.writeValueAsString(response));
			users = context.read("$.user");
		} catch (JsonProcessingException e) {
			log.error("error occurred while parsing user info", e);
		}
		if (CollectionUtils.isEmpty(users)) {
			throw new CustomException("INVALID_SEARCH_ON_USER", "No user found on given criteria!!!");
		}
		return mapper.convertValue(users.get(0), User.class);
	}

	/**
	 * consume payment request for processing the notification of payment
	 * @param paymentRequest
	 */
	public void sendNotificationForPayment(PaymentRequest paymentRequest) {
		try {
			log.info("Payment Notification consumer :");
			boolean isServiceMatched = false;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
                String businessservice = paymentDetail.getBusinessService();
                if (SEWERAGE_SERVICE_BUSINESS_ID.equals(businessservice) || SEWERAGE_SERVICE_ONE_TIME_FEE_BUSINESS_ID.equals(businessservice)) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service : {}", paymentDetail.getBusinessService());
				if (SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService()) ||
						config.getReceiptBusinessservice().equals(paymentDetail.getBusinessService())) {
					SearchCriteria criteria = new SearchCriteria();
					if (SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.connectionNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet())).build();
					} else {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.applicationNumber(Stream.of(paymentDetail.getBill().getConsumerCode().toString()).collect(Collectors.toSet())).build();
					}
					criteria.setIsInternalCall(Boolean.TRUE);
					List<SewerageConnection> sewerageConnections = sewerageService.search(criteria,
							paymentRequest.getRequestInfo());
					if (CollectionUtils.isEmpty(sewerageConnections)) {
						throw new CustomException("INVALID_RECEIPT",
								"No sewerageConnection found for the consumerCode " + paymentDetail.getBill().getConsumerCode());
					}
					Collections.sort(sewerageConnections, Comparator.comparing(wc -> wc.getAuditDetails().getLastModifiedTime()));
					long count = sewerageConnections.stream().count();
					Optional<SewerageConnection> connections = Optional.of(sewerageConnections.stream().skip(count - 1).findFirst().get());
					SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
							.sewerageConnection(connections.get()).requestInfo(paymentRequest.getRequestInfo())
							.build();
					sendPaymentNotification(sewerageConnectionRequest, paymentDetail);
				}
			}
		} catch (Exception ex) {
			log.error("Failed to process payment topic message. Exception: ", ex);
		}
	}

	/**
	 *
	 * @param sewerageConnectionRequest
	 * @param paymentDetail
	 */
	public void sendPaymentNotification(SewerageConnectionRequest sewerageConnectionRequest, PaymentDetail paymentDetail) {
		User userInfoCopy = sewerageConnectionRequest.getRequestInfo().getUserInfo();
		User userInfo = notificationUtil.getInternalMicroserviceUser(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		sewerageConnectionRequest.getRequestInfo().setUserInfo(userInfo);
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		sewerageConnectionRequest.getRequestInfo().setUserInfo(userInfoCopy);

		List<String> configuredChannelNames =  notificationUtil.fetchChannelList(sewerageConnectionRequest.getRequestInfo(), sewerageConnectionRequest.getSewerageConnection().getTenantId(), SEWERAGE_SERVICE_BUSINESS_ID, sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction());

		if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
			if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEventRequest(sewerageConnectionRequest, property, paymentDetail);
				if (eventRequest != null) {
					notificationUtil.sendEventNotification(eventRequest);
				}
			}
		}
		if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
			if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
				List<SMSRequest> smsRequests = getSmsRequest(sewerageConnectionRequest, property, paymentDetail);
				if (!CollectionUtils.isEmpty(smsRequests)) {
					notificationUtil.sendSMS(smsRequests);
				}
			}
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
			if (config.getIsEmailNotificationEnabled() != null && config.getIsEmailNotificationEnabled()) {
				List<EmailRequest> emailRequests = getEmailRequest(sewerageConnectionRequest, property, paymentDetail);
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
	private EventRequest getEventRequest(SewerageConnectionRequest request, Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;

		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), request.getRequestInfo());

		String applicationStatus = request.getSewerageConnection().getApplicationStatus();
		String notificationTemplate = SWConstants.PAYMENT_NOTIFICATION_APP;
		ProcessInstance workflow = request.getSewerageConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && sewerageServicesUtil.isDisconnectConnectionRequest(request)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForInAppForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + SWConstants.PAYMENT_NOTIFICATION_APP);
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
		if (!CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders())) {
			request.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					ownersMobileNumbers.add(holder.getMobileNumber());
				}
			});
		}

		for(String mobileNumber:ownersMobileNumbers) {
			UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUsername(mobileNumber, request.getRequestInfo(), request.getSewerageConnection().getTenantId());
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
					.description(mobileNumberAndMesssage.get(mobile)).eventType(SWConstants.USREVENTS_EVENT_TYPE)
					.name(SWConstants.USREVENTS_EVENT_NAME).postedBy(SWConstants.USREVENTS_EVENT_POSTEDBY)
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
	 * @param sewerageConnectionRequest
	 * @param property
	 * @param paymentDetail
	 * @return
	 */
	private List<SMSRequest> getSmsRequest(SewerageConnectionRequest sewerageConnectionRequest,
										   Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;

		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				sewerageConnectionRequest.getRequestInfo());

		String applicationStatus = sewerageConnectionRequest.getSewerageConnection().getApplicationStatus();
		String notificationTemplate = SWConstants.PAYMENT_NOTIFICATION_APP;
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && sewerageServicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForSMSForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + SWConstants.PAYMENT_NOTIFICATION_SMS);
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
		if(!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber()))
		{
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
		}

		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);
		Map<String, String> mobileNumberAndMessage = replacePaymentInfo(getReplacedMessage, paymentDetail);
		List<SMSRequest> smsRequest = new ArrayList<>();
		mobileNumberAndMessage.forEach((mobileNumber, msg) -> {
			SMSRequest req = SMSRequest.builder().mobileNumber(mobileNumber).message(msg).category(org.egov.swservice.web.models.Category.TRANSACTION).build();
			smsRequest.add(req);
		});
		return smsRequest;
	}

	/**
	 * Creates email request for each owner
	 *
	 * @param sewerageConnectionRequest Sewerage Connection Request
	 * @param property Property Object
	 * @param paymentDetail Payment Detail Object
	 * @return List of EmailRequest
	 */
	private List<EmailRequest> getEmailRequest(SewerageConnectionRequest sewerageConnectionRequest,
											   Property property, PaymentDetail paymentDetail) {

		if(paymentDetail.getTotalAmountPaid().intValue() == 0)
			return null;
		
		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				sewerageConnectionRequest.getRequestInfo());

		String applicationStatus = sewerageConnectionRequest.getSewerageConnection().getApplicationStatus();
		String notificationTemplate = PAYMENT_NOTIFICATION_EMAIL;
		ProcessInstance workflow = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();
		StringBuilder builder = new StringBuilder();
		int reqType;

		//Condition to assign Disconnection application Payment Notification code
		if ((!workflow.getAction().equalsIgnoreCase(SWConstants.ACTIVATE_CONNECTION)) &&
				(!workflow.getAction().equalsIgnoreCase(APPROVE_CONNECTION)) && sewerageServicesUtil.isDisconnectConnectionRequest(sewerageConnectionRequest)) {
			reqType = DISCONNECT_CONNECTION;
			notificationTemplate = notificationUtil.getCustomizedMsgForEmailForPayment(workflow.getAction(), applicationStatus, reqType);
		}

		String message = notificationUtil.getMessageTemplate(notificationTemplate, localizationMessage);

		if (message == null) {
			log.info("No message template found for, {} " + SWConstants.PAYMENT_NOTIFICATION_EMAIL);
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
		if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
			sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!org.apache.commons.lang.StringUtils.isEmpty(holder.getUuid())) {
					ownersUuids.add(holder.getUuid());
				}
			});
		}

		UserDetailResponse userDetailResponse = workflowNotificationService.fetchUserByUUID(ownersUuids, sewerageConnectionRequest.getRequestInfo(), sewerageConnectionRequest.getSewerageConnection().getTenantId());
		for (OwnerInfo user : userDetailResponse.getUser()) {
			mobileNumbersAndNames.put(user.getMobileNumber(), user.getName());
		}

		mobileNumbers.addAll(mobileNumbersAndNames.keySet());

		Map<String, String> mobileNumberAndEmailId = new HashMap<>();
		for (OwnerInfo user : userDetailResponse.getUser()) {
			mobileNumberAndEmailId.put(user.getMobileNumber(), user.getEmailId());
		}

		//Send the notification to applicant
		if (!StringUtils.isEmpty(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber())) {
			mobileNumbersAndNames.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getName());
			mobileNumbers.add(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber());
			mobileNumberAndEmailId.put(sewerageConnectionRequest.getRequestInfo().getUserInfo().getMobileNumber(), sewerageConnectionRequest.getRequestInfo().getUserInfo().getEmailId());
		}

		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames,
				sewerageConnectionRequest, message, property);

		Map<String, String> mobileNumberAndMessage = replacePaymentInfo(getReplacedMessage, paymentDetail);
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
				link = sewerageServicesUtil.getShortenedURL(link);
				message = message.replace("{receipt download link}",link);
			}
			messageToReturn.put(mobAndMesg.getKey(), message);
		}
		return messageToReturn;
	}

	public void noPaymentWorkflow(SewerageConnectionRequest request, Property property, RequestInfo requestInfo) {
		//Updating the workflow from approve for disconnection to pending for disconnection execution when there are no dues
		SearchCriteria criteria = new SearchCriteria();
		SewerageConnection sewerageRequest = request.getSewerageConnection();
		criteria = SearchCriteria.builder()
				.tenantId(sewerageRequest.getTenantId())
				.connectionNumber(Stream.of(sewerageRequest.getConnectionNo().toString()).collect(Collectors.toSet()))
				.applicationStatus(Collections.singleton(PENDING_FOR_PAYMENT_STATUS_CODE)).build();
		List<SewerageConnection> sewerageConnections = sewerageService.search(criteria,
				requestInfo);
		sewerageConnections.forEach(sewerageConnection -> sewerageConnection.getProcessInstance().setAction((SWConstants.ACTION_PAY)));
		Optional<SewerageConnection> connections = sewerageConnections.stream().findFirst();
		SewerageConnection connection = connections.get();
		SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
				.sewerageConnection(connection).requestInfo(requestInfo)
				.build();
		ProcessInstance processInstanceReq = sewerageConnectionRequest.getSewerageConnection().getProcessInstance();
		processInstanceReq.setComment(WORKFLOW_NO_PAYMENT_CODE + " : " +WORKFLOW_NODUE_COMMENT);
		// Enrich tenantId in userInfo for workflow call
		Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(property.getTenantId()).build();
		Role counterEmployeeRole = Role.builder().name(COUNTER_EMPLOYEE_ROLE_NAME).code(COUNTER_EMPLOYEE_ROLE_CODE).tenantId(property.getTenantId()).build();
		requestInfo.getUserInfo().getRoles().add(role);
		requestInfo.getUserInfo().getRoles().add(counterEmployeeRole);
		//move the workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
		enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
		repo.updateSewerageConnection(sewerageConnectionRequest, false);
	}
}
