package org.egov.swcalculation.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.web.models.DemandDetail;
import org.egov.swcalculation.web.models.DemandDetailAndCollection;
import org.egov.swcalculation.web.models.DemandNotificationObj;
import org.egov.swcalculation.web.models.EventRequest;
import org.egov.swcalculation.web.models.GetBillCriteria;
import org.egov.swcalculation.web.models.NotificationReceiver;
import org.egov.swcalculation.web.models.Property;
import org.egov.swcalculation.web.models.PropertyCriteria;
import org.egov.swcalculation.web.models.PropertyResponse;
import org.egov.swcalculation.web.models.RequestInfoWrapper;
import org.egov.swcalculation.web.models.SMSRequest;
import org.egov.swcalculation.web.models.SewerageConnectionRequest;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.repository.ServiceRequestRepository;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;


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

		if (CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			return new StringBuilder().append(configurations.getBillingServiceHost())
					.append(configurations.getDemandSearchEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
					.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
					.append(SWCalculationConstant.SEPARATER)
					.append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
					.append(getBillCriteria.getConnectionId()).append(SWCalculationConstant.SW_CONSUMER_CODE_SEPARATOR)
					.append(getBillCriteria.getConnectionNumber());

		else
			return new StringBuilder().append(configurations.getBillingServiceHost())
					.append(configurations.getDemandSearchEndPoint()).append(SWCalculationConstant.URL_PARAMS_SEPARATER)
					.append(SWCalculationConstant.TENANT_ID_FIELD_FOR_SEARCH_URL).append(getBillCriteria.getTenantId())
					.append(SWCalculationConstant.SEPARATER)
					.append(SWCalculationConstant.CONSUMER_CODE_SEARCH_FIELD_NAME)
					.append(StringUtils.join(getBillCriteria.getConsumerCodes(), ","));

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
	private String getMessageTemplate(String notificationCode, String localizationMessage) {
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
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_SUCCESS_MESSAGE, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getOnDemandFailed())) {
			messageString = getMessageTemplate(SWCalculationConstant.DEMAND_FAILURE_MESSAGE, localizationMessage);
		}
		if (topic.equalsIgnoreCase(config.getPayTriggers())) {
			messageString = getMessageTemplate(SWCalculationConstant.SEWERAGE_CONNECTION_BILL_GENERATION_SMS_MESSAGE,
					localizationMessage);
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
		message = message.replace("<First Name>", receiver.getFirstName() == null ? "" : receiver.getFirstName());
		message = message.replace("<Last Name>", receiver.getLastName() == null ? "" : receiver.getLastName());
		message = message.replace("<service name>", receiver.getServiceName() == null ? "" : receiver.getServiceName());
		message = message.replace("<ULB Name>", receiver.getUlbName() == null ? "" : receiver.getUlbName());
		message = message.replace("<billing cycle>", obj.getBillingCycle() == null ? "" : obj.getBillingCycle());
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
			throw new CustomException("INVALID_PROPERTY_ID", "Failed to create Sewerage connection. Invalid Property Id");
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
			throw new CustomException("INVALID_PROPERTY_ID",
					"Sewerage connection cannot be enriched without property");
		}
		Property property = propertyList.get();
		if (StringUtils.isEmpty(property.getUsageCategory())) {
			throw new CustomException("INVALID_PROPERTY_USAGE_TYPE",
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
			throw new CustomException("PARSING_ERROR", "The property json cannot be parsed");
		}
	}

	public StringBuilder getPropertyURL() {
		return new StringBuilder().append(propertyHost).append(searchPropertyEndPoint);
	}
	
}
