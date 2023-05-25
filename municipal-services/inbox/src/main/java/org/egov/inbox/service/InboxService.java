package org.egov.inbox.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.inbox.config.InboxConfiguration;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.util.ErrorConstants;
import org.egov.inbox.util.TLConstants;
import org.egov.inbox.web.model.Inbox;
import org.egov.inbox.web.model.InboxResponse;
import org.egov.inbox.web.model.InboxSearchCriteria;
import org.egov.inbox.web.model.RequestInfoWrapper;
import org.egov.inbox.web.model.workflow.BusinessService;
import org.egov.inbox.web.model.workflow.ProcessInstance;
import org.egov.inbox.web.model.workflow.ProcessInstanceResponse;
import org.egov.inbox.web.model.workflow.ProcessInstanceSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.gson.JsonObject;
import org.springframework.web.client.RestTemplate;

import static org.egov.inbox.util.PTConstants.*;
import static org.egov.inbox.util.TLConstants.TL;

@Slf4j
@Service
public class InboxService {

	private InboxConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private ObjectMapper mapper;
	
	private WorkflowService workflowService;

	@Autowired
	private PtInboxFilterService ptInboxFilterService;

	@Autowired
	private TLInboxFilterService tlInboxFilterService;

	@Autowired
	public InboxService(InboxConfiguration config, ServiceRequestRepository serviceRequestRepository,
			ObjectMapper mapper,WorkflowService workflowService) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.mapper = mapper;
		this.mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

		this.workflowService = workflowService;
	}
	

	public InboxResponse fetchInboxData(InboxSearchCriteria criteria, RequestInfo requestInfo){
		ProcessInstanceSearchCriteria processCriteria = criteria.getProcessSearchCriteria();
		HashMap moduleSearchCriteria = criteria.getModuleSearchCriteria();
		processCriteria.setTenantId(criteria.getTenantId());
		Integer totalCount = workflowService.getProcessCount(criteria.getTenantId(), requestInfo, processCriteria);
		List<String> inputStatuses = new ArrayList<>();
		if(!CollectionUtils.isEmpty(processCriteria.getStatus()))
			inputStatuses = new ArrayList<>(processCriteria.getStatus());
		StringBuilder assigneeUuid = new StringBuilder();
		if(!ObjectUtils.isEmpty(processCriteria.getAssignee())){
			assigneeUuid = assigneeUuid.append(processCriteria.getAssignee());
		}
		// Since we want the whole status count map regardless of the status filter and assignee filter being passed
		processCriteria.setStatus(null);
		processCriteria.setAssignee(null);
		List<HashMap<String,Object>> statusCountMap = workflowService.getProcessStatusCount( requestInfo, processCriteria);
		processCriteria.setStatus(inputStatuses);
		processCriteria.setAssignee(assigneeUuid.toString());
		List<String> businessServiceName = processCriteria.getBusinessService();
		List<Inbox> inboxes = new ArrayList<Inbox>();
		InboxResponse response = new InboxResponse();
		JSONArray businessObjects = null;
		//Map<String,String> srvMap = (Map<String, String>) config.getServiceSearchMapping().get(businessServiceName.get(0));
		Map<String,String> srvMap = fetchAppropriateServiceMap(businessServiceName);
		if(CollectionUtils.isEmpty(businessServiceName)) {
			throw new CustomException(ErrorConstants.MODULE_SEARCH_INVLAID,"Bussiness Service is mandatory for module search");
		}
		if( !CollectionUtils.isEmpty(moduleSearchCriteria)) {
			moduleSearchCriteria.put("tenantId", criteria.getTenantId());
			moduleSearchCriteria.put("offset", criteria.getOffset());
			moduleSearchCriteria.put("limit", criteria.getLimit());
			List<BusinessService> bussinessSrvs = new ArrayList<BusinessService>();
			for(String businessSrv : businessServiceName) {
				BusinessService businessService = workflowService.getBusinessService(criteria.getTenantId(), requestInfo, businessSrv);
				bussinessSrvs.add(businessService);
			}
			HashMap<String,String> StatusIdNameMap = workflowService.getActionableStatusesForRole(requestInfo, bussinessSrvs, processCriteria);
			String applicationStatusParam = srvMap.get("applsStatusParam");
			String businessIdParam = srvMap.get("businessIdProperty");
			if(StringUtils.isEmpty(applicationStatusParam)) {
				applicationStatusParam ="applicationStatus";
			}
			List<String> crtieriaStatuses = new ArrayList<String>();
//			if(!CollectionUtils.isEmpty((Collection<String>) moduleSearchCriteria.get(applicationStatusParam))) {
//				//crtieriaStatuses = (List<String>) moduleSearchCriteria.get(applicationStatusParam);
//			}else {
			if(StatusIdNameMap.values().size() >0) {
				if(!CollectionUtils.isEmpty(processCriteria.getStatus())) {
					List<String> statuses = new ArrayList<String>();
					processCriteria.getStatus().forEach(status->{
						statuses.add(StatusIdNameMap.get(status));
					});
					moduleSearchCriteria.put(applicationStatusParam, StringUtils.arrayToDelimitedString(statuses.toArray(),","));
				}else {
					moduleSearchCriteria.put(applicationStatusParam, StringUtils.arrayToDelimitedString( StatusIdNameMap.values().toArray(),","));
				}
				
				
			}
				
//			}
			// Redirect request to searcher in case of PT to fetch acknowledgement IDS
			Boolean isSearchResultEmpty = false;
			List<String> businessKeys = new ArrayList<>();
			if(!ObjectUtils.isEmpty(processCriteria.getModuleName()) && processCriteria.getModuleName().equals(PT)) {
				totalCount = ptInboxFilterService.fetchAcknowledgementIdsCountFromSearcher(criteria, StatusIdNameMap, requestInfo);
				List<String> acknowledgementNumbers = ptInboxFilterService.fetchAcknowledgementIdsFromSearcher(criteria, StatusIdNameMap, requestInfo);
				if(!CollectionUtils.isEmpty(acknowledgementNumbers)) {
					moduleSearchCriteria.put(ACKNOWLEDGEMENT_IDS_PARAM, acknowledgementNumbers);
					businessKeys.addAll(acknowledgementNumbers);
					moduleSearchCriteria.remove(LOCALITY_PARAM);
					moduleSearchCriteria.remove(OFFSET_PARAM);
				}else{
					isSearchResultEmpty = true;
				}
			}
			if(!ObjectUtils.isEmpty(processCriteria.getModuleName()) && processCriteria.getModuleName().equals(TL)) {
				totalCount = tlInboxFilterService.fetchApplicationCountFromSearcher(criteria, StatusIdNameMap, requestInfo);
				List<String> applicationNumbers = tlInboxFilterService.fetchApplicationNumbersFromSearcher(criteria, StatusIdNameMap, requestInfo);
				if(!CollectionUtils.isEmpty(applicationNumbers)) {
					moduleSearchCriteria.put(APPLICATION_NUMBER_PARAM, applicationNumbers);
					businessKeys.addAll(applicationNumbers);
					moduleSearchCriteria.remove(TLConstants.STATUS_PARAM);
					moduleSearchCriteria.remove(LOCALITY_PARAM);
					moduleSearchCriteria.remove(OFFSET_PARAM);
				}else{
					isSearchResultEmpty = true;
				}
			}
			/*if(!ObjectUtils.isEmpty(processCriteria.getModuleName()) && processCriteria.getModuleName().equals(PT)){
				Boolean isMobileNumberPresent = false;
				if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)){
					isMobileNumberPresent = true;
				}
				Boolean isUserPresentForGivenMobileNumber = false;
				if(isMobileNumberPresent) {
					String tenantId = criteria.getTenantId();
					String mobileNumber = (String) moduleSearchCriteria.get(MOBILE_NUMBER_PARAM);
					String userUUID = fetchUserUUID(mobileNumber, requestInfo, tenantId);
				 	isUserPresentForGivenMobileNumber = ObjectUtils.isEmpty(userUUID) ? true : false;
				}
				if(isMobileNumberPresent && isUserPresentForGivenMobileNumber){
					isSearchResultEmpty = true;
				}

				if(!isSearchResultEmpty){
					Object result = null;

					Map<String, Object> searcherRequest = new HashMap<>();
					Map<String, Object> searchCriteria = new HashMap<>();

					searchCriteria.put(TENANT_ID_PARAM,criteria.getTenantId());

					// Accomodating module search criteria in searcher request
					if(moduleSearchCriteria.containsKey(MOBILE_NUMBER_PARAM)){
						searchCriteria.put(MOBILE_NUMBER_PARAM, moduleSearchCriteria.get(MOBILE_NUMBER_PARAM));
					}
					if(moduleSearchCriteria.containsKey(LOCALITY_PARAM)){
						searchCriteria.put(LOCALITY_PARAM, moduleSearchCriteria.get(LOCALITY_PARAM));
					}
					if(moduleSearchCriteria.containsKey(PROPERTY_ID_PARAM)){
						searchCriteria.put(PROPERTY_ID_PARAM, moduleSearchCriteria.get(PROPERTY_ID_PARAM));
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

					searcherRequest.put(REQUESTINFO_PARAM, requestInfo);
					searcherRequest.put(SEARCH_CRITERIA_PARAM, searchCriteria);

					result = restTemplate.postForObject(PT_INBOX_SEARCHER_URL, searcherRequest, Map.class);

					List<String> acknowledgementNumbers = JsonPath.read(result, "$.Properties.*.acknowldgementnumber");

					if(!CollectionUtils.isEmpty(acknowledgementNumbers)) {
						moduleSearchCriteria.put(ACKNOWLEDGEMENT_IDS_PARAM, acknowledgementNumbers);
						moduleSearchCriteria.remove(OFFSET_PARAM);
						moduleSearchCriteria.remove(LIMIT_PARAM);
					}else{
						isSearchResultEmpty = true;
					}
				}
			}
			*/
			businessObjects = new JSONArray();
			if(!isSearchResultEmpty) {
				businessObjects = fetchModuleObjects(moduleSearchCriteria, businessServiceName, criteria.getTenantId(), requestInfo, srvMap);
			}
			Map<String, Object> businessMap = StreamSupport.stream(businessObjects.spliterator(), false).collect(Collectors.toMap(s1 -> ((JSONObject) s1).get(businessIdParam).toString(),
                    s1 -> s1));
			ArrayList businessIds = new ArrayList();
			businessIds.addAll( businessMap.keySet());
			processCriteria.setBusinessIds(businessIds);
			//processCriteria.setOffset(criteria.getOffset());
			//processCriteria.setLimit(criteria.getLimit());
			processCriteria.setIsProcessCountCall(false);
			
			ProcessInstanceResponse processInstanceResponse = workflowService.getProcessInstance(processCriteria, requestInfo);
			List<ProcessInstance> processInstances = processInstanceResponse.getProcessInstances();
			Map<String, ProcessInstance> processInstanceMap = processInstances.stream().collect(  Collectors.toMap(ProcessInstance::getBusinessId, Function.identity()));
			if(businessObjects.length() >0 && processInstances.size() > 0) {
				if(CollectionUtils.isEmpty(businessKeys)) {
					businessMap.keySet().forEach(busiessKey -> {
						Inbox inbox = new Inbox();
						inbox.setProcessInstance(processInstanceMap.get(busiessKey));
						inbox.setBusinessObject(toMap((JSONObject) businessMap.get(busiessKey)));
						inboxes.add(inbox);
					});
				}else{
					businessKeys.forEach(busiessKey -> {
						Inbox inbox = new Inbox();
						inbox.setProcessInstance(processInstanceMap.get(busiessKey));
						inbox.setBusinessObject(toMap((JSONObject) businessMap.get(busiessKey)));
						inboxes.add(inbox);
					});
				}
			}
		}else {
			processCriteria.setOffset(criteria.getOffset());
			processCriteria.setLimit(criteria.getLimit());
			
			ProcessInstanceResponse processInstanceResponse = workflowService.getProcessInstance(processCriteria, requestInfo);
			List<ProcessInstance> processInstances = processInstanceResponse.getProcessInstances();
			HashMap<String,List<String>> businessSrvIdsMap = new HashMap<String, List<String>>();
			Map<String, ProcessInstance> processInstanceMap = processInstances.stream().collect(  Collectors.toMap(ProcessInstance::getBusinessId, Function.identity()));
			moduleSearchCriteria = new HashMap<String,String>();
			if(CollectionUtils.isEmpty(srvMap) ) {
				throw new CustomException(ErrorConstants.INVALID_MODULE,"config not found for the businessService : " + businessServiceName );
			}
			String businessIdParam = srvMap.get("businessIdProperty");
			moduleSearchCriteria.put(srvMap.get("applNosParam"),StringUtils.arrayToDelimitedString( processInstanceMap.keySet().toArray(),","));
			moduleSearchCriteria.put("tenantId", criteria.getTenantId());
			//moduleSearchCriteria.put("offset", criteria.getOffset());
			moduleSearchCriteria.put("limit", -1);
			businessObjects = fetchModuleObjects(moduleSearchCriteria,businessServiceName,criteria.getTenantId(),requestInfo,srvMap);
			Map<String, Object> businessMap = StreamSupport.stream(businessObjects.spliterator(), false).collect(Collectors.toMap(s1 -> ((JSONObject) s1).get(businessIdParam).toString(),
                    s1 -> s1));
			
			if(businessObjects.length() >0 && processInstances.size() > 0) {
				processInstanceMap.keySet().forEach(pinstance ->{
					Inbox inbox = new Inbox();
					inbox.setProcessInstance(processInstanceMap.get(pinstance));
					inbox.setBusinessObject(toMap((JSONObject) businessMap.get(pinstance)));
					inboxes.add(inbox);
				});
			}
			
		}
		response.setTotalCount(totalCount);
		response.setStatusMap(statusCountMap);
		response.setItems(inboxes);
		return response; 
	}

/*	private String fetchUserUUID(String mobileNumber, RequestInfo requestInfo, String tenantId) {
		StringBuilder uri = new StringBuilder();
		uri.append(userHost).append(userSearchEndpoint);
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		userSearchRequest.put("userName", mobileNumber);
		String uuid = "";
		try {
			Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
			if(null != user) {
				uuid = JsonPath.read(user, "$.user[0].uuid");
			}else {
				log.error("Service returned null while fetching user for username - " + mobileNumber);
			}
		}catch(Exception e) {
			log.error("Exception while fetching user for username - " + mobileNumber);
			log.error("Exception trace: ", e);
		}
		return uuid;
	}
*/

	private Map<String, String> fetchAppropriateServiceMap(List<String> businessServiceName) {
		StringBuilder appropriateKey = new StringBuilder();
		for(String businessServiceKeys : config.getServiceSearchMapping().keySet()){
			if(businessServiceKeys.contains(businessServiceName.get(0))){
				appropriateKey.append(businessServiceKeys);
				break;
			}
		}
		if(ObjectUtils.isEmpty(appropriateKey)){
			throw new CustomException("EG_INBOX_SEARCH_ERROR", "Inbox service is not configured for the provided business services");
		}
		for(String inputBusinessService : businessServiceName){
			if(!appropriateKey.toString().contains(inputBusinessService)){
				throw new CustomException("EG_INBOX_SEARCH_ERROR", "Cross module search is NOT allowed.");
			}
		}
		return config.getServiceSearchMapping().get(appropriateKey.toString());
	}

	private JSONArray fetchModuleObjects(HashMap moduleSearchCriteria, List<String> businessServiceName,String tenantId,RequestInfo requestInfo,Map<String,String> srvMap) {
		JSONArray resutls = null;
		if(CollectionUtils.isEmpty(srvMap) || StringUtils.isEmpty(srvMap.get("searchPath"))) {
			throw new CustomException(ErrorConstants.INVALID_MODULE_SEARCH_PATH,"search path not configured for the businessService : " + businessServiceName );
		}
		StringBuilder url = new StringBuilder(srvMap.get("searchPath"));
		url.append("?tenantId=").append(tenantId);
		Set<String> searchParams = moduleSearchCriteria.keySet();
		searchParams.forEach((param)->{
			if(!param.equalsIgnoreCase("tenantId")) {
				if(moduleSearchCriteria.get(param) instanceof Collection){
					url.append("&").append(param).append("=");
					url.append(StringUtils.arrayToDelimitedString(((Collection<?>) moduleSearchCriteria.get(param)).toArray(), ","));
				} else {
					url.append("&").append(param).append("=").append(moduleSearchCriteria.get(param).toString());
				}
			}
		});
//		url.append("&limit=10&offset=0");
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		LinkedHashMap responseMap;
		try {
			responseMap = mapper.convertValue(result, LinkedHashMap.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(ErrorConstants.PARSING_ERROR, "Failed to parse response of ProcessInstance Count");
		}
		JSONObject jsonObject = new JSONObject(responseMap);
		try {
			resutls = (JSONArray) jsonObject.getJSONArray(srvMap.get("dataRoot"));
		}catch(Exception e) {
			throw new CustomException(ErrorConstants.INVALID_MODULE_DATA," search api could not find data in dataroot " + srvMap.get("dataRoot") );
		}
		return resutls;
	}
	
	public static Map<String, Object> toMap(JSONObject object) throws JSONException {
	    Map<String, Object> map = new HashMap<String, Object>();

	    if(object == null) {
	    	return map;
	    }
	    Iterator<String> keysItr = object.keys();
	    while(keysItr.hasNext()) {
	        String key = keysItr.next();
	        Object value = object.get(key);

	        if(value instanceof JSONArray) {
	            value = toList((JSONArray) value);
	        }

	        else if(value instanceof JSONObject) {
	            value = toMap((JSONObject) value);
	        }
	        map.put(key, value);
	    }
	    return map;
	}
	
	public static List<Object> toList(JSONArray array) throws JSONException {
	    List<Object> list = new ArrayList<Object>();
	    for(int i = 0; i < array.length(); i++) {
	        Object value = array.get(i);
	        if(value instanceof JSONArray) {
	            value = toList((JSONArray) value);
	        }

	        else if(value instanceof JSONObject) {
	            value = toMap((JSONObject) value);
	        }
	        list.add(value);
	    }
	    return list;
	  }
	
}
