package org.egov.waterconnection.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.producer.WaterConnectionProducer;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.service.UserService;
import org.egov.waterconnection.web.models.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.waterconnection.constants.WCConstants.*;

@Component
@Slf4j
public class NotificationUtil {
	
	@Autowired
	private WSConfiguration config;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private WaterConnectionProducer producer;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private UserService userService;
	/**
	 * Returns the uri for the localization call
	 * 
	 * @param tenantId
	 *            TenantId demand Notification Obj
	 * @return The uri for localization search call
	 */
	public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

		if (config.getIsLocalizationStateLevel())
			tenantId = tenantId.split("\\.")[0];

		String locale = WCConstants.NOTIFICATION_LOCALE;
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];
		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(MODULE);

		return uri;
	}
	
	/**
	 * Fetches messages from localization service
	 * 
	 * @param tenantId
	 *            tenantId of the tradeLicense
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return Localization messages for the module
	 */
	public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
		@SuppressWarnings("rawtypes")
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
				requestInfo);
		return new JSONObject(responseMap).toString();
	}
	
	/**
	 * Extracts message for the specific code
	 * 
	 * @param notificationCode The code for which message is required
	 * @param localizationMessage The localization messages
	 * @return message for the specific code
	 */
	public String getMessageTemplate(String notificationCode, String localizationMessage) {
		String path = "$..messages[?(@.code==\"{}\")].message";
		path = path.replace("{}", notificationCode);
		String message = null;
		try {
			ArrayList<String> messageObj = (ArrayList<String>) JsonPath.parse(localizationMessage).read(path);
			if(messageObj != null && messageObj.size() > 0) {
				message = messageObj.get(0);
			}
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}
	
	
	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * @param smsRequestList The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(smsRequestList)) {
				log.info("Messages from localization couldn't be fetched!");
				return;
			}
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.info("SMS Sent! Messages: " + smsRequest.getMessage());
			}
		}
	}
	
	/**
	 * 
	 * @param applicationStatus
	 * @param localizationMessage
	 * @return message template
	 */
	public String getCustomizedMsgForSMS(String action, String applicationStatus, String localizationMessage, int reqType) {
		StringBuilder builder = new StringBuilder();
		if(reqType == WCConstants.UPDATE_APPLICATION){
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");
		}
		if(reqType == WCConstants.MODIFY_CONNECTION){
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");
		}
		if (reqType == DISCONNECT_CONNECTION)
		{
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");
		}
		return getMessageTemplate(builder.toString(), localizationMessage);
	}

	/**
	 * 
	 * @param applicationStatus
	 * @param localizationMessage
	 * @return In app message template
	 */
	public String getCustomizedMsgForInApp(String action, String applicationStatus, String localizationMessage, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_APP_MESSAGE");
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_APP_MESSAGE");
		}
		if (reqType == DISCONNECT_CONNECTION)
		{
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_APP_MESSAGE");
		}
		return getMessageTemplate(builder.toString(), localizationMessage);
	}


	/**
	 *
	 * @param applicationStatus
	 * @param localizationMessage
	 * @return Email message template
	 */
	public String getCustomizedMsgForEmail(String action, String applicationStatus, String localizationMessage, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_EMAIL_MESSAGE");
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_EMAIL_MESSAGE");
		}
		if (reqType == DISCONNECT_CONNECTION)
		{
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_EMAIL_MESSAGE");
		}
		return getMessageTemplate(builder.toString(), localizationMessage);
	}

	/**
	 * 
	 * @param code Code name to fetch the localisation value
	 * @param localizationMessage Localisation message
	 * @return In app message template
	 */
	public String getCustomizedMsg(String code, String localizationMessage) {
		return getMessageTemplate(code, localizationMessage);
	}
	
	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request EventRequest Object
	 */
	public void sendEventNotification(EventRequest request) {
		log.info("Pushing Event: " + request.toString());
		producer.push(config.getSaveUserEventsTopic(), request);
	}
	public List<EmailRequest> createEmailRequest(WaterConnectionRequest waterConnectionRequest, String message, Map<String, String> mobileNumberToEmailId) {

		List<EmailRequest> emailRequest = new LinkedList<>();
		for (Map.Entry<String, String> entryset : mobileNumberToEmailId.entrySet()) {
			String customizedMsg = message.replace("XXXX",entryset.getValue());
			customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());
//			if (customizedMsg.contains("<RECEIPT_DOWNLOAD_LINK>")) {
//				String linkToReplace = getRecepitDownloadLink(bpaRequest, entryset.getKey());
////				log.info("Link to replace - "+linkToReplace);
//				customizedMsg = customizedMsg.replace("{RECEIPT_DOWNLOAD_LINK}",linkToReplace);
//			}
			String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
			String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
			Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
			EmailRequest email = new EmailRequest(waterConnectionRequest.getRequestInfo(),emailobj);
			emailRequest.add(email);
		}
		return emailRequest;
	}

	/**
	 * Send the EmailRequest on the EmailNotification kafka topic
	 *
	 * @param emailRequestList
	 *            The list of EmailRequest to be sent
	 */
	public void sendEmail(List<EmailRequest> emailRequestList) {

		if (config.getIsEmailNotificationEnabled()) {
			if (CollectionUtils.isEmpty(emailRequestList))
				log.info("Messages from localization couldn't be fetched!");
			for (EmailRequest emailRequest : emailRequestList) {
				producer.push(config.getEmailNotifTopic(), emailRequest);
				log.info("Email Request -> "+emailRequest.toString());
				log.info("EMAIL notification sent!");
			}
		}
	}

	public Map<String, String> fetchUserEmailIds(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
		Map<String, String> mapOfPhnoAndEmailIds = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		User userInfoCopy = requestInfo.getUserInfo();
		User userInfo = getInternalMicroserviceUser(tenantId);
		requestInfo.setUserInfo(userInfo);

		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		for(String mobileNo: mobileNumbers) {
			userSearchRequest.put("userName", mobileNo);
			try {
				Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
				if(null != user) {
					if(JsonPath.read(user, "$.user[0].emailId")!=null) {
						String email = JsonPath.read(user, "$.user[0].emailId");
						mapOfPhnoAndEmailIds.put(mobileNo, email);
					}
				}else {
					log.error("Service returned null while fetching user for username - "+mobileNo);
				}
			}catch(Exception e) {
				log.error("Exception while fetching user for username - "+mobileNo);
				log.error("Exception trace: ",e);
				continue;
			}

			requestInfo.setUserInfo(userInfoCopy);
		}
		return mapOfPhnoAndEmailIds;
	}

	public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getMdmsHost()).append(config.getMdmsUrl());
		if(StringUtils.isEmpty(tenantId))
			return masterData;
		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

		Filter masterDataFilter = filter(
				where(MODULECONSTANT).is(moduleName).and(ACTION).is(action)
		);

		try {
			Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
			masterData = JsonPath.parse(response).read("$.MdmsRes.Channel.channelList[?].channelNames[*]", masterDataFilter);
		}catch(Exception e) {
			log.error("Exception while fetching workflow states to ignore: ",e);
		}
		return masterData;
	}

	private MdmsCriteriaReq getMdmsRequestForChannelList(RequestInfo requestInfo, String tenantId){
		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName(WCConstants.CHANNEL_LIST);
		List<MasterDetail> masterDetailList = new ArrayList<>();
		masterDetailList.add(masterDetail);

		ModuleDetail moduleDetail = new ModuleDetail();
		moduleDetail.setMasterDetails(masterDetailList);
		moduleDetail.setModuleName(CHANNEL);
		List<ModuleDetail> moduleDetailList = new ArrayList<>();
		moduleDetailList.add(moduleDetail);

		MdmsCriteria mdmsCriteria = new MdmsCriteria();
		mdmsCriteria.setTenantId(tenantId);
		mdmsCriteria.setModuleDetails(moduleDetailList);

		MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
		mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
		mdmsCriteriaReq.setRequestInfo(requestInfo);

		return mdmsCriteriaReq;
	}

	/**
	 *
	 * @param tenantId
	 * @return internal microservice user to fetch plain user details
	 */
	public User getInternalMicroserviceUser(String tenantId)
	{
		//Creating role with INTERNAL_MICROSERVICE_ROLE
		Role role = Role.builder()
				.name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
				.tenantId(tenantId).build();

		//Creating userinfo with uuid and role of internal micro service role
		User userInfo = User.builder()
				.uuid(config.getEgovInternalMicroserviceUserUuid())
				.type("SYSTEM")
				.roles(Collections.singletonList(role)).id(0L).build();

		return userInfo;
	}

	/**
	 * @param applicationStatus
	 * @return In app message code
	 */
	public String getCustomizedMsgForInAppForPayment(String action, String applicationStatus, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(APP_MESSAGE);
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(APP_MESSAGE);
		}
		if (reqType == DISCONNECT_CONNECTION) {
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(APP_MESSAGE);
		}
		return builder.toString();
	}

	/**
	 * @param applicationStatus
	 * @return message code
	 */
	public String getCustomizedMsgForSMSForPayment(String action, String applicationStatus, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(SMS_MESSAGE);
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(SMS_MESSAGE);
		}
		if (reqType == DISCONNECT_CONNECTION) {
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(SMS_MESSAGE);
		}
		return builder.toString();
	}

	/**
	 * @param applicationStatus
	 * @return Email message code
	 */
	public String getCustomizedMsgForEmailForPayment(String action, String applicationStatus, int reqType) {
		StringBuilder builder = new StringBuilder();
		if (reqType == WCConstants.UPDATE_APPLICATION) {
			builder.append("WS_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(EMAIL_MESSAGE);
		}
		if (reqType == WCConstants.MODIFY_CONNECTION) {
			builder.append("WS_MODIFY_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(EMAIL_MESSAGE);
		}
		if (reqType == DISCONNECT_CONNECTION) {
			builder.append("WS_DISCONNECT_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append(EMAIL_MESSAGE);
		}
		return builder.toString();
	}

}
