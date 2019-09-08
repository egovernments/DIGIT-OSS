package org.egov.wf.service;

import java.util.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.ProcessInstanceRequest;
import org.egov.wf.web.models.ProcessStateAndAction;
import org.egov.wf.web.models.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import static org.egov.wf.util.WorkflowConstants.UUID_REGEX;


@Service
public class EnrichmentService {


    private WorkflowUtil util;

    private UserService userService;

    private TransitionService transitionService;

    @Autowired
    public EnrichmentService(WorkflowUtil util, UserService userService,TransitionService transitionService) {
        this.util = util;
        this.userService = userService;
        this.transitionService = transitionService;
    }




    /**
     * Enriches incoming request
     * @param requestInfo The RequestInfo of the request
     * @param processStateAndActions List of ProcessStateAndAction containing ProcessInstance to be created
     */
    public void enrichProcessRequest(RequestInfo requestInfo,List<ProcessStateAndAction> processStateAndActions){
        AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(),true);
        processStateAndActions.forEach(processStateAndAction -> {
            String tenantId = processStateAndAction.getProcessInstanceFromRequest().getTenantId();
            processStateAndAction.getProcessInstanceFromRequest().setId(UUID.randomUUID().toString());
            if(processStateAndAction.getAction().getNextState().equalsIgnoreCase(processStateAndAction.getAction().getCurrentState())){
                auditDetails.setCreatedBy(processStateAndAction.getProcessInstanceFromDb().getAuditDetails().getCreatedBy());
                auditDetails.setCreatedTime(processStateAndAction.getProcessInstanceFromDb().getAuditDetails().getCreatedTime());
            }
            processStateAndAction.getProcessInstanceFromRequest().setAuditDetails(auditDetails);
            processStateAndAction.getProcessInstanceFromRequest().setAssigner(requestInfo.getUserInfo());
            if(!CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getDocuments())){
                processStateAndAction.getProcessInstanceFromRequest().getDocuments().forEach(document -> {
                    document.setAuditDetails(auditDetails);
                    document.setTenantId(tenantId);
                    document.setId(UUID.randomUUID().toString());
                });
            }
            Action action = processStateAndAction.getAction();
            Boolean isStateChanging = (action.getCurrentState().equalsIgnoreCase( action.getNextState())) ? false : true;
            if(isStateChanging)
                processStateAndAction.getProcessInstanceFromRequest().setStateSla(processStateAndAction.getResultantState().getSla());
            enrichAndUpdateSlaForTransition(processStateAndAction,isStateChanging);
            setNextActions(requestInfo,processStateAndActions,true);
        });
        enrichUsers(requestInfo,processStateAndActions);
    }





    /**
     * Enriches the processInstanceFromRequest with next possible action depending on current currentState
     * @param requestInfo The RequestInfo of the request
     * @param processStateAndActions
     */
    private void setNextActions(RequestInfo requestInfo,List<ProcessStateAndAction> processStateAndActions,Boolean isTransition){
        List<Role> roles = requestInfo.getUserInfo().getRoles();

        processStateAndActions.forEach(processStateAndAction -> {
            State state;
            if(isTransition)
             state = processStateAndAction.getResultantState();
            else state = processStateAndAction.getCurrentState();
            List<Action> nextAction = new ArrayList<>();
            if(!CollectionUtils.isEmpty( state.getActions())){
                state.getActions().forEach(action -> {
                    if(util.isRoleAvailable(roles,action.getRoles()) && !nextAction.contains(action))
                        nextAction.add(action);
                });
            }
            if(!CollectionUtils.isEmpty(nextAction))
                nextAction.sort(Comparator.comparing(Action::getAction));
            processStateAndAction.getProcessInstanceFromRequest().setNextActions(nextAction);
        });
    }

    /**
     * Enriches the assignee and assigner user object from user search response
     * @param requestInfo The RequestInfo of the request
     * @param processStateAndActions The List of ProcessStateAndAction containing processInstanceFromRequest to be enriched
     */
    public void enrichUsers(RequestInfo requestInfo,List<ProcessStateAndAction> processStateAndActions){
        List<String> uuids = new LinkedList<>();
        processStateAndActions.forEach(processStateAndAction -> {
            if(processStateAndAction.getProcessInstanceFromRequest().getAssignee()!=null)
                uuids.add(processStateAndAction.getProcessInstanceFromRequest().getAssignee().getUuid());
            uuids.add(processStateAndAction.getProcessInstanceFromRequest().getAssigner().getUuid());
        });

        Map<String,User> idToUserMap = userService.searchUser(requestInfo,uuids);
        Map<String,String> errorMap = new HashMap<>();
        processStateAndActions.forEach(processStateAndAction -> {
            User assignee=null,assigner;
            if(processStateAndAction.getProcessInstanceFromRequest().getAssignee()!=null)
                 assignee = idToUserMap.get(processStateAndAction.getProcessInstanceFromRequest().getAssignee().getUuid());
            assigner = idToUserMap.get(processStateAndAction.getProcessInstanceFromRequest().getAssigner().getUuid());
            if(processStateAndAction.getProcessInstanceFromRequest().getAssignee()!=null && assignee==null)
                errorMap.put("INVALID UUID","User not found for uuid: "+processStateAndAction.getProcessInstanceFromRequest().getAssignee().getUuid());
            if(assigner==null)
                errorMap.put("INVALID UUID","User not found for uuid: "+processStateAndAction.getProcessInstanceFromRequest().getAssigner().getUuid());
            processStateAndAction.getProcessInstanceFromRequest().setAssignee(assignee);
            processStateAndAction.getProcessInstanceFromRequest().setAssigner(assigner);
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Enriches processInstanceFromRequest from the search response
     * @param processInstances The list of processInstances from search
     */
    public void enrichUsersFromSearch(RequestInfo requestInfo,List<ProcessInstance> processInstances){
        List<String> uuids = new LinkedList<>();
        processInstances.forEach(processInstance -> {
            if(processInstance.getAssignee()!=null)
                uuids.add(processInstance.getAssignee().getUuid());
            uuids.add(processInstance.getAssigner().getUuid());
        });
        Map<String,User> idToUserMap = userService.searchUser(requestInfo,uuids);
        Map<String,String> errorMap = new HashMap<>();
        processInstances.forEach(processInstance -> {
            User assignee=null,assigner;
            if(processInstance.getAssignee()!=null)
                assignee = idToUserMap.get(processInstance.getAssignee().getUuid());
            assigner = idToUserMap.get(processInstance.getAssigner().getUuid());
            if(processInstance.getAssignee()!=null && assignee==null)
                errorMap.put("INVALID UUID","User not found for uuid: "+processInstance.getAssignee().getUuid());
            if(assigner==null)
                errorMap.put("INVALID UUID","User not found for uuid: "+processInstance.getAssigner().getUuid());
            processInstance.setAssignee(assignee);
            processInstance.setAssigner(assigner);
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    public List<ProcessStateAndAction> enrichNextActionForSearch(RequestInfo requestInfo,List<ProcessInstance> processInstances){
        List<ProcessStateAndAction> processStateAndActions = new LinkedList<>();
        List<ProcessInstanceRequest> requests = getRequestByBusinessService(new ProcessInstanceRequest(requestInfo,processInstances));
        requests.forEach(request -> {
            processStateAndActions.addAll(transitionService.getProcessStateAndActions(new ProcessInstanceRequest(requestInfo,processInstances),false));
        });
        setNextActions(requestInfo,processStateAndActions,false);
        return processStateAndActions;
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
     * Sets the businessServiceSla when the _transition api is called
     * @param processStateAndAction The processStateAndAction object of the transition request
     */
    private void enrichAndUpdateSlaForTransition(ProcessStateAndAction processStateAndAction,Boolean isStateChanging){
        if(processStateAndAction.getProcessInstanceFromDb()!=null){
            Long businesssServiceSlaRemaining = processStateAndAction.getProcessInstanceFromDb().getBusinesssServiceSla();
            Long stateSlaRemaining = processStateAndAction.getProcessInstanceFromDb().getStateSla();
            Long timeSpent = processStateAndAction.getProcessInstanceFromRequest().getAuditDetails().getLastModifiedTime()
                           - processStateAndAction.getProcessInstanceFromDb().getAuditDetails().getLastModifiedTime();
            processStateAndAction.getProcessInstanceFromRequest().setBusinesssServiceSla(businesssServiceSlaRemaining-timeSpent);
            if(!isStateChanging && stateSlaRemaining!=null)
                processStateAndAction.getProcessInstanceFromRequest().setStateSla(stateSlaRemaining-timeSpent);
        }
    }


    /**
     * Sets the businessServiceSla for search output
     * @param processInstances The list of processInstance
     */
    public void enrichAndUpdateSlaForSearch(List<ProcessInstance> processInstances){
        processInstances.forEach(processInstance -> {
            Long businessServiceSlaInDb = processInstance.getBusinesssServiceSla();
            Long stateSlaInDB = processInstance.getStateSla();
            Long timeSinceLastAction = System.currentTimeMillis() - processInstance.getAuditDetails().getLastModifiedTime();
            processInstance.setBusinesssServiceSla(businessServiceSlaInDb-timeSinceLastAction);
            if(stateSlaInDB!=null)
                processInstance.setStateSla(stateSlaInDB-timeSinceLastAction);
        });
    }


    /**
     * Groups request by businessServices and creates a list of ProcessInstanceRequest one for each businessService
     * @param request The ProcessInstanceRequest containing processInstances across multiple BusinessServices
     * @return List of ProcessInstanceRequest
     */
    private List<ProcessInstanceRequest> getRequestByBusinessService(ProcessInstanceRequest request){
        List<ProcessInstance> processInstances = request.getProcessInstances();
        RequestInfo requestInfo = request.getRequestInfo();

        Map<String,List<ProcessInstance>> tenantIdToProperties = new HashMap<>();
        if(!CollectionUtils.isEmpty(processInstances)){
            processInstances.forEach(processInstance -> {
                if(tenantIdToProperties.containsKey(processInstance.getBusinessService()))
                    tenantIdToProperties.get(processInstance.getBusinessService()).add(processInstance);
                else{
                    List<ProcessInstance> list = new ArrayList<>();
                    list.add(processInstance);
                    tenantIdToProperties.put(processInstance.getBusinessService(),list);
                }
            });
        }
        List<ProcessInstanceRequest> requests = new LinkedList<>();

        tenantIdToProperties.forEach((key,value)-> {
            requests.add(new ProcessInstanceRequest(requestInfo,value));
        });
        return requests;
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
