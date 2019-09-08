package org.egov.wf.validator;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.BusinessUtil;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import java.util.*;


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
    }


    /**
     * Validates if the search functionality is available for the role of the user
     * @param requestInfo The RequestInfo of the search request
     * @param processStateAndActions The ProcessStateAndAction object of the search result
     */
    public void validateSearch(RequestInfo requestInfo, List<ProcessStateAndAction> processStateAndActions){
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
    }



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
        List<Role> roles = requestInfo.getUserInfo().getRoles();
        for(ProcessStateAndAction processStateAndAction : processStateAndActions){
            Action action = processStateAndAction.getAction();
            if(action==null && !processStateAndAction.getCurrentState().getIsTerminateState())
                throw new CustomException("INVALID ACTION","Action not found for businessIds: "+
                        processStateAndAction.getCurrentState().getBusinessServiceId());

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
             *  Validates if action is not causing transition then it must have atleast one of the field
             *  either documents or comment or assignee to be not null
             */
            /*if(!isStateChanging && (processStateAndAction.getProcessInstanceFromRequest().getAssignee()==null
                    && CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getDocuments())
                    && StringUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getComment()))){
                throw new CustomException("INVALID PROCESSINSTANCE","For non-transition actions atleast one of comment,assignee or document should be not null.The BusinessId: "
                        +processStateAndAction.getProcessInstanceFromRequest().getBusinessId());
            }*/

            /*
             * Checks in case of non-transition action the assigner is one having transition role in current state
             * or is the one to whom it was assigned
             * */
            if(processStateAndAction.getProcessInstanceFromDb()!=null && processStateAndAction.getProcessInstanceFromDb().getAssignee()!=null)
                isAssigneeUserInfo = processStateAndAction.getProcessInstanceFromDb().getAssignee().getUuid().equalsIgnoreCase(requestInfo.getUserInfo().getUuid());
            if(!isStateChanging && !isAssigneeUserInfo && !isRoleAvailableForTransition)
                throw new CustomException("INVALID MARK ACTION","The processInstanceFromRequest cannot be marked by the user");

            /**
             * Checks if in case of action causing transition the assignee has role that ca take some action
             * in the resultant state
             */
            List<String> nextStateRoles = getRolesFromState(processStateAndAction.getResultantState());
            List<Role> assigneeRoles;
            if(isStateChanging && processStateAndAction.getProcessInstanceFromRequest().getAssignee()!=null){
                assigneeRoles = processStateAndAction.getProcessInstanceFromRequest().getAssignee().getRoles();
                Boolean isRoleAvailableInNextState = util.isRoleAvailable(assigneeRoles,nextStateRoles);
                if(!isRoleAvailableInNextState)
                    throw new CustomException("INVALID ASSIGNEE","Cannot assign to the user: "+ processStateAndAction.getProcessInstanceFromRequest().getAssignee().getUuid());
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





}
