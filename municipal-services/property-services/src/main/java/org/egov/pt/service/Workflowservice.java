package org.egov.pt.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.BusinessServiceResponse;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.models.workflow.ProcessInstanceResponse;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class Workflowservice {

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
	 * @param PropertyRequest
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
		Object result = restRepo.fetchResult(url, requestInfoWrapper);
		BusinessServiceResponse response = null;
		try {
			response = mapper.convertValue(result, BusinessServiceResponse.class);
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

}