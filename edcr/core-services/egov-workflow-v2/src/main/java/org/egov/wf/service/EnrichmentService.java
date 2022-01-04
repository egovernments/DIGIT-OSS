package org.egov.wf.service;

import java.util.*;
import java.util.stream.Collectors;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.web.models.*;
import org.egov.wf.web.models.user.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import static org.egov.wf.util.WorkflowConstants.AUTO_ESC_EMPLOYEE_ROLE_CODE;
import static org.egov.wf.util.WorkflowConstants.UUID_REGEX;


@Service
@Slf4j
public class EnrichmentService {


    private WorkflowUtil util;

    private UserService userService;

    private TransitionService transitionService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

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
            String tenantId = processStateAndAction.getProcessInstanceFromRequest().getTenantId();
            if(isTransition)
             state = processStateAndAction.getResultantState();
            else state = processStateAndAction.getCurrentState();
            List<Action> nextAction = new ArrayList<>();
            if(!CollectionUtils.isEmpty( state.getActions())){
                state.getActions().forEach(action -> {
                    if(util.isRoleAvailable(tenantId,roles,action.getRoles()) && !nextAction.contains(action))
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

            if(!CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getAssignes()))
                uuids.addAll(processStateAndAction.getProcessInstanceFromRequest().getAssignes().stream().map(User::getUuid).collect(Collectors.toSet()));
            uuids.add(processStateAndAction.getProcessInstanceFromRequest().getAssigner().getUuid());

            if(processStateAndAction.getProcessInstanceFromDb() != null){
                if(!CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromDb().getAssignes())){
                    uuids.addAll(processStateAndAction.getProcessInstanceFromDb().getAssignes().stream().map(User::getUuid).collect(Collectors.toSet()));
                }
            }

        });


        Map<String,User> idToUserMap = userService.searchUser(requestInfo,uuids);
        Map<String,String> errorMap = new HashMap<>();
        processStateAndActions.forEach(processStateAndAction -> {

            // Setting Assignes
            if(!CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromRequest().getAssignes())){
                enrichAssignes(processStateAndAction.getProcessInstanceFromRequest(), idToUserMap, errorMap);
            }

            // Setting Assigner
            if(processStateAndAction.getProcessInstanceFromRequest().getAssigner()!=null)
                enrichAssigner(processStateAndAction.getProcessInstanceFromRequest(), idToUserMap, errorMap);

            // Setting Assignes for previous processInstance
            if(processStateAndAction.getProcessInstanceFromDb()!=null && !CollectionUtils.isEmpty(processStateAndAction.getProcessInstanceFromDb().getAssignes())){
                enrichAssignes(processStateAndAction.getProcessInstanceFromDb(), idToUserMap, errorMap);
            }

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

            if(!CollectionUtils.isEmpty(processInstance.getAssignes()))
                uuids.addAll(processInstance.getAssignes().stream().map(User::getUuid).collect(Collectors.toList()));

            uuids.add(processInstance.getAssigner().getUuid());
        });
        Map<String,User> idToUserMap = userService.searchUser(requestInfo,uuids);
        Map<String,String> errorMap = new HashMap<>();
        processInstances.forEach(processInstance -> {

            // Enriching assignes if present
            if(!CollectionUtils.isEmpty(processInstance.getAssignes()))
                enrichAssignes(processInstance, idToUserMap, errorMap);

            // Enriching assigner if present
            if(processInstance.getAssigner()!=null)
                enrichAssigner(processInstance, idToUserMap, errorMap);

        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    public List<ProcessStateAndAction> enrichNextActionForSearch(RequestInfo requestInfo,List<ProcessInstance> processInstances){
        List<ProcessStateAndAction> processStateAndActions = new LinkedList<>();
        Map<String, List<ProcessInstance>> businessServiceToProcessInstance = getRequestByBusinessService(new ProcessInstanceRequest(requestInfo,processInstances));

        for(Map.Entry<String, List<ProcessInstance>> entry : businessServiceToProcessInstance.entrySet()){
            try{
             processStateAndActions.addAll(transitionService.getProcessStateAndActions(entry.getValue(),false));}
            catch (Exception e){
                log.error("Error while creating processStateAndActions",e);
            }
        }

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
    private Map<String,List<ProcessInstance>> getRequestByBusinessService(ProcessInstanceRequest request){
        List<ProcessInstance> processInstances = request.getProcessInstances();

        Map<String,List<ProcessInstance>> businessServiceToProcessInstance = new HashMap<>();
        if(!CollectionUtils.isEmpty(processInstances)){
            processInstances.forEach(processInstance -> {
                if(businessServiceToProcessInstance.containsKey(processInstance.getBusinessService()))
                    businessServiceToProcessInstance.get(processInstance.getBusinessService()).add(processInstance);
                else{
                    List<ProcessInstance> list = new ArrayList<>();
                    list.add(processInstance);
                    businessServiceToProcessInstance.put(processInstance.getBusinessService(),list);
                }
            });
        }

        return businessServiceToProcessInstance;
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


    /**
     * Enriches the processInstance's assignes from the search response map of uuid to User
     * @param processInstance The processInstance to be enriched
     * @param idToUserMap Search response as a map of UUID to user
     */
    private void enrichAssignes(ProcessInstance processInstance, Map<String,User> idToUserMap, Map<String , String> errorMap){
        List<User> assignes = new LinkedList<>();
        processInstance.getAssignes().forEach(assigne -> {
            if(idToUserMap.containsKey(assigne.getUuid()))
                assignes.add(idToUserMap.get(assigne.getUuid()));
            else
                errorMap.put("INVALID UUID","User not found for uuid: "+assigne.getUuid());
        });
        processInstance.setAssignes(assignes);
    }

    /**
     * Enriches the processInstance's assigner from the search response map of uuid to User
     * @param processInstance The processInstance to be enriched
     * @param idToUserMap Search response as a map of UUID to user
     */
    private void enrichAssigner(ProcessInstance processInstance, Map<String,User> idToUserMap, Map<String , String> errorMap){
        User assigner = idToUserMap.get(processInstance.getAssigner().getUuid());
        if(assigner==null)
            errorMap.put("INVALID UUID","User not found for uuid: "+processInstance.getAssigner().getUuid());
        processInstance.setAssigner(assigner);
    }


    public Set<String> enrichUuidsOfAutoEscalationEmployees(RequestInfo requestInfo, ProcessInstanceSearchCriteria criteria) {
        List<String> roleCodes = new ArrayList<>();
        Set<String> autoEscalationEmployeesUuids = new HashSet<>();
        // ######## CHANGE THE VALUE OF THE ROLE CODE CONSTANT WITH THE VALUE DEFINED IN SYSTEM
        roleCodes.add(AUTO_ESC_EMPLOYEE_ROLE_CODE);
        // ####################################################################################
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(criteria.getTenantId());
        userSearchRequest.setRoleCodes(roleCodes);

        List<String> uuidsOfAutoEscalationEmployees = userService.searchUserUuidsBasedOnRoleCodes(userSearchRequest);
        criteria.setMultipleAssignees(uuidsOfAutoEscalationEmployees);
        uuidsOfAutoEscalationEmployees.forEach(uuid -> {
            autoEscalationEmployeesUuids.add(uuid);
        });
        return autoEscalationEmployeesUuids;
    }

    public Set<String> fetchStatesToIgnoreFromMdms(RequestInfo requestInfo, String tenantId) {
        Set<String> masterData = new HashSet<>();
        StringBuilder uri = new StringBuilder();
        uri.append(mdmsHost).append(mdmsUrl);
        if(StringUtils.isEmpty(tenantId))
            return masterData;
        MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForStatesToIgnore(requestInfo, tenantId.split("\\.")[0]);

        try {
            //Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
            //masterData = JsonPath.read(response, "$.MdmsRes.Workflow.AutoEscalationStatesToIgnore.*.state");
        }catch(Exception e) {
            log.error("Exception while fetching workflow states to ignore: ",e);
        }

        return masterData;
    }

    private MdmsCriteriaReq getMdmsRequestForStatesToIgnore(RequestInfo requestInfo, String tenantId) {
        MasterDetail masterDetail = new MasterDetail();
        masterDetail.setName("AutoEscalationStatesToIgnore");
        List<MasterDetail> masterDetailList = new ArrayList<>();
        masterDetailList.add(masterDetail);

        ModuleDetail moduleDetail = new ModuleDetail();
        moduleDetail.setMasterDetails(masterDetailList);
        moduleDetail.setModuleName("Workflow");
        List<ModuleDetail> moduleDetailList = new ArrayList<>();
        moduleDetailList.add(moduleDetail);

        MdmsCriteria mdmsCriteria = new MdmsCriteria();
        mdmsCriteria.setTenantId(tenantId);
        mdmsCriteria.setModuleDetails(moduleDetailList);

        MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
        mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
        mdmsCriteriaReq.setRequestInfo(requestInfo);

        return mdmsCriteriaReq;
    }
}
