package org.egov.tl.workflow;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.RequestInfoWrapper;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.web.models.workflow.BusinessServiceResponse;
import org.egov.tl.web.models.workflow.State;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkflowService {


    private TLConfiguration config;

    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper mapper;

    @Autowired
    public WorkflowService(TLConfiguration config, ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
    }

    /**
     * Get the workflow config for the given tenant
     * @param tenantId    The tenantId for which businessService is requested
     * @param requestInfo The RequestInfo object of the request
     * @return BusinessService for the the given tenantId
     */
    public BusinessService getBusinessService(String tenantId, RequestInfo requestInfo,String businessServiceName) {

        StringBuilder url = getSearchURLWithParams(tenantId,businessServiceName);
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
        Object result = serviceRequestRepository.fetchResult(url, requestInfoWrapper);
        BusinessServiceResponse response = null;
        try {
            response = mapper.convertValue(result,BusinessServiceResponse.class);
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
    private StringBuilder getSearchURLWithParams(String tenantId,String businessServiceName) {
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




}
