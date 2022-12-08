package org.egov.wscalculation.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Filter;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.web.models.*;
import org.egov.wscalculation.producer.WSCalculationProducer;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.egov.wscalculation.web.models.users.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.wscalculation.constants.WSCalculationConstant.*;

@Component
@Slf4j
public class NotificationUtil {

	@Autowired
	private WSCalculationConfiguration config;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private WSCalculationProducer producer;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper mapper;


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

		String locale = WSCalculationConstant.NOTIFICATION_LOCALE;
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(WSCalculationConstant.MODULE);

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
			Object messageObj = JsonPath.parse(localizationMessage).read(path);
			message = ((ArrayList<String>) messageObj).get(0);
		} catch (Exception e) {
			log.warn("Fetching from localization failed", e);
		}
		return message;
	}
	
	public String getCustomizedMsgForSMS(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandsSaved())) {
			messageString = getMessageTemplate(WSCalculationConstant.DEMAND_SUCCESS_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandsFailure())) {
			messageString = getMessageTemplate(WSCalculationConstant.DEMAND_FAILURE_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(WSCalculationConstant.WATER_CONNECTION_BILL_GENERATION_SMS_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}

	public String getCustomizedMsgForEmail(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandsSaved())) {
			messageString = getMessageTemplate(DEMAND_SUCCESS_MESSAGE_EMAIL, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandsFailure())) {
			messageString = getMessageTemplate(DEMAND_FAILURE_MESSAGE_EMAIL, localizationMessage);
		}
		return messageString;
	}

	public String getCustomizedMsgForInApp(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(WSCalculationConstant.WATER_CONNECTION_BILL_GENERATION_APP_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}
	
	/**
	 * 
	 * @param receiver - Notification Receiver
	 * @param message, - Notification Message
	 * @param obj - Notification Demand Details
	 * @return - Returns the proper message
	 */
	public String getAppliedMsg(NotificationReceiver receiver, String message, DemandNotificationObj obj) {
		log.info("receive - "+receiver.toString());
		message = message.replace("{First Name}", receiver.getFirstName() == null ? "" : receiver.getFirstName());
		message = message.replace("{Last Name}", receiver.getLastName() == null ? "" : receiver.getLastName());
		message = message.replace("{Service}", receiver.getServiceName() == null ? "" : receiver.getServiceName());
		message = message.replace("{ULB}", receiver.getUlbName() == null ? "" : receiver.getUlbName());
		message = message.replace("{billing cycle}", obj.getBillingCycle() == null ? "" : obj.getBillingCycle());
		log.info("message -------- "+ message);
		return message;
	}
	
	
	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * @param smsRequestList The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(smsRequestList))
				 log.info("Messages from localization couldn't be fetched!");
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.debug("Sending SMS Messages: " + smsRequest.getMessage());
			}
		}
	}
	/**
	 * Send the SMSRequest on the EmailNotification kafka topic
	 * @param emailRequestList The list of EmailRequest to be sent
	 */
	public void sendEmail(List<EmailRequest> emailRequestList) {
			if (config.getIsEmailEnabled()) {
				if (CollectionUtils.isEmpty(emailRequestList))
					log.info("Messages from localization couldn't be fetched!");
				emailRequestList.forEach(emailRequest -> {
					producer.push(config.getEmailNotifyTopic(), emailRequest);
					log.info("Email To : " + emailRequest.getEmail() + " Body: " + emailRequest.getEmail().getBody() + " Subject: " + emailRequest.getEmail().getSubject());
				});

		}
	}
	
	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request Event Request Object
	 */
	public void sendEventNotification(EventRequest request) {
		producer.push(config.getSaveUserEventsTopic(), request);
	}

	public String getShortnerURL(String actualURL) {
		net.minidev.json.JSONObject obj = new net.minidev.json.JSONObject();
		obj.put("url", actualURL);
		String url = config.getNotificationUrl() + config.getShortenerURL();

		Object response = serviceRequestRepository.getShorteningURL(new StringBuilder(url), obj);
		return response.toString();
	}

	public Map<String, String> fetchUserEmailIds(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
		Map<String, String> mapOfPhnoAndEmailIds = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
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
		}
		return mapOfPhnoAndEmailIds;
	}

	public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getMdmsHost()).append(config.getMdmsEndPoint());
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
		masterDetail.setName(CHANNEL_LIST);
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
	 * Fetches User Object based on the UUID.
	 *
	 * @param uuidstring - UUID of User
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @return - Returns User object with given UUID
	 */
	public User fetchUserByUUID(String uuidstring, RequestInfo requestInfo, String tenantId) {
		log.info("here- "+uuidstring);
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "EMPLOYEE");
		Set<String> uuid = new HashSet<>() ;
		uuid.add(uuidstring);
		userSearchRequest.put("uuid", uuid);
		log.info("user serach req - "+userSearchRequest.toString());
		User user = null;
		try {
			LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);
			log.info("responseMap - "+ responseMap.toString());
			List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
			String dobFormat = "yyyy-MM-dd";
			parseResponse(responseMap,dobFormat);
			user = 	mapper.convertValue(users.get(0), User.class);

		}catch(Exception e) {
			log.error("Exception while trying parse user object: ",e);
		}
		log.info(user.toString());
		return user;
	}

	/**
	 * Parses date formats to long for all users in responseMap
	 * @param responeMap LinkedHashMap got from user api response
	 */
	public void parseResponse(LinkedHashMap responeMap, String dobFormat){
		List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
		String formatForDate = "dd-MM-yyyy HH:mm:ss";
		if(users!=null){
			users.forEach( map -> {
						map.put("createdDate",dateTolong((String)map.get("createdDate"),formatForDate));
						if((String)map.get("lastModifiedDate")!=null)
							map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),formatForDate));
						if((String)map.get("dob")!=null)
							map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
						if((String)map.get("pwdExpiryDate")!=null)
							map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),formatForDate));
					}
			);
		}
	}

	/**
	 * Converts date to long
	 * @param date date to be parsed
	 * @param format Format of the date
	 * @return Long value of date
	 */
	private Long dateTolong(String date,String format){
		SimpleDateFormat simpleDateFormatObject = new SimpleDateFormat(format);
		Date returnDate = null;
		try {
			returnDate = simpleDateFormatObject.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return  returnDate.getTime();
	}

	/**
	 *
	 * @param tenantId
	 * @return internal microservice user to fetch plain user details
	 */
	public org.egov.common.contract.request.User getInternalMicroserviceUser(String tenantId)
	{
		//Creating role with INTERNAL_MICROSERVICE_ROLE
		org.egov.common.contract.request.Role role = Role.builder()
				.name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
				.tenantId(tenantId).build();

		//Creating userinfo with uuid and role of internal micro service role
		org.egov.common.contract.request.User userInfo = org.egov.common.contract.request.User.builder()
				.uuid(config.getEgovInternalMicroserviceUserUuid())
				.type("SYSTEM")
				.roles(Collections.singletonList(role)).id(0L).build();

		return userInfo;
	}

}
