package org.egov.noc.workflow;

import org.egov.common.contract.request.RequestInfo;
import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.repository.ServiceRequestRepository;
import org.egov.noc.web.model.Noc;
import org.egov.noc.web.model.RequestInfoWrapper;
import org.egov.noc.web.model.workflow.BusinessService;
import org.egov.noc.web.model.workflow.BusinessServiceResponse;
import org.egov.noc.web.model.workflow.State;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WorkflowService {
	
	@Autowired
	private NOCConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private ObjectMapper mapper;
	
	public BusinessService getBusinessService(Noc noc, RequestInfo requestInfo, String bussinessServiceValue) {
		StringBuilder url = getSearchURLWithParams(bussinessServiceValue, noc.getTenantId());
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result, BusinessServiceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING ERROR", "Failed to parse response");
		}
		return response.getBusinessServices().isEmpty() ? null : response.getBusinessServices().get(0);
	}
	
	private StringBuilder getSearchURLWithParams(String bussinessServiceValue, String tenantId) {
        StringBuilder url = new StringBuilder(config.getWfHost());
        url.append(config.getWfBusinessServiceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessServices=");
        url.append(bussinessServiceValue);
        return url;
    }
	
	public State getCurrentState(String status, BusinessService businessService) {
		for (State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state;
		}
		return null;
	}
	
	public Boolean isStateUpdatable(String status, BusinessService businessService) {
		for (State state : businessService.getStates()) {
			if (state.getApplicationStatus() != null
					&& state.getApplicationStatus().equalsIgnoreCase(status.toString()))
				return state.getIsStateUpdatable();
		}
		return Boolean.FALSE;
	}
	
}