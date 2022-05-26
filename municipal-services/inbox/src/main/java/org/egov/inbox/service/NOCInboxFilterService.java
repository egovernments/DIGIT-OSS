package org.egov.inbox.service;

import static org.egov.inbox.util.NocConstants.ASSIGNEE_PARAM;
import static org.egov.inbox.util.NocConstants.BUSINESS_SERVICE_PARAM;
import static org.egov.inbox.util.NocConstants.CITIZEN;
import static org.egov.inbox.util.NocConstants.DESC_PARAM;
import static org.egov.inbox.util.NocConstants.LIMIT_PARAM;
import static org.egov.inbox.util.NocConstants.LOCALITY_PARAM;
import static org.egov.inbox.util.NocConstants.MOBILE_NUMBER_PARAM;
import static org.egov.inbox.util.NocConstants.NOC_APPLICATION_NUMBER_PARAM;
import static org.egov.inbox.util.NocConstants.NOC_SOURCE_APPLICATION_NUMBER_PARAM;
import static org.egov.inbox.util.NocConstants.NOC_SOURCE_REF_ID_PARAM;
import static org.egov.inbox.util.NocConstants.NO_OF_RECORDS_PARAM;
import static org.egov.inbox.util.NocConstants.OFFSET_PARAM;
import static org.egov.inbox.util.NocConstants.REQUESTINFO_PARAM;
import static org.egov.inbox.util.NocConstants.SEARCH_CRITERIA_PARAM;
import static org.egov.inbox.util.NocConstants.SORT_ORDER_PARAM;
import static org.egov.inbox.util.NocConstants.STATUS_PARAM;
import static org.egov.inbox.util.NocConstants.TENANT_ID_PARAM;
import static org.egov.inbox.util.NocConstants.USERID_PARAM;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NOCInboxFilterService {

    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.searcher.host}")
    private String searcherHost;

    @Value("${egov.searcher.noc.search.path}")
    private String nocInboxSearcherEndpoint;

    @Value("${egov.searcher.noc.search.desc.path}")
    private String nocInboxSearcherDescEndpoint;

    @Value("${egov.searcher.noc.count.path}")
    private String nocInboxSearcherCountEndpoint;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public List<String> fetchApplicationNumbersFromSearcher(InboxSearchCriteria criteria,
            HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
        List<String> applicationNumbers = new ArrayList<>();
        HashMap<String, Object> moduleSearchCriteria = criteria.getModuleSearchCriteria();
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
                return new ArrayList<>();
            }
        }

        if (!isSearchResultEmpty) {
            Object result = null;

            Map<String, Object> searcherRequest = new HashMap<>();
            Map<String, Object> searchCriteria = getSearchCriteria(criteria, StatusIdNameMap, requestInfo,
                    moduleSearchCriteria, processCriteria, userUUIDs);
            // Paginating searcher results
            searchCriteria.put(OFFSET_PARAM, criteria.getOffset());
            searchCriteria.put(NO_OF_RECORDS_PARAM, criteria.getLimit());
            moduleSearchCriteria.put(LIMIT_PARAM, criteria.getLimit());

            searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
            searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);

            StringBuilder uri = new StringBuilder();

            if (moduleSearchCriteria.containsKey(SORT_ORDER_PARAM)
                    && moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM))
                uri.append(searcherHost).append(nocInboxSearcherDescEndpoint);
            else
                uri.append(searcherHost).append(nocInboxSearcherEndpoint);

            result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

            List<String> citizenApplicationsNumbers = JsonPath.read(result, "$.Noc.*.applicationno");

            applicationNumbers.addAll(citizenApplicationsNumbers);

        }
        return applicationNumbers;
    }

    private Map<String, Object> getSearchCriteria(InboxSearchCriteria criteria, HashMap<String, String> StatusIdNameMap,
            RequestInfo requestInfo, HashMap<String, Object> moduleSearchCriteria,
            ProcessInstanceSearchCriteria processCriteria, List<String> userUUIDs) {
        Map<String, Object> searchCriteria = new HashMap<>();

        searchCriteria.put(TENANT_ID_PARAM, criteria.getTenantId());
        searchCriteria.put(BUSINESS_SERVICE_PARAM, processCriteria.getBusinessService());

        // Accommodating module search criteria in searcher request
        if (moduleSearchCriteria != null && moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)
                && !CollectionUtils.isEmpty(userUUIDs)) {
            searchCriteria.put(USERID_PARAM, userUUIDs);
        }
        if (moduleSearchCriteria != null && moduleSearchCriteria.containsKey(LOCALITY_PARAM)) {
            searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
        }
        if (moduleSearchCriteria != null && moduleSearchCriteria.containsKey(NOC_APPLICATION_NUMBER_PARAM)) {
            searchCriteria.put(NOC_APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(NOC_APPLICATION_NUMBER_PARAM));
        }
        if (moduleSearchCriteria != null && moduleSearchCriteria.containsKey(NOC_SOURCE_REF_ID_PARAM)) {
            searchCriteria.put(NOC_SOURCE_APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(NOC_SOURCE_REF_ID_PARAM));
        }

        // Accommodating process search criteria in searcher request
        if (!ObjectUtils.isEmpty(processCriteria.getAssignee())) {
            searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
        }
        if (!ObjectUtils.isEmpty(processCriteria.getStatus())) {
            searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
        } else {
            if (StatusIdNameMap != null && StatusIdNameMap.values().size() > 0) {
                if (CollectionUtils.isEmpty(processCriteria.getStatus())) {
                    searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
                }
            }
        }
        return searchCriteria;
    }

    public Integer fetchApplicationCountFromSearcher(InboxSearchCriteria criteria,
            HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo) {
        Integer totalCount = 0;
        HashMap<String, Object> moduleSearchCriteria = criteria.getModuleSearchCriteria();
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
            Map<String, Object> searcherRequest = new HashMap<>();
            Map<String, Object> searchCriteria = getSearchCriteria(criteria, StatusIdNameMap, requestInfo,
                    moduleSearchCriteria, processCriteria, userUUIDs);
            searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
            searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);
            StringBuilder citizenUri = new StringBuilder();
            citizenUri.append(searcherHost).append(nocInboxSearcherCountEndpoint);

            Object result = restTemplate.postForObject(citizenUri.toString(), searcherRequest, Map.class);

            double citizenCount = JsonPath.read(result, "$.TotalCount[0].count");
            totalCount = totalCount + (int) citizenCount;
        }
        return totalCount;
    }

    private List<String> fetchUserUUID(String mobileNumber, RequestInfo requestInfo, String tenantId) {
        StringBuilder uri = new StringBuilder();
        List<String> uuids = new ArrayList<>();
        uri.append(userHost).append(userSearchEndpoint);
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", CITIZEN);
        userSearchRequest.put("mobileNumber", mobileNumber);
        try {
            Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
            if (null != user) {
                // log.info(user.toString());
                uuids.addAll(JsonPath.read(user, "$.user.*.uuid"));
            } else {
                log.error("Service returned null while fetching user for mobile number - " + mobileNumber);
            }
        } catch (Exception e) {
            log.error("Exception while fetching user for mobile number - " + mobileNumber);
            log.error("Exception trace: ", e);
        }
        return uuids;
    }
}
