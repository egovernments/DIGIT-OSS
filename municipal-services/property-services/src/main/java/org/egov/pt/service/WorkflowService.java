package org.egov.pt.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.workflow.*;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.Optional;

@Service
public class WorkflowService {

	@Autowired
	private RestTemplate rest;

	@Autowired
	private PropertyConfiguration configs;

	@Autowired
	private ServiceRequestRepository restRepo;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Method to integrate with workflow
	 *
	 * takes the trade-license request as parameter constructs the work-flow request
	 *
	 * and sets the resultant status from wf-response back to trade-license object
	 *
	 */
	public String callWorkFlow(ProcessInstanceRequest workflowReq) {

		ProcessInstanceResponse response = null;

		try {

			response = rest.postForObject(configs.getWfHost().concat(configs.getWfTransitionPath()), workflowReq, ProcessInstanceResponse.class);
		} catch (HttpClientErrorException ex) {

			throw new ServiceCallException(ex.getMessage());
		} catch (Exception e) {
			throw new CustomException("EG_WF_ERROR", "Exception occured while integrating with workflow : " + e.getMessage());
		}

		/*
		 * on success result from work-flow read the data and set the status back to TL
		 * object
		 */

		return response.getProcessInstances().get(0).getState().getApplicationStatus();
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
			throw new CustomException("PARSING ERROR", "Failed to parse response of calculate");
		}
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
        url.append("&businessservices=");
        url.append(businessService);
        return url;
    }
    
    /**
     * method to process requests for workflow
     * @param request
     */
    public void processWorkflowAndPersistData(PropertyRequest request, Property propertyFromDb) {

      //  Boolean isDiffOnWorkflowFields = false;

        /*
         *
         * 1. is record active or not
         *
         * 2. if inactive get workflow information
         *
         * 3. check if update is possible, if yes the do update else throw error
         *
         * 4. if record is active and changes are there , then trigger the workflow they are asking for
         * then persist the record
         *
         * 5.
         */


    }


	/**
	 * Returns boolean value to specifying if the state is updatable
	 * @param stateCode The stateCode of the license
	 * @param businessService The BusinessService of the application flow
	 * @return State object to be fetched
	 */
	public Boolean isStateUpdatable(String stateCode, BusinessService businessService){
		for(State state : businessService.getStates()){
			if(state.getApplicationStatus()!=null && state.getApplicationStatus().equalsIgnoreCase(stateCode))
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
	public String getCurrentState(RequestInfo requestInfo, Assessment assessment){

		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

		StringBuilder url = getWorkflowSearchURLWithParams(assessment.getTenantId(), assessment.getAssessmentNumber());

		Optional<Object> res = restRepo.fetchResult(url, requestInfoWrapper);
		ProcessInstanceResponse response = null;

		try{
			response = mapper.convertValue(res.get(), ProcessInstanceResponse.class);
		}
		catch (Exception e){
			throw new CustomException("PARSING_ERROR","Failed to parse workflow search response");
		}

		if(response!=null && !CollectionUtils.isEmpty(response.getProcessInstances()) && response.getProcessInstances().get(0)!=null)
			return response.getProcessInstances().get(0).getState().getState();

		return null;
	}


}