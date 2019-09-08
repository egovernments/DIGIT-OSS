package org.egov.wf.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.wf.web.models.*;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;

import static org.egov.wf.util.WorkflowConstants.*;


@Component
public class WorkflowUtil {

    private ObjectMapper mapper;


    @Autowired
    public WorkflowUtil(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    /**
     * Method to return auditDetails for create/update flows
     * @param by The uuid of the user sending the request
     * @param isCreate Flag to determine if the call is for create or update
     * @return AuditDetails The auditdetails of the request
     */
    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }


    /**
     * Checks if the user has role allowed for the action
     * @param userRoles The roles available with the user
     * @param actionRoles The roles for which action is allowed
     * @return True if user can perform the action else false
     */
    public Boolean isRoleAvailable(List<Role> userRoles, List<String> actionRoles){
        Boolean flag = false;
 //       List<String> allowedRoles = Arrays.asList(actionRoles.get(0).split(","));
        for(Role role : userRoles) {
            if (actionRoles.contains(role.getCode()) || actionRoles.contains("*")) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**
     *  Fetches roles of all the actions in the businessService
     * @return All roles in the business service
     */
    public List<String> rolesAllowedInService(BusinessService businessService){
        List<String> roles = new LinkedList<>();
        businessService.getStates().forEach(state -> {
            if(!CollectionUtils.isEmpty(state.getActions())){
                state.getActions().forEach(action -> {
                    roles.addAll(action.getRoles());
                });
            }
        });
        return roles;
    }



    /**
     * Creates a map of status to roles who can take actions on it for all businessService
     * @param businessServices The list of businessServices
     * @return Map of status to roles which can take action on it for all businessService
     */
    public Map<String,Set<String>> getStateToRoleMap(List<BusinessService> businessServices){
        Map<String,Set<String>> stateToRolesMap = new HashMap<>();
        businessServices.forEach(businessService -> {
            for(State state : businessService.getStates()){
                HashSet<String> roles = new HashSet<>();
                if(!CollectionUtils.isEmpty(state.getActions())){
                    state.getActions().forEach(action -> {
                        roles.addAll(action.getRoles());
                    });
                }
                stateToRolesMap.put(state.getUuid(),roles);
            }
        });
        return stateToRolesMap;
    }


    /**
     * Gets the roles the user is assigned
     * @param requestInfo RequestInfo of the request
     * @return List of roles for user in the requestInfo
     */
    public List<String> getUserRoles(RequestInfo requestInfo){
        List<String> roleCodes = new LinkedList<>();
        requestInfo.getUserInfo().getRoles().forEach(role -> {
            roleCodes.add(role.getCode());
        });
        return roleCodes;
    }


    /**
     * Gets the list of status on which user from requestInfo can take action upon
     * @param requestInfo The RequestInfo Object of the request
     * @param businessServices List of all businessServices
     * @return List of status on which user from requestInfo can take action upon
     */
    public List<String> getActionableStatusesForRole(RequestInfo requestInfo, List<BusinessService> businessServices){
        Map<String,Set<String>> stateToRoleMap = getStateToRoleMap(businessServices);
        List<String> userRoleCodes = getUserRoles(requestInfo);
        List<String> actionableStatuses = new LinkedList<>();
        for(Map.Entry<String,Set<String>> entry : stateToRoleMap.entrySet()){
            if(!Collections.disjoint(userRoleCodes,entry.getValue())){
                actionableStatuses.add(entry.getKey());
            }
        }
        return actionableStatuses;
    }


    /**
     * Extracts all the roles from the state
     * @param state The state whose roles has to be extracted
     * @return Roles availaable in the states which can take action
     */
    public List<String> getAllRolesFromState(State state){
        List<Action> actions = state.getActions();
        List<String> rolesInState = new LinkedList<>();
        if(!CollectionUtils.isEmpty(actions)){
            actions.forEach(action -> {
                rolesInState.addAll(action.getRoles());
            });
        }
        return rolesInState;
    }


    /**
     * Extracts unique businessIds from list of ProcessStateAndAction
     * @param processStateAndActions List of ProcessStateAndAction whose businessIds are to be fetched
     * @return list of businessId
     */
    public Set<String> getBusinessIds(List<ProcessStateAndAction> processStateAndActions){
        Set<String> businessIds = new HashSet<>();
        if(CollectionUtils.isEmpty(processStateAndActions))
            return businessIds;
        processStateAndActions.forEach(processStateAndAction -> {
            businessIds.add(processStateAndAction.getProcessInstanceFromRequest().getBusinessId());
        });
        return businessIds;
    }

    /**
     * Fetches the latest processStateAndAction for the given businessId
     * @param businessId The businessId whose latest record has to be fetched
     * @param processStateAndActions The list of processStateAndAction
     * @return The lastest processStateAndAction for the given businessId
     */
    public ProcessStateAndAction getLatestProcessStateAndAction(String businessId,List<ProcessStateAndAction> processStateAndActions){
        Long maxTime = 0l;
        ProcessStateAndAction latestProcessStateAndAction = null;
        for(ProcessStateAndAction processStateAndAction:processStateAndActions) {
            if(processStateAndAction.getProcessInstanceFromRequest().getBusinessId().equalsIgnoreCase(businessId)
                    && maxTime<processStateAndAction.getProcessInstanceFromRequest().getAuditDetails().getLastModifiedTime()){
                latestProcessStateAndAction = processStateAndAction;
                maxTime = processStateAndAction.getProcessInstanceFromRequest().getAuditDetails().getLastModifiedTime();
            }
        }
        return latestProcessStateAndAction;
    }
















}
