package org.egov.pt.service;

import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.BusinessServiceResponse;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.models.workflow.ProcessInstanceResponse;
import org.egov.pt.models.workflow.State;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WorkflowService {

	@Autowired
	private PropertyConfiguration configs;

	@Autowired
	private ServiceRequestRepository restRepo;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private PropertyUtil utils;
	
	@Autowired
	ServiceRequestRepository serviceRequestRepository;
	

	/**
	 * Method to integrate with workflow
	 *
	 * takes the trade-license request as parameter constructs the work-flow request
	 *
	 * and sets the resultant status from wf-response back to trade-license object
	 *
	 */
	public State callWorkFlow(ProcessInstanceRequest workflowReq) {

		ProcessInstanceResponse response = null;
		StringBuilder url = new StringBuilder(configs.getWfHost().concat(configs.getWfTransitionPath()));
		Optional<Object> optional = serviceRequestRepository.fetchResult(url, workflowReq);
		response = mapper.convertValue(optional.get(), ProcessInstanceResponse.class);
		return response.getProcessInstances().get(0).getState();
	}
	
	
    /**
     * Get the workflow config for the given tenant
     * @param tenantId    The tenantId for which businessService is requested
     * @param requestInfo The RequestInfo object of the request
     * @return BusinessService for the the given tenantId
     */
    public BusinessService getBusinessService(String tenantId, String businessService, RequestInfo requestInfo) {

		StringBuilder url = getSearchURLWithParams(tenantId, businessService);
		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
		Optional<Object> result = restRepo.fetchResult(url, requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result.get(), BusinessServiceResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING ERROR", "Failed to parse response of workflow business service search");
		}

		if(CollectionUtils.isEmpty(response.getBusinessServices()))
			throw new CustomException("BUSINESSSERVICE_NOT_FOUND","The businessService "+businessService+" is not found");

		return response.getBusinessServices().get(0);
	}
    
    /**
     * Creates url for search based on given tenantId
     *
     * @param tenantId The tenantId for which url is generated
     * @return The search url
     */
    private StringBuilder getSearchURLWithParams(String tenantId, String businessService) {
    	
        StringBuilder url = new StringBuilder(configs.getWfHost());
        url.append(configs.getWfBusinessServiceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessServices=");
        url.append(businessService);
        return url;
    }
    
	/**
	 * method to prepare process instance request 
	 * and assign status back to property
	 * 
	 * @param request
	 */
	public State updateWorkflow(PropertyRequest request, CreationReason creationReasonForWorkflow) {

		Property property = request.getProperty();
		
		ProcessInstanceRequest workflowReq = utils.getWfForPropertyRegistry(request, creationReasonForWorkflow);
		State state = callWorkFlow(workflowReq);
		
		if (state.getApplicationStatus().equalsIgnoreCase(configs.getWfStatusActive()) && property.getPropertyId() == null) {
			
			String pId = utils.getIdList(request.getRequestInfo(), property.getTenantId(), configs.getPropertyIdGenName(), configs.getPropertyIdGenFormat(), 1).get(0);
			request.getProperty().setPropertyId(pId);
		}
		
		request.getProperty().setStatus(Status.fromValue(state.getApplicationStatus()));
		request.getProperty().getWorkflow().setState(state);
		return state;
	}


	/**
	 * Returns boolean value to specifying if the state is updatable
	 * @param stateCode The stateCode of the license
	 * @param businessService The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public Boolean isStateUpdatable(String stateCode, BusinessService businessService){
		for(State state : businessService.getStates()){
			if(state.getState()!=null && state.getState().equalsIgnoreCase(stateCode))
				return state.getIsStateUpdatable();
		}
		return null;
	}



	/**
	 * Creates url for searching processInstance
	 *
	 * @return The search url
	 */
	private StringBuilder getWorkflowSearchURLWithParams(String tenantId, String businessId) {

		StringBuilder url = new StringBuilder(configs.getWfHost());
		url.append(configs.getWfProcessInstanceSearchPath());
		url.append("?tenantId=");
		url.append(tenantId);
		url.append("&businessIds=");
		url.append(businessId);
		return url;
	}


	/**
	 * Fetches the workflow object for the given assessment
	 * @return
	 */
	public State getCurrentState(RequestInfo requestInfo, String tenantId, String businessId) {

		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

		StringBuilder url = getWorkflowSearchURLWithParams(tenantId, businessId);

		Optional<Object> res = restRepo.fetchResult(url, requestInfoWrapper);
		ProcessInstanceResponse response = null;

		try{
			response = mapper.convertValue(res.get(), ProcessInstanceResponse.class);
		}
		catch (Exception e){
			throw new CustomException("PARSING_ERROR","Failed to parse workflow search response");
		}

		if(response!=null && !CollectionUtils.isEmpty(response.getProcessInstances()) && response.getProcessInstances().get(0)!=null)
			return response.getProcessInstances().get(0).getState();

		return null;
	}


}