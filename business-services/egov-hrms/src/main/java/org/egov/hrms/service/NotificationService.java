package org.egov.hrms.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.model.Employee;
import org.egov.hrms.model.SMSRequest;
import org.egov.hrms.producer.HRMSProducer;
import org.egov.hrms.repository.RestCallRepository;
import org.egov.hrms.utils.HRMSConstants;
import org.egov.hrms.web.contract.EmployeeRequest;
import org.egov.hrms.web.contract.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {
	
	@Autowired
	private HRMSProducer producer;
	
	@Autowired
	private RestCallRepository repository;
	
    @Value("${kafka.topics.notification.sms}")
    private String smsTopic;
    
    @Value("${egov.hrms.employee.app.link}")
    private String appLink;
    
	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.search.endpoint}")
	private String localizationSearchEndpoint;

	/**
	 * Sends notification by putting the sms content onto the core-sms topic
	 * 
	 * @param request
	 * @param pwdMap
	 */
	public void sendNotification(EmployeeRequest request, Map<String, String> pwdMap) {
		String message = getMessage(request);
		if(StringUtils.isEmpty(message)) {
			log.info("SMS content has not been configured for this case");
			return;
		}
		for(Employee employee: request.getEmployees()) {
			message = buildMessage(employee, message, pwdMap);
			SMSRequest smsRequest = SMSRequest.builder().mobileNumber(employee.getUser().getMobileNumber()).message(message).build();
			producer.push(smsTopic, smsRequest);
		}
	}
	
	/**
	 * Gets the message from localization
	 * 
	 * @param request
	 * @return
	 */
	public String getMessage(EmployeeRequest request) {
		String tenantId = request.getEmployees().get(0).getTenantId().split("\\.")[0];
		Map<String, Map<String, String>> localizedMessageMap = getLocalisedMessages(request.getRequestInfo(), tenantId, 
				HRMSConstants.HRMS_LOCALIZATION_ENG_LOCALE_CODE, HRMSConstants.HRMS_LOCALIZATION_MODULE_CODE);
		return localizedMessageMap.get(HRMSConstants.HRMS_LOCALIZATION_ENG_LOCALE_CODE +"|"+tenantId).get(HRMSConstants.HRMS_EMP_CREATE_LOCLZN_CODE);
	}
	
	/**
	 * Builds msg based on the format
	 * 
	 * @param employee
	 * @param message
	 * @param pwdMap
	 * @return
	 */
	public String buildMessage(Employee employee, String message, Map<String, String> pwdMap) {
		message = message.replace("$username", employee.getCode()).replace("$password", pwdMap.get(employee.getUuid()))
				.replace("$employeename", employee.getUser().getName());
		message = message.replace("$applink", appLink);
		return message;
	}
	
	/**
	 * Creates a cache for localization that gets refreshed at every call.
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @param locale
	 * @param module
	 * @return
	 */
	public Map<String, Map<String, String>> getLocalisedMessages(RequestInfo requestInfo, String tenantId, String locale, String module) {
		Map<String, Map<String, String>> localizedMessageMap = new HashMap<>();
		Map<String, String> mapOfCodesAndMessages = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
		requestInfoWrapper.setRequestInfo(requestInfo);
		tenantId = tenantId.split("\\.")[0];
		uri.append(localizationHost).append(localizationSearchEndpoint).append("?tenantId=" + tenantId)
				.append("&module=" + module).append("&locale=" + locale);
		List<String> codes = null;
		List<String> messages = null;
		Object result = null;
		try {
			result = repository.fetchResult(uri, requestInfoWrapper);
			codes = JsonPath.read(result, HRMSConstants.HRMS_LOCALIZATION_CODES_JSONPATH);
			messages = JsonPath.read(result, HRMSConstants.HRMS_LOCALIZATION_MSGS_JSONPATH);
		} catch (Exception e) {
			log.error("Exception while fetching from localization: " + e);
		}
		if (null != result) {
			for (int i = 0; i < codes.size(); i++) {
				mapOfCodesAndMessages.put(codes.get(i), messages.get(i));
			}
			localizedMessageMap.put(locale + "|" + tenantId, mapOfCodesAndMessages);
		}
		
		return localizedMessageMap;
	}

}
