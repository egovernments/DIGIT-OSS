package org.egov.fsm.workflow;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.workflow.BusinessService;
import org.egov.fsm.web.model.workflow.BusinessServiceResponse;
import org.egov.fsm.web.model.workflow.ProcessInstance;
import org.egov.fsm.web.model.workflow.ProcessInstanceResponse;
import org.egov.fsm.web.model.workflow.State;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WorkflowService {

	private FSMConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private ObjectMapper mapper;

	@Autowired
	public WorkflowService(FSMConfiguration config, ServiceRequestRepository serviceRequestRepository,
			ObjectMapper mapper) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.mapper = mapper;
	}

	/**
	 * Get the workflow config for the given tenant
	 * 
	 * @param fsm
	 *            The FSM Object
	 * @param requestInfo
	 *            The RequestInfo object of the request
	 * @return BusinessService for the the given tenantId
	 */
	public BusinessService getBusinessService(FSM fsm, RequestInfo requestInfo, String businessServceName, String applicationNo) {
		StringBuilder url = getSearchURLWithParams(fsm.getTenantId(), businessServceName, applicationNo);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result, BusinessServiceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(FSMErrorConstants.PARSING_ERROR, "Failed to parse response of Workflow");
		}
		return response.getBusinessServices().get(0);
	}

	/**
	 * Get the ProcessInstance for the given Application
	 * 
	 * @param FSM
	 *            The FSM Object
	 * @param requestInfo
	 *            The RequestInfo object of the request
	 * 
	 */
	public ProcessInstance getProcessInstance(FSM fsm, RequestInfo requestInfo) {
		StringBuilder url = getSearchURLWithParams(fsm.getTenantId(), null, fsm.getApplicationNo());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		ProcessInstanceResponse response = null;
		try {
			response = mapper.convertValue(result, ProcessInstanceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(FSMErrorConstants.PARSING_ERROR, "Failed to parse response of Workflow");
		}
		return response.getProcessInstances().get(0);
	}
	/**
	 * Creates url for search based on given tenantId
	 *
	 * @param tenantId
	 *            The tenantId for which url is generated
	 * @return The search url
	 */
	private StringBuilder getSearchURLWithParams(String tenantId, String businessService, String applicationNo) {
		StringBuilder url = new StringBuilder(config.getWfHost());
		
		
		
		if (businessService != null) {
			url.append(config.getWfBusinessServiceSearchPath());
			url.append("?businessServices=");
			url.append(businessService);
		} else {
			url.append(config.getWfProcessPath());
			url.append("?businessIds=");
			url.append(applicationNo); 
		}
		
		url.append("&tenantId=");
		url.append(tenantId);
		
		return url;
	}

	/**
	 * Returns boolean value to specifying if the state is updatable
	 * 
	 * @param statusEnum
	 *            The stateCode of the fsm
	 * @param businessService
	 *            The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public Boolean isStateUpdatable(String status, BusinessService businessService) {
		for (org.egov.fsm.web.model.workflow.State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state.getIsStateUpdatable();
		}
		return Boolean.FALSE;
	}

	

	/**
	 * Returns State Obj fo the current state of the document
	 * 
	 * @param statusEnum
	 *            The stateCode of the fsm
	 * @param businessService
	 *            The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public State getCurrentStateObj(String status, BusinessService businessService) {
		for (State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state;
		}
		return null;
	}
}
