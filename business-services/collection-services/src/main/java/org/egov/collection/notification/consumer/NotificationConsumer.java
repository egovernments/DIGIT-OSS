package org.egov.collection.notification.consumer;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.web.contract.Bill;
//import org.egov.collection.web.contract.Receipt;
//import org.egov.collection.web.contract.ReceiptReq;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;

@Service
@Slf4j
@Data
/**
 * Methods with different responsibilites are written in the same class because we're not sure on where this consumer has to go.
 * Ideally, we will have one consumer that handles notifications on every payment belonging to all the modules. 
 * The reason for having all methods in the same class is to make it easy for migration when the common-consumer design is finalized.
 *
 *
 * @author vishal
 *
 */
public class NotificationConsumer {
	
	@Autowired
	private MultiStateInstanceUtil multiStateInstanceUtil;

	@Value("${coll.notification.ui.host}")
	private String uiHost;

	@Value("${coll.notification.ui.redirect.url}")
	private String uiRedirectUrl;


	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsUrl;

	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.search.endpoint}")
	private String localizationEndpoint;

	@Value("${coll.notification.fallback.locale}")
	private String fallBackLocale;

	@Value("${kafka.topics.notification.sms}")
	private String smsTopic;

	@Value("${kafka.topics.notification.sms.key}")
	private String smsTopickey;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CollectionProducer producer;

	@Autowired
	private RestTemplate restTemplate;

	private static final String COLLECTION_LOCALIZATION_MODULE = "collection-services";
	public static final String PAYMENT_MSG_LOCALIZATION_CODE = "coll.notif.payment.receipt.link";
	private static final String BUSINESSSERVICE_LOCALIZATION_MODULE = "rainmaker-uc";
	public static final String BUSINESSSERVICELOCALIZATION_CODE_PREFIX = "BILLINGSERVICE_BUSINESSSERVICE_";
	public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
	public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";

	private static final String BUSINESSSERVICE_MDMS_MODULE = "BillingService";
	public static final String BUSINESSSERVICE_MDMS_MASTER = "BusinessService";
	public static final String BUSINESSSERVICE_CODES_FILTER = "$.[?(@.type=='Adhoc')].code";
	public static final String BUSINESSSERVICE_CODES_JSONPATH = "$.MdmsRes.BillingService.BusinessService";



	/*
	 * Kafka consumer
	 *
	 * @param record
	 * @param topic
	 */
	//@KafkaListener(topics = { "${kafka.topics.payment.receiptlink.name}" })
	public void listen(HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			PaymentRequest req = objectMapper.convertValue(record, PaymentRequest.class);
			sendNotification(req);
		}catch(Exception e) {
			log.error("Exception while reading from the queue: ", e);
		}
	}

	/*
	 * Method to send notifications.
	 *
	 * @param receiptReq
	 * @throws Exception
	 */
	private void sendNotification(PaymentRequest receiptReq){
		Payment receipt = receiptReq.getPayment();
		List<String> businessServiceAllowed = fetchBusinessServiceFromMDMS(receiptReq.getRequestInfo(), receiptReq.getPayment().getTenantId());
		if(!CollectionUtils.isEmpty(businessServiceAllowed)) {
			for(PaymentDetail detail: receipt.getPaymentDetails()) {
				Bill bill = detail.getBill();
				if (businessServiceAllowed.contains(detail.getBusinessService())) {
					String phNo = bill.getMobileNumber();
					String message = buildSmsBody(bill, detail, receiptReq.getRequestInfo());
					if (!StringUtils.isEmpty(message)) {
						Map<String, Object> request = new HashMap<>();
						request.put("mobileNumber", phNo);
						request.put("message", message);

						producer.push(receipt.getTenantId(), smsTopic, request);
					} else {
						log.error("No message configured! Notification will not be sent.");
					}
				} else {
					log.info("Notification not configured for this business service!");
				}
			}

		}else {
			log.info("Business services to which notifs are to be sent, couldn't be retrieved! Notification will not be sent.");
		}
	}


	/*
	 * Prepares sms body based on the configuration
	 *
	 * @param instrument
	 * @param bill
	 * @param billDetail
	 * @param requestInfo
	 * @return
	 */
	private String buildSmsBody(Bill bill, PaymentDetail paymentdetail, RequestInfo requestInfo) {
		String content = fetchContentFromLocalization(requestInfo, paymentdetail.getTenantId(), COLLECTION_LOCALIZATION_MODULE, PAYMENT_MSG_LOCALIZATION_CODE);
		String message = null;
		if(!StringUtils.isEmpty(content)) {
			StringBuilder link = new StringBuilder();
			link.append(uiHost + "/citizen").append("/otpLogin?mobileNo=").append(bill.getMobileNumber()).append("&redirectTo=")
					.append(uiRedirectUrl).append("&params=").append(paymentdetail.getTenantId() + "," + paymentdetail.getReceiptNumber());

			content = content.replaceAll("{rcpt_link}", link.toString());
			String taxName = fetchContentFromLocalization(requestInfo, paymentdetail.getTenantId(),
					BUSINESSSERVICE_LOCALIZATION_MODULE, formatCodes(paymentdetail.getBusinessService()));
			if(StringUtils.isEmpty(taxName))
				taxName = "Adhoc Tax";
			content = content.replaceAll("{tax_name}", taxName);
			content = content.replaceAll("{fin_year}", fetchFinYear(bill.getBillDetails().get(0).getFromPeriod(), bill.getBillDetails().get(0).getToPeriod()));
			content = content.replaceAll("{rcpt_no}",  paymentdetail.getReceiptNumber());
			content = content.replaceAll("{amount_paid}", bill.getAmountPaid().toString());

			message = content;
		}
		return message;
	}

	/*
	 * Generic method to fetch data from localization.
	 *
	 * @param requestInfo
	 * @param tenantId
	 * @param module
	 * @param code
	 * @return
	 */
	private String fetchContentFromLocalization(RequestInfo requestInfo, String tenantId, String module, String code) {
		String message = null;
		List<String> codes = new ArrayList<>();
		List<String> messages = new ArrayList<>();
		Object result = null;
		String locale = requestInfo.getMsgId().split("[|]")[1]; // Conventionally locale is sent in the first index of msgid split by |
		if(StringUtils.isEmpty(locale))
			locale = fallBackLocale;
		StringBuilder uri = new StringBuilder();
		uri.append(localizationHost).append(localizationEndpoint);
		uri.append("?tenantId=").append(multiStateInstanceUtil.getStateLevelTenant(tenantId))
		.append("&locale=").append(locale).append("&module=").append(module);
		
		Map<String, Object> request = new HashMap<>();
		request.put("RequestInfo", requestInfo);
		try {
			result = restTemplate.postForObject(uri.toString(), request, Map.class);
			codes = JsonPath.read(result, LOCALIZATION_CODES_JSONPATH);
			messages = JsonPath.read(result, LOCALIZATION_MSGS_JSONPATH);
		} catch (Exception e) {
			log.error("Exception while fetching from localization: " + e);
		}
		if (null != result) {
			for (int i = 0; i < codes.size(); i++) {
				if(codes.get(i).equals(code)) message = messages.get(i);
			}
		}
		return message;
	}


	/*
	 * Method to fetch business service from MDMS
	 *
	 * @param requestInfo
	 * @return
	 */
	private List<String> fetchBusinessServiceFromMDMS(RequestInfo requestInfo, String tenantId){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsUrl);
		if(StringUtils.isEmpty(tenantId))
			return masterData;
		MdmsCriteriaReq request = getRequestForEvents(requestInfo, multiStateInstanceUtil.getStateLevelTenant(tenantId));
		try {
			Object response = restTemplate.postForObject(uri.toString(), request, Map.class);
			masterData = JsonPath.read(response, BUSINESSSERVICE_CODES_JSONPATH);
		}catch(Exception e) {
			log.error("Exception while fetching business service codes: ",e);
		}
		return masterData;
	}

	/**
	 * Util method to build MDMS request to search businessservices
	 *
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	private MdmsCriteriaReq getRequestForEvents(RequestInfo requestInfo, String tenantId) {
		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder()
				.name(BUSINESSSERVICE_MDMS_MASTER).filter(BUSINESSSERVICE_CODES_FILTER).build();
		List<MasterDetail> masterDetails = new ArrayList<>();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(BUSINESSSERVICE_MDMS_MODULE)
				.masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}


	/**
	 * Method to fetch year format from from and to period of the bill
	 *
	 * @param fromPeriod
	 * @param toPeriod
	 * @return
	 */
	private String fetchFinYear(Long fromPeriod, Long toPeriod) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(fromPeriod);
		int fromYear = calendar.get(Calendar.YEAR);
		calendar.setTimeInMillis(toPeriod);
		int toYear = calendar.get(Calendar.YEAR);
		if((toYear - fromYear) == 0)
			return toYear + "";
		return fromYear + "-" + (toYear % 1000);

	}

	/**
	 * Method to format the code as per localization keys
	 *
	 * @param code
	 * @return
	 */
	private String formatCodes(String code) {
		String regexForSpecialCharacters = "[$&+,:;=?@#|'<>.-^*()%!]";
		code = code.replaceAll(regexForSpecialCharacters, "_");
		code = code.replaceAll(" ", "_");

		return BUSINESSSERVICELOCALIZATION_CODE_PREFIX + code.toUpperCase();
	}


}
