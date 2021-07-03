package org.egov.bpa.workflow;

import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.util.BPAErrorConstants;
import org.egov.bpa.web.model.BPA;
import org.egov.bpa.web.model.RequestInfoWrapper;
import org.egov.bpa.web.model.workflow.BusinessService;
import org.egov.bpa.web.model.workflow.BusinessServiceResponse;
import org.egov.bpa.web.model.workflow.State;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WorkflowService {

	private BPAConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private ObjectMapper mapper;

	@Autowired
	public WorkflowService(BPAConfiguration config, ServiceRequestRepository serviceRequestRepository,
			ObjectMapper mapper) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.mapper = mapper;
	}

	/**
	 * Get the workflow config for the given tenant
	 * 
	 * @param tenantId
	 *            The tenantId for which businessService is requested
	 * @param requestInfo
	 *            The RequestInfo object of the request
	 * @return BusinessService for the the given tenantId
	 */
	public BusinessService getBusinessService(BPA bpa, RequestInfo requestInfo, String applicationNo) {
		StringBuilder url = getSearchURLWithParams(bpa, true, null);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result, BusinessServiceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(BPAErrorConstants.PARSING_ERROR, "Failed to parse response of calculate");
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
	private StringBuilder getSearchURLWithParams(BPA bpa, boolean businessService, String applicationNo) {
		StringBuilder url = new StringBuilder(config.getWfHost());
		if (businessService) {
			url.append(config.getWfBusinessServiceSearchPath());
		} else {
			url.append(config.getWfProcessPath());
		}
		url.append("?tenantId=");
		url.append(bpa.getTenantId());
		if (businessService) {
				url.append("&businessServices=");
				url.append(bpa.getBusinessService());
		} else {
			url.append("&businessIds=");
			url.append(applicationNo);
		}
		return url;
	}

	/**
	 * Returns boolean value to specifying if the state is updatable
	 * 
	 * @param statusEnum
	 *            The stateCode of the bpa
	 * @param businessService
	 *            The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public Boolean isStateUpdatable(String status, BusinessService businessService) {
		for (org.egov.bpa.web.model.workflow.State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state.getIsStateUpdatable();
		}
		return Boolean.FALSE;
	}

	/**
	 * Returns State name fo the current state of the document
	 * 
	 * @param statusEnum
	 *            The stateCode of the bpa
	 * @param businessService
	 *            The BusinessService of the application flow
	 * @return State String to be fetched
	 */
	public String getCurrentState(String status, BusinessService businessService) {
		for (State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state.getState();
		}
		return null;
	}

	/**
	 * Returns State Obj fo the current state of the document
	 * 
	 * @param statusEnum
	 *            The stateCode of the bpa
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
