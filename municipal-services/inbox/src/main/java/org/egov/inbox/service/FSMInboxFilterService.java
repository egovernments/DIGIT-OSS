package org.egov.inbox.service;

import static org.egov.inbox.util.TLConstants.APPLICATION_NUMBER_PARAM;
import static org.egov.inbox.util.TLConstants.ASSIGNEE_PARAM;
import static org.egov.inbox.util.TLConstants.LICENSE_NUMBER_PARAM;
import static org.egov.inbox.util.TLConstants.LOCALITY_PARAM;
import static org.egov.inbox.util.TLConstants.MOBILE_NUMBER_PARAM;
import static org.egov.inbox.util.TLConstants.REQUESTINFO_PARAM;
import static org.egov.inbox.util.TLConstants.SEARCH_CRITERIA_PARAM;
import static org.egov.inbox.util.TLConstants.STATUS_PARAM;
import static org.egov.inbox.util.TLConstants.TENANT_ID_PARAM;
import static org.egov.inbox.util.TLConstants.USERID_PARAM;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.util.FSMConstants;
import org.egov.inbox.web.model.InboxSearchCriteria;
import org.egov.inbox.web.model.workflow.ProcessInstanceSearchCriteria;
import org.egov.tracer.model.CustomException;
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
public class FSMInboxFilterService {
	

    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.searcher.host}")
    private String searcherHost;

    @Value("${egov.searcher.tl.search.path}")
    private String tlInboxSearcherEndpoint;

    @Value("${egov.searcher.fsm.count.path}")
    private String fsmInboxSearcherCountEndpoint;
    

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

	
	public Integer fetchApplicationCountFromSearcher(InboxSearchCriteria criteria, HashMap<String, String> StatusIdNameMap, RequestInfo requestInfo,String dsoId){
        Integer totalCount = 0;
        HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
        ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
        Boolean isSearchResultEmpty = false;
        Boolean isMobileNumberPresent = false;
       
        List<String> userUUIDs = new ArrayList<>();
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
           
            if(moduleSearchCriteria.containsKey(FSMConstants.APPLICATION_NUMBER)) {
                searchCriteria.put(FSMConstants.APPLICATION_NUMBER_PARAM, moduleSearchCriteria.get(FSMConstants.APPLICATION_NUMBER));
            }
            
            if(dsoId!=null) {
            	 searchCriteria.put(FSMConstants.DSO_ID,dsoId);
            }

            // Accomodating process search criteria in searcher request
            if(!ObjectUtils.isEmpty(processCriteria.getAssignee())){
                searchCriteria.put(ASSIGNEE_PARAM, processCriteria.getAssignee());
            }
            if(!ObjectUtils.isEmpty(processCriteria.getStatus()) && !requestInfo.getUserInfo().getRoles().get(0).getCode().equals(FSMConstants.FSM_DSO)){
                searchCriteria.put(STATUS_PARAM, processCriteria.getStatus());
            }else{
                if(StatusIdNameMap.values().size() > 0) {
                    if(CollectionUtils.isEmpty(processCriteria.getStatus()) || (!(requestInfo.getUserInfo().getRoles().get(0).getCode().equals(FSMConstants.FSM_DSO)))) {
                        searchCriteria.put(STATUS_PARAM, StatusIdNameMap.keySet());
                    }
                }
            }

            searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
            searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);

            StringBuilder uri = new StringBuilder();
            uri.append(searcherHost).append(fsmInboxSearcherCountEndpoint);

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
