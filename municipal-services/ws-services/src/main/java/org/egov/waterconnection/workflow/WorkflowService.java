package org.egov.waterconnection.workflow;

import java.math.BigDecimal;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.kafka.common.protocol.types.Field;

import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.RequestInfoWrapper;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.workflow.BusinessService;
import org.egov.waterconnection.web.models.workflow.BusinessServiceResponse;
import org.egov.waterconnection.web.models.workflow.ProcessInstance;
import org.egov.waterconnection.web.models.workflow.ProcessInstanceResponse;
import org.egov.waterconnection.web.models.workflow.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.CollectionUtils;

import static org.egov.waterconnection.constants.WCConstants.WNS_OWNER_ENCRYPTION_MODEL;

@Service
public class WorkflowService {

	@Autowired
	private WSConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	/**
	 * Get the workflow-config for the given tenant
	 * 
	 * @param tenantId
	 *            The tenantId for which businessService is requested
	 * @param requestInfo
	 *            The RequestInfo object of the request
	 * @return BusinessService for the the given tenantId
	 */
	public BusinessService getBusinessService(String tenantId, RequestInfo requestInfo, String businessServiceName) {
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(getSearchURLWithParams(tenantId, businessServiceName),
				requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result, BusinessServiceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING_ERROR", "Failed to parse response of calculate");
		}
		return response.getBusinessServices().get(0);
	}

	/**
	 * Creates url for search based on given tenantId
	 *
	 * @param tenantId
	 *            The tenantId for which url is generated
	 * @return The search url
	 */
	private StringBuilder getSearchURLWithParams(String tenantId, String businessServiceName) {
		StringBuilder url = new StringBuilder(config.getWfHost());
		url.append(config.getWfBusinessServiceSearchPath());
		url.append("?tenantId=");
		url.append(tenantId);
		url.append("&businessServices=");
		url.append(businessServiceName);
		return url;
	}

	/**
	 * Returns boolean value to specifying if the state is updatable
	 * 
	 * @param stateCode
	 *            The stateCode of the license
	 * @param businessService
	 *            The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public Boolean isStateUpdatable(String stateCode, BusinessService businessService) {
		for (State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null && state.getApplicationStatus().equalsIgnoreCase(stateCode))
				return state.getIsStateUpdatable();
		}
		return null;
	}

	/**
	 * Return sla based on state code
	 * 
	 * @param tenantId
	 * @param requestInfo
	 * @param stateCode
	 * @return no of days for sla
	 */
	public BigDecimal getSlaForState(String tenantId, RequestInfo requestInfo, String stateCode,
			String businessServiceName) {
		BusinessService businessService = getBusinessService(tenantId, requestInfo, businessServiceName);
		return new BigDecimal(businessService.getStates().stream().filter(state -> state.getApplicationStatus() != null
				&& state.getApplicationStatus().equalsIgnoreCase(stateCode)).map(state -> {
					if (state.getSla() == null) {
						return 0l;
					}
					return state.getSla();
				}).findFirst().orElse(0l));
	}

	/**
	 * Get the workflow processInstance for the given tenant
	 * 
	 * @param tenantId
	 *            The tenantId for which businessService is requested
	 * @param requestInfo
	 *            The RequestInfo object of the request
	 * @return BusinessService for the the given tenantId
	 */
	public Map<String, ProcessInstance> getProcessInstances(RequestInfo requestInfo, Set<String> applicationNumbers, String tenantId,
															String businessServiceName) {
		StringBuilder url = getProcessInstanceSearchURL(tenantId, applicationNumbers, businessServiceName);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		Map<String, ProcessInstance> processInstanceMap = new HashMap<>();
		PlainAccessRequest apiPlainAccessRequest = requestInfo.getPlainAccessRequest();
		/* Creating a PlainAccessRequest object to get unmasked mobileNumber for Assignee */
		List<String> plainRequestFieldsList = new ArrayList<String>() {{
			add("mobileNumber");
		}};

		ProcessInstanceResponse response = null;
		try {
			response = mapper.convertValue(result, ProcessInstanceResponse.class);
			List<ProcessInstance> processInstanceList = new ArrayList<>();
			for (ProcessInstance processInstance : response.getProcessInstances()) {
				if (!ObjectUtils.isEmpty(processInstance)) {
					if (processInstance.getAssignes() != null) {
						PlainAccessRequest plainAccessRequest = PlainAccessRequest.builder().recordId(processInstance.getAssignes().get(0).getUuid())
								.plainRequestFields(plainRequestFieldsList).build();

						requestInfo.setPlainAccessRequest(plainAccessRequest);
						requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
					}
				}
				Object resultNew = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
				response = mapper.convertValue(resultNew, ProcessInstanceResponse.class);
				//Re-setting the original PlainAccessRequest object that came from api request
				requestInfo.setPlainAccessRequest(apiPlainAccessRequest);

				Optional<ProcessInstance> processInstances = Optional.ofNullable(processInstance);
				if (!ObjectUtils.isEmpty(response.getProcessInstances())) {
					if (processInstances.get().getAssignes() != null) {
						/* encrypt here */
						processInstances.get().setAssignes((List<org.egov.common.contract.request.User>) encryptionDecryptionUtil.encryptObject(processInstances.get().getAssignes(), WNS_OWNER_ENCRYPTION_MODEL, User.class));

						/* decrypt here */
						processInstances.get().setAssignes(encryptionDecryptionUtil.decryptObject(processInstances.get().getAssignes(), WNS_OWNER_ENCRYPTION_MODEL, User.class, requestInfo));
					}
				}
				processInstanceMap.put(processInstance.getBusinessId(), processInstance);
			}
			/*processInstanceMap = processInstances.stream()
					.collect(Collectors.toMap(ProcessInstance::getBusinessId, Function.identity()));*/
			return processInstanceMap;
		} catch(IllegalArgumentException e){
			throw new CustomException("PARSING_ERROR", "Failed to parse response of process instance");
		}
	}

	/**
	 * 
	 * @param tenantId
	 * @param applicationNo
	 * @return
	 */
	private StringBuilder getProcessInstanceSearchURL(String tenantId, String applicationNo,
			String businessServiceName) {
		StringBuilder url = new StringBuilder(config.getWfHost());
		url.append(config.getWfProcessSearchPath());
		url.append("?tenantId=");
		url.append(tenantId);
		url.append("&businessServices=");
		url.append(businessServiceName);
		url.append("&businessIds=");
		url.append(applicationNo);
		return url;
	}

	/**
	 * 
	 * @param requestInfo
	 * @param applicationNo
	 * @return
	 */
	public String getApplicationStatus(RequestInfo requestInfo, String applicationNo, String tenantId,
			String businessServiceName) {
		Map<String, ProcessInstance> processInstanceMap = (Map<String, ProcessInstance>) getProcessInstances(requestInfo, Collections.singleton(applicationNo), tenantId, businessServiceName);
		if(!ObjectUtils.isEmpty(processInstanceMap.get(applicationNo))) {
			return processInstanceMap.get(applicationNo).getState().getApplicationStatus();
		}
		return null;
	}

	private List<ProcessInstance> getProcessInstance(RequestInfo requestInfo, Set<String> applicationNos,
			String tenantId, String businessServiceValue) {
		StringBuilder url = getProcessInstanceSearchURL(tenantId, applicationNos, businessServiceValue);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		ProcessInstanceResponse response = null;
		try {
			response = mapper.convertValue(result, ProcessInstanceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING ERROR", "Failed to parse response of process instance");
		}
		return response.getProcessInstances();
	}

	private StringBuilder getProcessInstanceSearchURL(String tenantId, Set<String> applicationNos,
			String businessServiceValue) {
		StringBuilder url = new StringBuilder(config.getWfHost());
		url.append(config.getWfProcessSearchPath());
		url.append("?tenantId=");
		url.append(tenantId);
		if(businessServiceValue!=null) {
			url.append("&businessServices=");
			url.append(businessServiceValue);
		}
		url.append("&businessIds=");
		for (String appNo : applicationNos) {
			url.append(appNo).append(",");
		}
		url.setLength(url.length() - 1);
		return url;
	}

	/**
	 *
	 * @param waterConnectionList
	 * @param requestInfo
	 * @param tenantId
	 */
	public void validateInProgressWF(List<WaterConnection> waterConnectionList, RequestInfo requestInfo,
			String tenantId) {
		Set<String> applicationNos = waterConnectionList.stream().map(WaterConnection::getApplicationNo)
				.collect(Collectors.toSet());
		List<ProcessInstance> processInstanceList = getProcessInstance(requestInfo, applicationNos, tenantId,
				config.getModifyWSBusinessServiceName());
		processInstanceList.forEach(processInstance -> {
			if (!processInstance.getState().getIsTerminateState()) {
				throw new CustomException("WS_APP_EXIST_IN_WF",
						"Application already exist in WorkFlow. Cannot modify connection.");
			}
		});
	}

}
