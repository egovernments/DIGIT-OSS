package org.egov.demand.consumer.notification;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.util.Constants;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillRequestV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationConsumer {
	
	@Autowired
	private MultiStateInstanceUtil centralUtil;

	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.search.endpoint}")
	private String localizationEndpoint;
	
	@Value("${bill.notification.fallback.locale}")
	private String fallBackLocale;
	
	@Value("${kafka.topics.notification.sms}")
	private String smsTopic;

	@Value("${kafka.topics.cancel.bill.topic.name}")
	private String billCancelTopic;
	
	@Value("${kafka.topics.notification.sms.key}")
	private String smsTopickey;
	
    @Autowired
    private ObjectMapper objectMapper;
		
	@Autowired
	private KafkaTemplate<String, Object> producer;
	
	@Autowired
	private RestTemplate restTemplate;
	
    private static final String BILLING_LOCALIZATION_MODULE = "billing-services";
	public static final String PAYMENT_MSG_LOCALIZATION_CODE = "BILLINGSERVICE_BUSINESSSERVICE_BILL_GEN_NOTIF_MSG";
	public static final String BILL_CANCELLATION_MSG_LOCALIZATION_CODE = "BILLINGSERVICE_BILL_CANCELLATION_NOTIF_MSG";
	public static final String BUSINESSSERVICELOCALIZATION_CODE_PREFIX = "BILLINGSERVICE_BUSINESSSERVICE_";
	
	public static final String LOCALIZATION_CODES_JSONPATH = "$.messages.*.code";
	public static final String LOCALIZATION_MSGS_JSONPATH = "$.messages.*.message";
	
	public static final String BUSINESSSERVICE_MDMS_MASTER = "BusinessService";
	public static final String BUSINESSSERVICE_CODES_JSONPATH = "$.MdmsRes.BillingService.BusinessService";

	public static final String USERNAME_REPLACE_STRING = "{username}";
	public static final String PERIOD_REPLACE_STRING = "{period}";
	public static final String TAX_REPLACE_STRING = "{amt}";
	
	public static final String MODULE_REPLACE_STRING = "{module}";
	public static final String MODULE_REPLACE_STRING_VALUE = "Property Tax";
	
	public static final String MODULE_PRIMARYKEY_REPLACE_STRING = "{primarykeystring}";
	public static final String MODULE_PRIMARYKEY_REPLACE_STRING_VALUE = "property-id";
	
	public static final String SERVICENUMBER_OF_MODULE_REPLACE_STRING = "{servicenumber}";
	public static final String EXPIRY_DATE_REPLACE_STRING = "{expirydate}";
	
	/**
	 * Kafka consumer
	 * 
	 * @param record
	 * @param topic
	 */
	@KafkaListener(topics = { "${kafka.topics.billgen.topic.name}", "${kafka.topics.cancel.bill.topic.name}" })
	public void listen(Map<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		try {
			if(topic.equals(billCancelTopic)){
				BillRequestV2 req = objectMapper.convertValue(record, BillRequestV2.class);
				sendNotificationForBillCancellation(req);
			}else {
				BillRequest req = objectMapper.convertValue(record, BillRequest.class);
				sendNotification(req);
			}
		} catch (Exception e) {
			log.error("Exception while reading from the queue: ", e);
		}
	}

	private void sendNotificationForBillCancellation(BillRequestV2 req) {
		req.getBills().forEach(bill -> {
			String phNo = bill.getMobileNumber();
			String message = buildSmsBodyForBillCancellation(bill, req.getRequestInfo());
			if (!StringUtils.isEmpty(message)) {

				Map<String, Object> request = new HashMap<>();
				request.put("mobileNumber", phNo);
				request.put("message", message);
				log.info("Msg sent to user : " + message);
				producer.send(smsTopic, smsTopickey, request);
			} else {
				log.error("No message configured! Notification will not be sent.");
			}
		});
	}

	private String buildSmsBodyForBillCancellation(BillV2 bill, RequestInfo requestInfo) {
		if (bill.getMobileNumber() == null)
			return null;

		String tenantId = bill.getTenantId();
		BillDetailV2 detail = bill.getBillDetails().get(0);

		String content = fetchContentFromLocalization(requestInfo, tenantId, BILLING_LOCALIZATION_MODULE,
				BILL_CANCELLATION_MSG_LOCALIZATION_CODE);

		if (!StringUtils.isEmpty(content)) {

			content = content.replace("{OWNER_NAME}", bill.getPayerName());
			content = content.replace("{SERVICE}", bill.getBusinessService());
			content = content.replace("{BILLING_PERIOD}", getPeriod(detail.getFromPeriod(), detail.getToPeriod()));
			content = content.replace("{REASON_FOR_CANCELLATION}", bill.getAdditionalDetails().get(Constants.CANCELLATION_REASON_MSG).textValue());

		}
		return content;
	}

	/**
	 * Method to send notifications.
	 * 
	 * @param billReq
	 * @throws Exception 
	 */
	private void sendNotification(BillRequest billReq) {

		billReq.getBills().forEach(bill -> {

			String phNo = bill.getMobileNumber();
			String message = buildSmsBody(bill, billReq.getRequestInfo());
			if (!StringUtils.isEmpty(message)) {

				Map<String, Object> request = new HashMap<>();
				request.put("mobileNumber", phNo);
				request.put("message", message);
				log.info("Msg sent to user : " + message);
				producer.send(smsTopic, smsTopickey, request);
			} else {
				log.error("No message configured! Notification will not be sent.");
			}
		});
	}

	/**
	 * Prepares sms body based on the configuration
	 * 
	 * @param instrument
	 * @param bill
	 * @param billDetail
	 * @param requestInfo
	 * @return
	 */
	private String buildSmsBody(Bill bill, RequestInfo requestInfo) {

		BillDetail detail = bill.getBillDetails().get(0);

		// notification is enabled only for PT 
		if (bill.getMobileNumber() == null || !detail.getBusinessService().equals("PT"))
			return null;

		String tenantId = bill.getTenantId();

		String content = fetchContentFromLocalization(requestInfo, tenantId, BILLING_LOCALIZATION_MODULE,
				PAYMENT_MSG_LOCALIZATION_CODE);

		if (!StringUtils.isEmpty(content)) {

			Calendar cal = Calendar.getInstance();
			cal.setTimeInMillis(detail.getExpiryDate());
			
			content = content.replace(USERNAME_REPLACE_STRING, bill.getPayerName());
			content = content.replace(EXPIRY_DATE_REPLACE_STRING,
					" "+ cal.get(Calendar.DATE) + "/" + cal.get(Calendar.MONTH) + "/" + cal.get(Calendar.YEAR)+ " ".toUpperCase());
			content = content.replace(PERIOD_REPLACE_STRING, getPeriod(detail.getFromPeriod(), detail.getToPeriod()));
			content = content.replace(SERVICENUMBER_OF_MODULE_REPLACE_STRING, detail.getConsumerCode().split(":")[0]);
			content = content.replace(MODULE_REPLACE_STRING, MODULE_REPLACE_STRING_VALUE);
			content = content.replace(MODULE_PRIMARYKEY_REPLACE_STRING, MODULE_PRIMARYKEY_REPLACE_STRING_VALUE);
			content = content.replace(TAX_REPLACE_STRING, detail.getTotalAmount().toString());
			
		}
		return content;
	}

	private String getPeriod(Long fromPeriod, Long toPeriod) {

		StringBuilder period = new StringBuilder();
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(fromPeriod);
		period.append(cal.get(Calendar.YEAR));
		cal.setTimeInMillis(toPeriod);
		period.append("-");
		period.append(cal.get(Calendar.YEAR));
		return period.toString();
	}
	
	/**
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
		String locale = "";
		
		if(requestInfo.getMsgId().contains("|"))
			locale= requestInfo.getMsgId().split("[\\|]")[1]; // Conventionally locale is sent in the second(1) index of msgid split by |
		
		if(StringUtils.isEmpty(locale))
			locale = fallBackLocale;
		
		StringBuilder uri = new StringBuilder();
		String stateLevelTenant = centralUtil.getStateLevelTenant(tenantId);
		uri.append(localizationHost).append(localizationEndpoint);
		uri.append("?tenantId=").append(stateLevelTenant).append("&locale=").append(locale).append("&module=").append(module);
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

}
