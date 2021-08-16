package org.egov.wf.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.egov.wf.util.WorkflowConstants.UUID_REGEX;

@Service
public class BusinessServiceEnrichment {


    private WorkflowUtil util;


    @Autowired
    public BusinessServiceEnrichment(WorkflowUtil util) {
        this.util = util;
    }


    /**
     * Enriches the incoming list of businessServices
     * @param request The BusinessService request to be enriched
     */
    public void enrichCreateBusinessService(BusinessServiceRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        List<BusinessService> businessServices = request.getBusinessServices();
        AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(),true);
        businessServices.forEach(businessService -> {

            String tenantId = businessService.getTenantId();
            businessService.setUuid(UUID.randomUUID().toString());
            businessService.setAuditDetails(auditDetails);
            businessService.getStates().forEach(state -> {
                state.setAuditDetails(auditDetails);
                state.setUuid(UUID.randomUUID().toString());
                state.setTenantId(tenantId);
                if(!CollectionUtils.isEmpty(state.getActions()))
                    state.getActions().forEach(action -> {
                        action.setAuditDetails(auditDetails);
                        action.setUuid(UUID.randomUUID().toString());
                        action.setCurrentState(state.getUuid());
                        action.setTenantId(tenantId);
                        action.setActive(true);
                    });
            });
            enrichNextState(businessService);
        });
    }

    /**
     * Enriches update request
     * @param request The update request
     */
    public void enrichUpdateBusinessService(BusinessServiceRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        List<BusinessService> businessServices = request.getBusinessServices();
        AuditDetails audit = util.getAuditDetails(requestInfo.getUserInfo().getUuid(),true);
        /*
         * Loop over all states and if any new state is encountered enrich it
         * */

        businessServices.forEach(businessService -> {
            businessService.setAuditDetails(audit);
            businessService.getStates().forEach(state -> {
                if (state.getUuid() == null) {
                    state.setAuditDetails(audit);
                    state.setUuid(UUID.randomUUID().toString());
                    state.setTenantId(businessService.getTenantId());
                }
                else state.setAuditDetails(audit);
            });
        });

        /*
         * Extra loop is used as top loop needs to be completed first so that all new
         * states are assigned uuid which are required in the nextState map to assign
         * state uuid in the field nextState
         * */
        businessServices.forEach(businessService -> {
            businessService.getStates().forEach(state -> {
                if(!CollectionUtils.isEmpty(state.getActions()))
                    state.getActions().forEach(action -> {
                        if(action.getUuid()==null){
                            action.setAuditDetails(audit);
                            action.setUuid(UUID.randomUUID().toString());
                            action.setCurrentState(state.getUuid());
                            action.setTenantId(state.getTenantId());
                        }
                        else action.setAuditDetails(audit);
                    });
            });
            enrichNextState(businessService);
        });
    }



    /**
     * Enriches the nextState varibale in BusinessService
     * @param businessService The businessService whose action objects are to be enriched
     */
    private void enrichNextState(BusinessService businessService){
        Map<String,String> statusToUuidMap = new HashMap<>();
        businessService.getStates().forEach(state -> {
            statusToUuidMap.put(state.getState(),state.getUuid());
        });
        HashMap<String,String> errorMap = new HashMap<>();
        businessService.getStates().forEach(state -> {
            if(!CollectionUtils.isEmpty(state.getActions())){
                state.getActions().forEach(action -> {
                    if (!action.getNextState().matches(UUID_REGEX) && statusToUuidMap.containsKey(action.getNextState()))
                        action.setNextState(statusToUuidMap.get(action.getNextState()));
                    else if (!action.getNextState().matches(UUID_REGEX) && !statusToUuidMap.containsKey(action.getNextState()))
                        errorMap.put("INVALID NEXTSTATE","The state with name: "+action.getNextState()+ " does not exist in config");
                });
            }
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Sets tenantId when stateLevel flag is on
     * @param tenantId The tenantId of the request
     * @param businessServices The businessService returned for stateLevel
     */
    public void enrichTenantIdForStateLevel(String tenantId,List<BusinessService> businessServices){
        businessServices.forEach(businessService -> {
            businessService.setTenantId(tenantId);
            businessService.getStates().forEach(state -> {
                state.setTenantId(tenantId);
                if(!CollectionUtils.isEmpty(state.getActions())){
                    state.getActions().forEach(action -> {
                        action.setTenantId(tenantId);
                    });
                }
            });
        });
    }



}
