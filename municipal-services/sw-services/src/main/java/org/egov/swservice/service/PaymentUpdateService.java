package org.egov.swservice.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.util.NotificationUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.Action;
import org.egov.swservice.web.models.Event;
import org.egov.swservice.web.models.EventRequest;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.Recepient;
import org.egov.swservice.web.models.SMSRequest;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.Source;
import org.egov.swservice.web.models.collection.PaymentDetail;
import org.egov.swservice.web.models.collection.PaymentRequest;
import org.egov.swservice.workflow.WorkflowIntegrator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

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
						SWConstants.SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			paymentRequest.getRequestInfo().setUserInfo(fetchUser(
					paymentRequest.getRequestInfo().getUserInfo().getUuid(), paymentRequest.getRequestInfo()));
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service: {}", paymentDetail.getBusinessService());
				if (paymentDetail.getBusinessService().equalsIgnoreCase(config.getReceiptBusinessservice())) {
					SearchCriteria criteria = SearchCriteria.builder()
							.tenantId(paymentRequest.getPayment().getTenantId())
							.applicationNumber(paymentDetail.getBill().getConsumerCode()).build();
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
					wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
					enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
					repo.updateSewerageConnection(sewerageConnectionRequest, false);
				}
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
				if (SWConstants.SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
					isServiceMatched = true;
				}
			}
			if (!isServiceMatched)
				return;
			for (PaymentDetail paymentDetail : paymentRequest.getPayment().getPaymentDetails()) {
				log.info("Consuming Business Service : {}", paymentDetail.getBusinessService());
				if (SWConstants.SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService()) ||
						config.getReceiptBusinessservice().equals(paymentDetail.getBusinessService())) {
					SearchCriteria criteria = new SearchCriteria();
					if (SWConstants.SEWERAGE_SERVICE_BUSINESS_ID.equals(paymentDetail.getBusinessService())) {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.connectionNumber(paymentDetail.getBill().getConsumerCode()).build();
					} else {
						criteria = SearchCriteria.builder()
								.tenantId(paymentRequest.getPayment().getTenantId())
								.applicationNumber(paymentDetail.getBill().getConsumerCode()).build();
					}
					List<SewerageConnection> sewerageConnections = sewerageService.search(criteria,
							paymentRequest.getRequestInfo());
					if (CollectionUtils.isEmpty(sewerageConnections)) {
						throw new CustomException("INVALID_RECEIPT",
								"No sewerageConnection found for the consumerCode " + paymentDetail.getBill().getConsumerCode());
					}
					Collections.sort(sewerageConnections, Comparator.comparing(wc -> wc.getAuditDetails().getLastModifiedTime()));
					Optional<SewerageConnection> connections = sewerageConnections.stream().findFirst();
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
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		if (config.getIsUserEventsNotificationEnabled() != null && config.getIsUserEventsNotificationEnabled()) {
			EventRequest eventRequest = getEventRequest(sewerageConnectionRequest, property, paymentDetail);
			if (eventRequest != null) {
				notificationUtil.sendEventNotification(eventRequest);
			}
		}
		if (config.getIsSMSEnabled() != null && config.getIsSMSEnabled()) {
			List<SMSRequest> smsRequests = getSmsRequest(sewerageConnectionRequest, property, paymentDetail);
			if (!CollectionUtils.isEmpty(smsRequests)) {
				notificationUtil.sendSMS(smsRequests);
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
		String localizationMessage = notificationUtil
				.getLocalizationMessages(property.getTenantId(), request.getRequestInfo());
		String message = notificationUtil.getMessageTemplate(SWConstants.PAYMENT_NOTIFICATION_APP, localizationMessage);
		if (message == null) {
			log.info("No message template found for, {} " + SWConstants.PAYMENT_NOTIFICATION_APP);
			return null;
		}
		Map<String, String> mobileNumbersAndNames = new HashMap<>();
		property.getOwners().forEach(owner -> {
			if (owner.getMobileNumber() != null)
				mobileNumbersAndNames.put(owner.getMobileNumber(), owner.getName());
		});
		//send the notification to the connection holders
		if (!CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders())) {
			request.getSewerageConnection().getConnectionHolders().forEach(holder -> {
				if (!StringUtils.isEmpty(holder.getMobileNumber())) {
					mobileNumbersAndNames.put(holder.getMobileNumber(), holder.getName());
				}
			});
		}
		Map<String, String> getReplacedMessage = workflowNotificationService.getMessageForMobileNumber(mobileNumbersAndNames, request,
				message, property);
		Map<String, String> mobileNumberAndMesssage = replacePaymentInfo(getReplacedMessage, paymentDetail);
		Set<String> mobileNumbers = mobileNumberAndMesssage.keySet().stream().collect(Collectors.toSet());
		Map<String, String> mapOfPhnoAndUUIDs = workflowNotificationService.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), property.getTenantId());
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
		String localizationMessage = notificationUtil.getLocalizationMessages(property.getTenantId(),
				sewerageConnectionRequest.getRequestInfo());
		String message = notificationUtil.getMessageTemplate(SWConstants.PAYMENT_NOTIFICATION_SMS, localizationMessage);
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
	 *
	 * @param mobileAndMessage
	 * @param paymentDetail
	 * @return replaced message
	 */
	private Map<String, String> replacePaymentInfo(Map<String, String> mobileAndMessage, PaymentDetail paymentDetail) {
		Map<String, String> messageToReturn = new HashMap<>();
		for (Map.Entry<String, String> mobAndMesg : mobileAndMessage.entrySet()) {
			String message = mobAndMesg.getValue();
			if (message.contains("<Amount paid>")) {
				message = message.replace("<Amount paid>", paymentDetail.getTotalAmountPaid().toString());
			}
			if (message.contains("<Billing Period>")) {
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
				message = message.replace("<Billing Period>", billingPeriod);
			}
			if (message.contains("<receipt download link>")){
				String link = config.getNotificationUrl() + config.getReceiptDownloadLink();
				link = link.replace("$consumerCode", paymentDetail.getBill().getConsumerCode());
				link = link.replace("$tenantId", paymentDetail.getTenantId());
				link = link.replace("$businessService",paymentDetail.getBusinessService());
				link = link.replace("$receiptNumber",paymentDetail.getReceiptNumber());
				link = link.replace("$mobile", mobAndMesg.getKey());
				link = sewerageServicesUtil.getShortenedURL(link);
				message = message.replace("<receipt download link>",link);
			}
			messageToReturn.put(mobAndMesg.getKey(), message);
		}
		return messageToReturn;
	}
}
