package org.egov.inbox.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.web.model.InboxSearchCriteria;
import org.egov.inbox.web.model.workflow.ProcessInstanceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.inbox.util.BSConstants.*;

@Slf4j
@Service
public class BillingAmendmentInboxFilterService {

	@Value("${egov.user.host}")
	private String userHost;

	@Value("${egov.user.search.path}")
	private String userSearchEndpoint;

	@Value("${egov.searcher.host}")
	private String searcherHost;

	@Value("${egov.searcher.bs.search.path}")
	private String bsInboxSearcherEndpoint;

	@Value("${egov.searcher.bs.search.desc.path}")
	private String bsInboxSearcherDescEndpoint;

	@Value("${egov.searcher.bs.count.path}")
	private String bsInboxSearcherCountEndpoint;

	@Value("${egov.searcher.bs.sw.search.path}")
	private String bsSwInboxSearcherEndpoint;

	@Value("${egov.searcher.bs.sw.search.desc.path}")
	private String bsSwInboxSearcherDescEndpoint;

	@Value("${egov.searcher.bs.sw.count.path}")
	private String bsSwInboxSearcherCountEndpoint;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	public Map<String, List<String>> fetchConsumerNumbersFromSearcher(InboxSearchCriteria criteria,
			HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
		List<String> consumerCodes = new ArrayList<>();
		List<String> amendmentIds = new ArrayList<>();
		Map<String, List<String>> map = new HashMap();
		HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
		ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
		Boolean isSearchResultEmpty = false;
		Boolean isMobileNumberPresent = false;
		List<String> userUUIDs = new ArrayList<>();
		if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)) {
			isMobileNumberPresent = true;
		}
		if (isMobileNumberPresent) {
			String tenantId = criteria.getTenantId();
			String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
			userUUIDs = fetchUserUUID(mobileNumber, requestInfo, tenantId);
			Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
			isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
			if (isSearchResultEmpty) {
				return new HashMap<>();
			}
		}

		if (!isSearchResultEmpty) {
			Object result = null;

			Map<String, Object> searcherRequest = new HashMap<>();
			Map<String, Object> searchCriteria = new HashMap<>();

			searchCriteria.put(TENANT_ID_PARAM, criteria.getTenantId());
			searchCriteria.put(BS_BUSINESS_SERVICE_PARAM, processCriteria.getBusinessService());

			// Accomodating module search criteria in searcher request
			if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM) && !CollectionUtils.isEmpty(userUUIDs)) {
				searchCriteria.put(USERID_PARAM, userUUIDs);
			}
			/*
			 * if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)){
			 * searchCriteria.put(MOBILE_NUMBER_PARAM,
			 * moduleSearchCriteria.get(MOBILE_NUMBER_PARAM)); }
			 */
			if (moduleSearchCriteria.containsKey(LOCALITY_PARAM)) {
				searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
			}
			if (moduleSearchCriteria.containsKey(PROPERTY_ID_PARAM)) {
				searchCriteria.put(PROPERTY_ID_PARAM, moduleSearchCriteria.get(PROPERTY_ID_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_APPLICATION_NUMBER_PARAM)) {
				searchCriteria.put(BS_APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(BS_APPLICATION_NUMBER_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_APPLICATION_TYPE_PARAM)) {
				searchCriteria.put(BS_APPLICATION_TYPE_PARAM, moduleSearchCriteria.get(BS_APPLICATION_TYPE_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_CONSUMER_NO_PARAM)) {
				searchCriteria.put(BS_CONSUMER_NO_PARAM, moduleSearchCriteria.get(BS_CONSUMER_NO_PARAM));
			}
			if (moduleSearchCriteria.containsKey("appStatus")) {
				searchCriteria.put(BS_APPLICATION_STATUS_PARAM, moduleSearchCriteria.get("appStatus"));
			}
			// Accomodating process search criteria in searcher request
			if (!ObjectUtils.isEmpty(processCriteria.getAssignee())) {
				searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
			}
			if (!ObjectUtils.isEmpty(processCriteria.getStatus())) {
				searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
			} else {
				if (StatusIdNameMap.values().size() > 0) {
					if (CollectionUtils.isEmpty(processCriteria.getStatus())) {
						searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
					}
				}
			}

			// Paginating searcher results
			searchCriteria.put(OFFSET_PARAM, criteria.getOffset());
			searchCriteria.put(NO_OF_RECORDS_PARAM, criteria.getLimit());
			// moduleSearchCriteria.put(LIMIT_PARAM, criteria.getLimit());

			searcherRequest.put(BS_REQUESTINFO_PARAM, requestInfo);
			searcherRequest.put(BS_SEARCH_CRITERIA_PARAM, searchCriteria);

			StringBuilder uri = new StringBuilder();
			if (criteria.getProcessSearchCriteria().getModuleName().equalsIgnoreCase(BS_WS)) {
				if (moduleSearchCriteria.containsKey(SORT_ORDER_PARAM)
						&& moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM)) {
					uri.append(searcherHost).append(bsInboxSearcherDescEndpoint);
				} else {
					uri.append(searcherHost).append(bsInboxSearcherEndpoint);
				}
			} else {
				if (moduleSearchCriteria.containsKey(SORT_ORDER_PARAM)
						&& moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM)) {
					uri.append(searcherHost).append(bsSwInboxSearcherDescEndpoint);
				} else {
					uri.append(searcherHost).append(bsSwInboxSearcherEndpoint);
				}
			}

			result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

			consumerCodes = JsonPath.read(result, "$.BillAmendments.*.consumercode");
			amendmentIds = JsonPath.read(result, "$.BillAmendments.*.amendmentid");
			map.put("consumerCodes", consumerCodes);
			map.put("amendmentIds", amendmentIds);
		}
		return map;
	}

	public Integer fetchApplicationCountFromSearcher(InboxSearchCriteria criteria,
			HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
		Integer totalCount = 0;
		HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
		ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
		Boolean isSearchResultEmpty = false;
		Boolean isMobileNumberPresent = false;
		List<String> userUUIDs = new ArrayList<>();
		if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)) {
			isMobileNumberPresent = true;
		}
		if (isMobileNumberPresent) {
			String tenantId = criteria.getTenantId();
			String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
			userUUIDs = fetchUserUUID(mobileNumber, requestInfo, tenantId);
			Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
			isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
			if (isSearchResultEmpty) {
				return 0;
			}
		}

		if (!isSearchResultEmpty) {
			Object result = null;

			Map<String, Object> searcherRequest = new HashMap<>();
			Map<String, Object> searchCriteria = new HashMap<>();

			searchCriteria.put(TENANT_ID_PARAM, criteria.getTenantId());

			// Accomodating module search criteria in searcher request
			if (moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM) && !CollectionUtils.isEmpty(userUUIDs)) {
				searchCriteria.put(USERID_PARAM, userUUIDs);
			}
			if (moduleSearchCriteria.containsKey(LOCALITY_PARAM)) {
				searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
			}
			if (moduleSearchCriteria.containsKey(PROPERTY_ID_PARAM)) {
				searchCriteria.put(PROPERTY_ID_PARAM, moduleSearchCriteria.get(PROPERTY_ID_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_APPLICATION_NUMBER_PARAM)) {
				searchCriteria.put(BS_APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(BS_APPLICATION_NUMBER_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_APPLICATION_TYPE_PARAM)) {
				searchCriteria.put(BS_APPLICATION_TYPE_PARAM, moduleSearchCriteria.get(BS_APPLICATION_TYPE_PARAM));
			}
			if (moduleSearchCriteria.containsKey(BS_CONSUMER_NO_PARAM)) {
				searchCriteria.put(BS_CONSUMER_NO_PARAM, moduleSearchCriteria.get(BS_CONSUMER_NO_PARAM));
			}
			if (moduleSearchCriteria.containsKey("appStatus")) {
				searchCriteria.put(BS_APPLICATION_STATUS_PARAM, moduleSearchCriteria.get("appStatus"));
			}
			// Accomodating process search criteria in searcher request
			if (!ObjectUtils.isEmpty(processCriteria.getAssignee())) {
				searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
			}
			if (!ObjectUtils.isEmpty(processCriteria.getStatus())) {
				searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
			} else {
				if (StatusIdNameMap.values().size() > 0) {
					if (CollectionUtils.isEmpty(processCriteria.getStatus())) {
						searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
					}
				}
			}

			// Paginating searcher results

			searcherRequest.put(BS_REQUESTINFO_PARAM, requestInfo);
			searcherRequest.put(BS_SEARCH_CRITERIA_PARAM, searchCriteria);

			StringBuilder uri = new StringBuilder();

			if (criteria.getProcessSearchCriteria().getModuleName().equalsIgnoreCase(BS_WS)) {
				uri.append(searcherHost).append(bsInboxSearcherCountEndpoint);
			} else {
				uri.append(searcherHost).append(bsSwInboxSearcherCountEndpoint);
			}

			result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

			double count = JsonPath.read(result, "$.TotalCount[0].count");
			totalCount = new Integer((int) count);

		}
		return totalCount;
	}

	private List<String> fetchUserUUID(String mobileNumber, RequestInfo requestInfo, String tenantId) {
		StringBuilder uri = new StringBuilder();
		uri.append(userHost).append(userSearchEndpoint);
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		userSearchRequest.put("mobileNumber", mobileNumber);
		List<String> userUuids = new ArrayList<>();
		try {
			Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
			if (null != user) {
				// log.info(user.toString());
				userUuids = JsonPath.read(user, "$.user.*.uuid");
			} else {
				log.error("Service returned null while fetching user for mobile number - " + mobileNumber);
			}
		} catch (Exception e) {
			log.error("Exception while fetching user for mobile number - " + mobileNumber);
			log.error("Exception trace: ", e);
		}
		return userUuids;
	}
}
