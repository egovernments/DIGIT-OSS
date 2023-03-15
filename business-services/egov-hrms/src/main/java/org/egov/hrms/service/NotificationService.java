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
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class NotificationService {
	
	@Autowired
	private HRMSProducer producer;
	
	@Autowired
	private RestCallRepository repository;

	@Autowired
	private RestTemplate restTemplate;

	@Value("${kafka.topics.notification.sms}")
    private String smsTopic;
    
    @Value("${egov.hrms.employee.app.link}")
    private String appLink;
    
	@Value("${egov.localization.host}")
	private String localizationHost;

	@Value("${egov.localization.search.endpoint}")
	private String localizationSearchEndpoint;

	@Value("${egov.otp.host}")
	private String otpHost;

	@Value("${egov.otp.create.endpoint}")
	private String otpCreateEndpoint;

	@Value("${egov.environment.domain}")
	private String envHost;



	/**
	 * Sends notification by putting the sms content onto the core-sms topic
	 * 
	 * @param request
	 * @param pwdMap
	 */
	public void sendNotification(EmployeeRequest request, Map<String, String> pwdMap) {
		String message = getMessage(request,HRMSConstants.HRMS_EMP_CREATE_LOCLZN_CODE);
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

	public void sendReactivationNotification(EmployeeRequest request){
		String message = getMessage(request,HRMSConstants.HRMS_EMP_REACTIVATE_LOCLZN_CODE);
		if(StringUtils.isEmpty(message)) {
			log.info("SMS content has not been configured for this case");
			return;
		}
		RequestInfo requestInfo = request.getRequestInfo();
		for(Employee employee: request.getEmployees()) {
			if(employee.getReactivationDetails()!=null && employee.getReActivateEmployee()){
				String OTP = getOTP(employee,requestInfo);
				String link = envHost + "employee/user/otp";

				message = message.replace("{Employee Name}",employee.getUser().getName()).replace("{Username}",employee.getCode());
				message = message.replace("{date}",(employee.getReactivationDetails().get(0).getEffectiveFrom()).toString());
				message = message.replace("{password}",OTP).replace("{link}",link);

				SMSRequest smsRequest = SMSRequest.builder().mobileNumber(employee.getUser().getMobileNumber()).message(message).build();
				log.info(message );
				producer.push(smsTopic, smsRequest);
			}

		}

	}

	public String getOTP(Employee employee,RequestInfo requestInfo){
		Map<String, Object> OTPRequest= new HashMap<>();
		Map<String, Object> otp= new HashMap<>();
		otp.put("mobileNumber",employee.getUser().getMobileNumber());
		otp.put("type","passwordreset");
		otp.put("tenantId",employee.getTenantId());
		otp.put("userType","EMPLOYEE");
		otp.put("identity",employee.getUser().getMobileNumber());

		OTPRequest.put("RequestInfo",requestInfo);
		OTPRequest.put("otp",otp);

		Object response = null;
		StringBuilder url = new StringBuilder();
		url.append(otpHost).append(otpCreateEndpoint);
		try {
			response = restTemplate.postForObject(url.toString(), OTPRequest, Map.class);
		}catch(Exception e) {
			log.error("Exception while creating user: ", e);
			return null;
		}
		String result = JsonPath.read(response, "$.otp.otp");
		return result;
	}
	
	/**
	 * Gets the message from localization
	 * 
	 * @param request
	 * @return
	 */
	public String getMessage(EmployeeRequest request,String msgCode) {
		String tenantId = request.getEmployees().get(0).getTenantId().split("\\.")[0];
		Map<String, Map<String, String>> localizedMessageMap = getLocalisedMessages(request.getRequestInfo(), tenantId, 
				HRMSConstants.HRMS_LOCALIZATION_ENG_LOCALE_CODE, HRMSConstants.HRMS_LOCALIZATION_MODULE_CODE);
		return localizedMessageMap.get(HRMSConstants.HRMS_LOCALIZATION_ENG_LOCALE_CODE +"|"+tenantId).get(msgCode);
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
