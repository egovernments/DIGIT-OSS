package org.egov.wf.validator;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.BusinessUtil;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.wf.util.WorkflowConstants.*;


@Component
public class WorkflowValidator {


    private WorkflowUtil util;

    private BusinessUtil businessUtil;


    @Autowired
    public WorkflowValidator(WorkflowUtil util, BusinessUtil businessUtil) {
        this.util = util;
        this.businessUtil = businessUtil;
    }



    /**
     * Validates the request
     * @param requestInfo RequestInfo of the request
     * @param processStateAndActions The processStateAndActions containing processInstances to be validated
     */
    public void validateRequest(RequestInfo requestInfo, List<ProcessStateAndAction> processStateAndActions){
        String tenantId = processStateAndActions.get(0).getProcessInstanceFromRequest().getTenantId();
        String businessServiceCode = processStateAndActions.get(0).getProcessInstanceFromRequest().getBusinessService();
        BusinessService businessService = businessUtil.getBusinessService(tenantId,businessServiceCode);
        validateAction(requestInfo,processStateAndActions,businessService);
        validateDocuments(processStateAndActions);
        validateAssignes(requestInfo, processStateAndActions);
    }


    /**
     * Validates if the search functionality is available for the role of the user
     * @param requestInfo The RequestInfo of the search request
     * @param processStateAndActions The ProcessStateAndAction object of the search result
     */
/*    public void validateSearch(RequestInfo requestInfo, List<ProcessStateAndAction> processStateAndActions){
        Map<String,String> errorMap = new HashMap<>();
        Set<String> businessIds = util.getBusinessIds(processStateAndActions);
        businessIds.forEach(businessId -> {
            ProcessStateAndAction processStateAndAction = util.getLatestProcessStateAndAction(businessId,processStateAndActions);
            List<String> rolesInState = util.getAllRolesFromState(processStateAndAction.getCurrentState());
            Boolean isAssignedToMe = false;
            if(processStateAndAction.getProcessInstanceFromRequest().getAssignee()!=null)
                isAssignedToMe = (processStateAndAction.getProcessInstanceFromRequest().getAssignee().getUuid().equalsIgnoreCase(requestInfo.getUserInfo().getUuid())) ? true : false;
            if(!util.isRoleAvailable(requestInfo.getUserInfo().getRoles(),rolesInState) && !isAssignedToMe)
                errorMap.put("INVALID SEARCH","Access denied for processInstance: "+processStateAndAction.getProcessInstanceFromRequest().getId());
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }*/



    /**
     * Validates if documents are required to perform currentState change
     * @param processStateAndActions ProcessStateAndAction to be validated
     */
    private void validateDocuments(List<ProcessStateAndAction> processStateAndActions){
        Map<String,String> errorMap = new HashMap<>();
        for (ProcessStateAndAction processStateAndAction : processStateAndActions){
            if(processStateAndAction.getResultantState().getDocUploadRequired()){
                if(CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getDocuments()))
                    errorMap.put("INVALID DOCUMENT","Documents cannot be null for status: "+processStateAndAction.getResultantState().getState());
            }
        }
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Validates if the action can be performed
     * @param requestInfo The RequestInfo of the incoming request
     * @param processStateAndActions The processStateAndActions containing processInstances to be validated
     */
    private void validateAction(RequestInfo requestInfo,List<ProcessStateAndAction> processStateAndActions
            ,BusinessService businessService){

        Map<String,List<String>> tenantIdToRoles = util.getTenantIdToUserRolesMap(requestInfo);

        for(ProcessStateAndAction processStateAndAction : processStateAndActions){
            String tenantId= processStateAndAction.getProcessInstanceFromRequest().getTenantId();
            List<String> roles = new LinkedList<>();

            // Adding tenant level roles
            if(!CollectionUtils.isEmpty(tenantIdToRoles.get(tenantId)))
                roles.addAll(tenantIdToRoles.get(tenantId));

            // Adding the state level roles
            if(!CollectionUtils.isEmpty(tenantIdToRoles.get(tenantId.split("\\.")[0]))){
                String stateLevelTenant = tenantId.split("\\.")[0];
                List<String> stateLevelRoles = tenantIdToRoles.get(stateLevelTenant);
                roles.addAll(stateLevelRoles);
            }

            Action action = processStateAndAction.getAction();
            if(action==null && !processStateAndAction.getCurrentState().getIsTerminateState())
                throw new CustomException("INVALID ACTION","Action not found for businessIds: "+
                        processStateAndAction.getCurrentState().getBusinessServiceId());

            Integer rating = null;

            if(!ObjectUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest()))
                rating = processStateAndAction.getProcessInstanceFromRequest().getRating();

            if(rating != null && !action.getAction().equalsIgnoreCase(RATE_ACTION)){
                throw new CustomException("INVALID_ACTION", "Rating can be given only upon taking RATE action.");
            }

            Boolean isRoleAvailable = util.isRoleAvailable(roles,action.getRoles());
            Boolean isStateChanging = (action.getCurrentState().equalsIgnoreCase( action.getNextState())) ? false : true;
            List<String> transitionRoles = getRolesFromState(processStateAndAction.getCurrentState());
            Boolean isRoleAvailableForTransition = util.isRoleAvailable(roles,transitionRoles);
            Boolean isAssigneeUserInfo = false;

            /*Checks if the user has role to take action*/
            if(action!=null && isStateChanging && !isRoleAvailable)
                throw new CustomException("INVALID ROLE","User is not authorized to perform action");
            if(action!=null && !isStateChanging && !util.isRoleAvailable(roles,util.rolesAllowedInService(businessService)))
                throw new CustomException("INVALID ROLE","User is not authorized to perform action");




            /*
             * Checks in case of non-transition action the assigner is one having transition role in current state
             * or is the one to whom it was assigned
             * */
            if(processStateAndAction.getProcessInstanceFromDb()!=null && !CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromDb().getAssignes())){
                isAssigneeUserInfo = processStateAndAction.getProcessInstanceFromDb().getAssignes().stream().map(User::getUuid).collect(Collectors.toList())
                        .contains(requestInfo.getUserInfo().getUuid());
            }



            /**
             * Checks if in case of action causing transition the assignee has role that can take some action
             * in the resultant state
             */
            List<String> nextStateRoles = getRolesFromState(processStateAndAction.getResultantState());

            if(isStateChanging && !CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getAssignes())){
                processStateAndAction.getProcessInstanceFromRequest().getAssignes().forEach(assignee -> {
                    List<Role> assigneeRoles = assignee.getRoles();
                    Boolean isRoleAvailableInNextState = util.isRoleAvailable(tenantId,assigneeRoles,nextStateRoles);
                    if(!isRoleAvailableInNextState)
                        throw new CustomException("INVALID_ASSIGNEE","Cannot assign to the user: "+ assignee.getUuid());

                });
            }

            /*
            *  Validates if the application is sendback to citizen, only the citizen to whom the
            *  application is sent back is able to take the action
            * */
            if(requestInfo.getUserInfo().getType().equalsIgnoreCase(CITIZEN_TYPE)){
                ProcessInstance processInstanceFromDB = processStateAndAction.getProcessInstanceFromDb();
                if(processInstanceFromDB!=null && processInstanceFromDB.getAction().equalsIgnoreCase(SENDBACKTOCITIZEN)){
                    List<String> assignes = processInstanceFromDB.getAssignes().stream().map(User::getUuid).collect(Collectors.toList());
                    if(!assignes.contains(requestInfo.getUserInfo().getUuid()))
                        throw new CustomException("INVALID_USER","The user: "+requestInfo.getUserInfo().getUuid()+" is not authorized to take action");
                }
            }


        }
    }


    private List<String> getRolesFromState(State state){
        List<String> transitionRoles = new LinkedList<>();
        if(!CollectionUtils.isEmpty(state.getActions())){
            state.getActions().forEach(action -> {
                if(!action.getCurrentState().equalsIgnoreCase(action.getNextState()))
                    transitionRoles.addAll(action.getRoles());
            });
        }
        return transitionRoles;
    }


    /**
     * Validates if the citizen is in list of assignes
     * @param requestInfo
     * @param processStateAndActions
     */
    private void validateAssignes(RequestInfo requestInfo, List<ProcessStateAndAction> processStateAndActions){

        if(requestInfo.getUserInfo().getType().equalsIgnoreCase(CITIZEN_TYPE)){

            String userUUID = requestInfo.getUserInfo().getUuid();
            Map<String, String> errorMap = new HashMap<>();

            for(ProcessStateAndAction processStateAndAction : processStateAndActions){

                ProcessInstance processInstanceFromDb = processStateAndAction.getProcessInstanceFromDb();

                if(processInstanceFromDb!=null){
                    if(!CollectionUtils.isEmpty(processInstanceFromDb.getAssignes())){
                        List<String> assignes = processInstanceFromDb.getAssignes().stream().map(User::getUuid).collect(Collectors.toList());

                        if(!assignes.contains(userUUID))
                            errorMap.put("INVALID_USER","Citizen not authorized to perform action on application: "+processInstanceFromDb.getBusinessId());
                    }
                }

            }

            if(!errorMap.isEmpty())
                throw new CustomException(errorMap);

        }

    }





}
