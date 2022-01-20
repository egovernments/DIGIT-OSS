package org.egov.inbox.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.util.BpaConstants;
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
import java.util.stream.Collectors;

import static org.egov.inbox.util.BpaConstants.BPAREG;
import static org.egov.inbox.util.BpaConstants.MOBILE_NUMBER_PARAM;
import static org.egov.inbox.util.TLConstants.*;

@Slf4j
@Service
public class TLInboxFilterService {

    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.searcher.host}")
    private String searcherHost;

    @Value("${egov.searcher.tl.search.path}")
    private String tlInboxSearcherEndpoint;

    @Value("${egov.searcher.tl.search.desc.path}")
    private String tlInboxSearcherDescEndpoint;

    @Value("${egov.searcher.tl.count.path}")
    private String tlInboxSearcherCountEndpoint;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public List<String> fetchApplicationNumbersFromSearcher(InboxSearchCriteria criteria, HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo){
        List<String> acknowledgementNumbers = new ArrayList<>();
        HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
        ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
        Boolean isSearchResultEmpty = false;
        Boolean isMobileNumberPresent = false;
        List<String> userUUIDs = new ArrayList<>();
        moduleSearchCriteria = setUserWhenMobileNoIsEmptyForStakeholderRegOfCitizen(criteria, requestInfo, moduleSearchCriteria,
                processCriteria);
        if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)){
            isMobileNumberPresent = true;
        }
        if(isMobileNumberPresent) {
            String tenantId = criteria.getTenantId();
            String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
            userUUIDs = fetchUserUUID(mobileNumber, requestInfo, tenantId);
            Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
            isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
            if(isSearchResultEmpty){
                return new ArrayList<>();
            }
        }

        if(!isSearchResultEmpty){
            Object result = null;

            Map<String, Object> searcherRequest = new HashMap<>();
            Map<String, Object> searchCriteria = new HashMap<>();

            searchCriteria.put(TENANT_ID_PARAM,criteria.getTenantId());
            searchCriteria.put(BUSINESS_SERVICE_PARAM,processCriteria.getBusinessService());

            // Accomodating module search criteria in searcher request
            if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM) && !CollectionUtils.isEmpty(userUUIDs)){
                searchCriteria.put(USERID_PARAM, userUUIDs);
            }
            if(moduleSearchCriteria.containsKey(LOCALITY_PARAM)){
                searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
            }
            if(moduleSearchCriteria.containsKey(LICENSE_NUMBER_PARAM)){
                searchCriteria.put(LICENSE_NUMBER_PARAM, moduleSearchCriteria.get(LICENSE_NUMBER_PARAM));
            }
            if(moduleSearchCriteria.containsKey(APPLICATION_NUMBER_PARAM)) {
                searchCriteria.put(APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(APPLICATION_NUMBER_PARAM));
            }

            // Accomodating process search criteria in searcher request
            if(!ObjectUtils.isEmpty(processCriteria.getAssignee())){
                searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
            }
            if(!ObjectUtils.isEmpty(processCriteria.getStatus())){
                searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
            }else{
                if(StatusIdNameMap.values().size() > 0) {
                    if(CollectionUtils.isEmpty(processCriteria.getStatus())) {
                        searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
                    }
                }
            }

            // Paginating searcher results
            searchCriteria.put(OFFSET_PARAM, criteria.getOffset());
            searchCriteria.put(NO_OF_RECORDS_PARAM, criteria.getLimit());
            moduleSearchCriteria.put(LIMIT_PARAM, criteria.getLimit());

            searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
            searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);

            StringBuilder uri = new StringBuilder();
            if(moduleSearchCriteria.containsKey(SORT_ORDER_PARAM) && moduleSearchCriteria.get(SORT_ORDER_PARAM).equals(DESC_PARAM)){
                uri.append(searcherHost).append(tlInboxSearcherDescEndpoint);
            }else {
                uri.append(searcherHost).append(tlInboxSearcherEndpoint);
            }

            result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

            acknowledgementNumbers = JsonPath.read(result, "$.Licenses.*.applicationnumber");

        }
        return  acknowledgementNumbers;
    }

    private HashMap setUserWhenMobileNoIsEmptyForStakeholderRegOfCitizen(InboxSearchCriteria criteria, RequestInfo requestInfo,
            HashMap moduleSearchCriteria, ProcessInstanceSearchCriteria processCriteria) {
        List<String> roles = requestInfo.getUserInfo().getRoles().stream().map(Role::getCode).collect(Collectors.toList());
        if(processCriteria.getModuleName().equals(BPAREG) && roles.contains(BpaConstants.CITIZEN)) {
            if (moduleSearchCriteria == null || moduleSearchCriteria.isEmpty() || !moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)) {
                moduleSearchCriteria = new HashMap<>();
                moduleSearchCriteria.put(MOBILE_NUMBER_PARAM, requestInfo.getUserInfo().getMobileNumber());
                criteria.setModuleSearchCriteria(moduleSearchCriteria);
            } 
        }
        return moduleSearchCriteria;
    }

    public Integer fetchApplicationCountFromSearcher(InboxSearchCriteria criteria, HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo){
        Integer totalCount = 0;
        HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
        ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
        Boolean isSearchResultEmpty = false;
        Boolean isMobileNumberPresent = false;
        List<String> userUUIDs = new ArrayList<>();
        moduleSearchCriteria = setUserWhenMobileNoIsEmptyForStakeholderRegOfCitizen(criteria, requestInfo, moduleSearchCriteria,
                processCriteria);
        if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)){
            isMobileNumberPresent = true;
        }
        if(isMobileNumberPresent) {
            String tenantId = criteria.getTenantId();
            String mobileNumber = String.valueOf(moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
            userUUIDs = fetchUserUUID(mobileNumber, requestInfo, tenantId);
            Boolean isUserPresentForGivenMobileNumber = CollectionUtils.isEmpty(userUUIDs) ? false : true;
            isSearchResultEmpty = !isMobileNumberPresent || !isUserPresentForGivenMobileNumber;
            if(isSearchResultEmpty){
                return 0;
            }
        }

        if(!isSearchResultEmpty){
            Object result = null;

            Map<String, Object> searcherRequest = new HashMap<>();
            Map<String, Object> searchCriteria = new HashMap<>();

            searchCriteria.put(TENANT_ID_PARAM,criteria.getTenantId());

            // Accomodating module search criteria in searcher request
            if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM) && !CollectionUtils.isEmpty(userUUIDs)){
                searchCriteria.put(USERID_PARAM, userUUIDs);
            }
            if(moduleSearchCriteria.containsKey(LOCALITY_PARAM)){
                searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
            }
            if(moduleSearchCriteria.containsKey(LICENSE_NUMBER_PARAM)){
                searchCriteria.put(LICENSE_NUMBER_PARAM, moduleSearchCriteria.get(LICENSE_NUMBER_PARAM));
            }
            if(moduleSearchCriteria.containsKey(APPLICATION_NUMBER_PARAM)) {
                searchCriteria.put(APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(APPLICATION_NUMBER_PARAM));
            }

            // Accomodating process search criteria in searcher request
            if(!ObjectUtils.isEmpty(processCriteria.getAssignee())){
                searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
            }
            if(!ObjectUtils.isEmpty(processCriteria.getStatus())){
                searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
            }else{
                if(StatusIdNameMap.values().size() > 0) {
                    if(CollectionUtils.isEmpty(processCriteria.getStatus())) {
                        searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
                    }
                }
            }

            searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
            searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);

            StringBuilder uri = new StringBuilder();
            uri.append(searcherHost).append(tlInboxSearcherCountEndpoint);

            result = restTemplate.postForObject(uri.toString(), searcherRequest, Map.class);

            double count = JsonPath.read(result, "$.TotalCount[0].count");
            totalCount = new Integer((int) count);
        }
        return  totalCount;
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
            if(null != user) {
                //log.info(user.toString());
                userUuids = JsonPath.read(user, "$.user.*.uuid");
            }else {
                log.error("Service returned null while fetching user for mobile number - " + mobileNumber);
            }
        }catch(Exception e) {
            log.error("Exception while fetching user for mobile number - " + mobileNumber);
            log.error("Exception trace: ", e);
        }
        return userUuids;
    }


}
