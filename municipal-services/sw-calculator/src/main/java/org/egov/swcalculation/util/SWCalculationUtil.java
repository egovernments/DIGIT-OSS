package org.egov.swcalculation.util;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import com.jayway.jsonpath.Filter;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.repository.ServiceRequestRepository;
import org.egov.swcalculation.web.models.users.User;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.apache.kafka.common.requests.DeleteAclsResponse.log;
import static org.egov.swcalculation.constants.SWCalculationConstant.*;


@Component
@Slf4j
public class SWCalculationUtil {

	@Autowired
	private SWCalculationConfiguration configurations;

	@Autowired
	private SWCalculationConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private SWCalculationProducer producer;
	
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private RestTemplate restTemplate;

	@Value("${egov.property.service.host}")
	private String propertyHost;

	@Value("${egov.property.searchendpoint}")
	private String searchPropertyEndPoint;

	private String tenantId = "tenantId=";
	private String mobileNumber = "mobileNumber=";
	private String propertyIds = "propertyIds=";
	private String uuids = "uuids=";
	private String URL = "url";


	/**
	 * Returns the tax head search Url with tenantId and SW service name
	 * parameters
	 *
	 * @param tenantId - Tenant ID
	 * @return - Returns TaxPeriod Search URL
	 */
	public StringBuilder getTaxPeriodSearchUrl(String tenantId, String serviceFieldValue) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getTaxPeriodSearchEndpoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
				.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SWCalculationConstant.SEPARATER).append(SWCalculationConstant.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(serviceFieldValue);
	}

	/**
	 * Returns the tax head search Url with tenantId and SW service name
	 * parameters
	 *
	 * @param tenantId - Tenant ID
	 * @return - Returns TaxHead Search URL
	 */
	public StringBuilder getTaxHeadSearchUrl(String tenantId, String serviceFieldValue) {

		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getTaxheadsSearchEndpoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
				.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SWCalculationConstant.SEPARATER).append(SWCalculationConstant.SERVICE_FIELD_FOR_SEARCH_URL)
				.append(serviceFieldValue);
	}

	/**
	 * method to create demand search url with demand criteria
	 *
	 * @param getBillCriteria - Bill Criteria to search
	 * @return - Returns the Search URL
	 */
	public StringBuilder getDemandSearchUrl(GetBillCriteria getBillCriteria) {
		StringBuilder url;
		
		if (CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			url = new StringBuilder().append(configurations.getBillingServiceHost())
					.append(configurations.getDemandSearchEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
					.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
					.append(SWCalculationConstant.SEPARATER)
					.append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
					.append(getBillCriteria.getConnectionId()).append(SWCalculationConstant.SW_CONSUMER_CODE_SEPARATOR)
					.append(getBillCriteria.getConnectionNumber());

		else{
			url = new StringBuilder().append(configurations.getBillingServiceHost())
					.append(configurations.getDemandSearchEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
					.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
					.append(SWCalculationConstant.SEPARATER)
					.append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
					.append(StringUtils.join(getBillCriteria.getConsumerCodes(), ","));

			if(getBillCriteria.getIsPaymentCompleted() != null)
				url.append(SWCalculationConstant.SEPARATER)
						.append(SWCalculationConstant.PAYMENT_COMPLETED_SEARCH_FIELD_NAME)
						.append(getBillCriteria.getIsPaymentCompleted());
		}

		return url;
	}


	public List<Property> propertySearch(RequestInfo requestInfo, Set<String> propertyIds, String tenantId, Long limit) {

		PropertyCriteria propertyCriteria = PropertyCriteria.builder()
				.propertyIds(propertyIds)
				.tenantId(tenantId)
				.limit(limit)
				.build();

		StringBuilder url = getPropertyURL(propertyCriteria);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder()
				.requestInfo(requestInfo)
				.build();

		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		List<Property> propertyList = getPropertyDetails(result);
		return propertyList;
	}
	
	/**
	 * Returns url for demand update Api
	 *
	 * @return - Returns Update Demand URL
	 */
	public StringBuilder getUpdateDemandUrl() {
		return new StringBuilder().append(configurations.getBillingServiceHost())
				.append(configurations.getDemandUpdateEndPoint());
	}

	public DemandDetailAndCollection getLatestDemandDetailByTaxHead(String taxHeadCode,
			List<DemandDetail> demandDetails) {
		List<DemandDetail> details = demandDetails.stream()
				.filter(demandDetail -> demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(taxHeadCode))
				.collect(Collectors.toList());
		if (CollectionUtils.isEmpty(details))
			return null;

		BigDecimal taxAmountForTaxHead = BigDecimal.ZERO;
		BigDecimal collectionAmountForTaxHead = BigDecimal.ZERO;
		DemandDetail latestDemandDetail = null;
		long maxCreatedTime = 0L;

		for (DemandDetail detail : details) {
			taxAmountForTaxHead = taxAmountForTaxHead.add(detail.getTaxAmount());
			collectionAmountForTaxHead = collectionAmountForTaxHead.add(detail.getCollectionAmount());
			if (detail.getAuditDetails().getCreatedTime() > maxCreatedTime) {
				maxCreatedTime = detail.getAuditDetails().getCreatedTime();
				latestDemandDetail = detail;
			}
		}

		return DemandDetailAndCollection.builder().taxHeadCode(taxHeadCode).latestDemandDetail(latestDemandDetail)
				.taxAmountForTaxHead(taxAmountForTaxHead).collectionAmountForTaxHead(collectionAmountForTaxHead)
				.build();

	}

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

		String locale = SWCalculationConstant.NOTIFICATION_LOCALE;
		if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
			locale = requestInfo.getMsgId().split("\\|")[1];

		StringBuilder uri = new StringBuilder();
		uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
				.append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
				.append("&tenantId=").append(tenantId).append("&module=").append(SWCalculationConstant.MODULE);

		return uri;
	}

	/**
	 * Fetches messages from localization service
	 * 
	 * @param tenantId
	 *            tenantId of the sewerage connection
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return Localization messages for the module
	 */
	@SuppressWarnings("rawtypes")
	public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
		return new JSONObject(
				(LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo), requestInfo))
						.toString();
	}

	/**
	 * Extracts message for the specific code
	 * 
	 * @param notificationCode
	 *            The code for which message is required
	 * @param localizationMessage
	 *            The localization messages
	 * @return message for the specific code
	 */
	@SuppressWarnings("unchecked")
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

	public String getCustomizedMsg(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandSuccess())) {
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_SUCCESS_MESSAGE, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandFailed())) {
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_FAILURE_MESSAGE, localizationMessage);
		}
		return messageString;
	}
	
	public String getCustomizedMsgForSMS(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandSuccess())) {
			messageString = getMessageTemplate(DEMAND_SUCCESS_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandFailed())) {
			messageString = getMessageTemplate(DEMAND_FAILURE_MESSAGE_SMS, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(SWCalculationConstant.SEWERAGE_CONNECTION_BILL_GENERATION_SMS_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}


	public String getCustomizedMsgForEmail(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandSuccess())) {
			messageString = getMessageTemplate(DEMAND_SUCCESS_MESSAGE_EMAIL, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandFailed())) {
			messageString = getMessageTemplate(DEMAND_FAILURE_MESSAGE_EMAIL, localizationMessage);
		}
		return messageString;
	}


	public String getCustomizedMsgForInApp(String topic, String localizationMessage) {
		String messageString = null;
		if (topic.equalsIgnoreCase(config.getOnDemandSuccess())) {
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_SUCCESS_MESSAGE, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandFailed())) {
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_FAILURE_MESSAGE, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(SWCalculationConstant.SEWERAGE_CONNECTION_BILL_GENERATION_APP_MESSAGE,
					localizationMessage);
		}
		return messageString;
	}

	/**
	 * 
	 * @param receiver - Notification Receiver Object
	 * @param message - Message
	 * @param obj - Demand Notification Object
	 * @return - Returns updated mesage
	 */
	public String getAppliedMsg(NotificationReceiver receiver, String message, DemandNotificationObj obj) {
		message = message.replace("{First Name}", receiver.getFirstName() == null ? "" : receiver.getFirstName());
		message = message.replace("{Last Name}", receiver.getLastName() == null ? "" : receiver.getLastName());
		message = message.replace("{Service}", receiver.getServiceName() == null ? "" : receiver.getServiceName());
		message = message.replace("{ULB}", receiver.getUlbName() == null ? "" : receiver.getUlbName());
		message = message.replace("{billing cycle}", obj.getBillingCycle() == null ? "" : obj.getBillingCycle());
		return message;
	}

	/**
	 * Send the SMSRequest on the SMSNotification kafka topic
	 * 
	 * @param smsRequestList
	 *            The list of SMSRequest to be sent
	 */
	public void sendSMS(List<SMSRequest> smsRequestList) {
		if (config.getIsSMSEnabled()) {
			if (CollectionUtils.isEmpty(smsRequestList))
				 log.info("Messages from localization couldn't be fetched!");
			for (SMSRequest smsRequest : smsRequestList) {
				producer.push(config.getSmsNotifTopic(), smsRequest);
				log.info(" Messages: " + smsRequest.getMessage());
			}
		}
	}

	/**
	 * Send the SMSRequest on the EmailNotification kafka topic
	 * @param emailRequestList The list of EmailRequest to be sent
	 */
	public void sendEmail(List<EmailRequest> emailRequestList) {
		if (config.getIsMailEnabled()) {
			if (CollectionUtils.isEmpty(emailRequestList))
				log.info("Messages from localization couldn't be fetched!");
			emailRequestList.forEach(emailRequest -> {
				producer.push(config.getEmailNotifTopic(), emailRequest);
				log.info("Email To : " + emailRequest.getEmail() + " Body: " + emailRequest.getEmail().getBody() + " Subject: " + emailRequest.getEmail().getSubject());
			});

		}
	}

	/**
	 * Pushes the event request to Kafka Queue.
	 * 
	 * @param request - Event Request Object
	 */
	public void sendEventNotification(EventRequest request) {
		producer.push(config.getSaveUserEventsTopic(), request);
	}
	
	
	/**
	 * 
	 * @param sewerageConnectionRequest
	 *            SewerageConnectionRequest containing property
	 * @return List of Property
	 */
	public List<Property> propertySearch(SewerageConnectionRequest sewerageConnectionRequest) {
		PropertyCriteria propertyCriteria = new PropertyCriteria();
		HashSet<String> propertyIds = new HashSet<>();
		propertyIds.add(sewerageConnectionRequest.getSewerageConnection().getPropertyId());
		propertyCriteria.setPropertyIds(propertyIds);
		propertyCriteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		Object result = serviceRequestRepository.fetchResult(getPropertyURL(propertyCriteria),
				RequestInfoWrapper.builder().requestInfo(sewerageConnectionRequest.getRequestInfo()).build());
		List<Property> propertyList = getPropertyDetails(result);
		if (CollectionUtils.isEmpty(propertyList)) {
			throw new CustomException("EG_SW_INVALID_PROPERTY_ID", "Failed to create Sewerage connection. Invalid Property Id");
		}
		return propertyList;
	}

	/**
	 * 
	 * @param sewerageConnectionRequest
	 *            SewerageConnectionRequest
	 */
	public Property getProperty(SewerageConnectionRequest sewerageConnectionRequest) {
		Optional<Property> propertyList = propertySearch(sewerageConnectionRequest).stream().findFirst();
		if (!propertyList.isPresent()) {
			throw new CustomException("EG_SW_INVALID_PROPERTY_ID",
					"Sewerage connection cannot be enriched without property");
		}
		Property property = propertyList.get();
		if (StringUtils.isEmpty(property.getUsageCategory())) {
			throw new CustomException("EG_SW_INVALID_PROPERTY_USAGE_TYPE",
					"Sewerage connection cannot be enriched without property usage type");
		}
		return property;
	}

	/**
	 * 
	 * @param criteria - Property Search Criteria
	 * @return URL to Search Property
	 */
	private StringBuilder getPropertyURL(PropertyCriteria criteria) {
		StringBuilder url = new StringBuilder(getPropertyURL());
		boolean isAnyParameterMatch = false;
		url.append("?");
		if (!StringUtils.isEmpty(criteria.getTenantId())) {
			isAnyParameterMatch = true;
			url.append(tenantId).append(criteria.getTenantId());
		}
		if (!CollectionUtils.isEmpty(criteria.getPropertyIds())) {
			if (isAnyParameterMatch)
				url.append("&");
			isAnyParameterMatch = true;
			String propertyIdsString = criteria.getPropertyIds().stream().map(propertyId -> propertyId)
					.collect(Collectors.toSet()).stream().collect(Collectors.joining(","));
			url.append(propertyIds).append(propertyIdsString);
		}
		if (!StringUtils.isEmpty(criteria.getMobileNumber())) {
			if (isAnyParameterMatch)
				url.append("&");
			isAnyParameterMatch = true;
			url.append(mobileNumber).append(criteria.getMobileNumber());
		}
		if (!CollectionUtils.isEmpty(criteria.getUuids())) {
			if (isAnyParameterMatch)
				url.append("&");
			String uuidString = criteria.getUuids().stream().map(uuid -> uuid).collect(Collectors.toSet()).stream()
					.collect(Collectors.joining(","));
			url.append(uuids).append(uuidString);
		}
		if ((criteria.getLimit()) != null) {
			if (isAnyParameterMatch)
				url.append("&");
			isAnyParameterMatch = true;
			url.append("limit=").append(criteria.getLimit());
		}
		return url;
	}

	/**
	 * 
	 * @param result
	 *            Response object from property service call
	 * @return List of property
	 */
	private List<Property> getPropertyDetails(Object result) {

		try {
			PropertyResponse propertyResponse = objectMapper.convertValue(result, PropertyResponse.class);
			return propertyResponse.getProperties();
		} catch (Exception ex) {
			throw new CustomException("EG_SW_PARSING_ERROR", "The property json cannot be parsed");
		}
	}

	public StringBuilder getPropertyURL() {
		return new StringBuilder().append(propertyHost).append(searchPropertyEndPoint);
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
		User user = null;
		try {
			LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);
			log.info("responseMap - "+ responseMap.toString());
			List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
			String dobFormat = "yyyy-MM-dd";
			parseResponse(responseMap,dobFormat);
			user = 	objectMapper.convertValue(users.get(0), User.class);

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
	public void parseResponse(LinkedHashMap responeMap,String dobFormat){
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
