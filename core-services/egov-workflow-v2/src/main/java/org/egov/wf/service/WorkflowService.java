package org.egov.wf.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.repository.WorKflowRepository;
import org.egov.wf.util.WorkflowUtil;
import org.egov.wf.validator.WorkflowValidator;
import org.egov.wf.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;


@Service
public class WorkflowService {

    private WorkflowConfig config;

    private TransitionService transitionService;

    private EnrichmentService enrichmentService;

    private WorkflowValidator workflowValidator;

    private StatusUpdateService statusUpdateService;

    private WorKflowRepository workflowRepository;

    private WorkflowUtil util;

    private BusinessServiceRepository businessServiceRepository;


    @Autowired
    public WorkflowService(WorkflowConfig config, TransitionService transitionService,
                           EnrichmentService enrichmentService, WorkflowValidator workflowValidator,
                           StatusUpdateService statusUpdateService, WorKflowRepository workflowRepository,
                           WorkflowUtil util,BusinessServiceRepository businessServiceRepository) {
        this.config = config;
        this.transitionService = transitionService;
        this.enrichmentService = enrichmentService;
        this.workflowValidator = workflowValidator;
        this.statusUpdateService = statusUpdateService;
        this.workflowRepository = workflowRepository;
        this.util = util;
        this.businessServiceRepository = businessServiceRepository;
    }


    /**
     * Creates or updates the processInstanceFromRequest
     * @param request The incoming request for workflow transition
     * @return The list of processInstanceFromRequest objects after taking action
     */
    public List<ProcessInstance> transition(ProcessInstanceRequest request){
        RequestInfo requestInfo = request.getRequestInfo();

        List<ProcessStateAndAction> processStateAndActions = transitionService.getProcessStateAndActions(request.getProcessInstances(),true);
        enrichmentService.enrichProcessRequest(requestInfo,processStateAndActions);
        workflowValidator.validateRequest(requestInfo,processStateAndActions);
        statusUpdateService.updateStatus(requestInfo,processStateAndActions);
        return request.getProcessInstances();
    }


    /**
     * Fetches ProcessInstances from db based on processSearchCriteria
     * @param requestInfo The RequestInfo of the search request
     * @param criteria The object containing Search params
     * @return List of processInstances based on search criteria
     */
    public List<ProcessInstance> search(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria){
        List<ProcessInstance> processInstances;
        if(criteria.isNull())
            processInstances = getUserBasedProcessInstances(requestInfo,criteria);
        else processInstances = workflowRepository.getProcessInstances(criteria);
        if(CollectionUtils.isEmpty(processInstances))
            return processInstances;

        enrichmentService.enrichUsersFromSearch(requestInfo,processInstances);
        List<ProcessStateAndAction> processStateAndActions = enrichmentService.enrichNextActionForSearch(requestInfo,processInstances);
    //    workflowValidator.validateSearch(requestInfo,processStateAndActions);
        enrichmentService.enrichAndUpdateSlaForSearch(processInstances);
        return processInstances;
    }


    public Integer count(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria){
        Integer count;
        if(criteria.isNull()){
        	enrichSearchCriteriaForCount(requestInfo, criteria);
            count = workflowRepository.getInboxCount(criteria,Boolean.FALSE);
        }
        else {
        	List<String> origCriteriaStatuses = criteria.getStatus();
        	enrichSearchCriteriaForCount(requestInfo, criteria);
        	String tenantId = (criteria.getTenantId() == null ? (requestInfo.getUserInfo().getTenantId()) :(criteria.getTenantId()));
        	List<String> finalCriteriaStatuses = new ArrayList<String>();
        	if(origCriteriaStatuses != null && !origCriteriaStatuses.isEmpty()) {
        		origCriteriaStatuses.forEach((status) ->{
        			finalCriteriaStatuses.add(tenantId+":"+status);
        		});
        		criteria.setStatus(finalCriteriaStatuses);
        	}
        	count = workflowRepository.getProcessInstancesCount(criteria,Boolean.FALSE);
        }

        return count;
    }



    public List statusCount(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria){
        List result;
        if(criteria.isNull()){
        	enrichSearchCriteriaForCount(requestInfo, criteria);
            result = workflowRepository.getInboxStatusCount(criteria,Boolean.TRUE);
        }
        else {
        	List<String> origCriteriaStatuses = criteria.getStatus();
        	enrichSearchCriteriaForCount(requestInfo, criteria);
        	String tenantId = (criteria.getTenantId() == null ? (requestInfo.getUserInfo().getTenantId()) :(criteria.getTenantId()));
        	List<String> finalCriteriaStatuses = new ArrayList<String>();
        	if(origCriteriaStatuses != null && !origCriteriaStatuses.isEmpty()) {
        		origCriteriaStatuses.forEach((status) ->{
        			finalCriteriaStatuses.add(tenantId+":"+status);
        		});
        		criteria.setStatus(finalCriteriaStatuses);
        	}
        	result = workflowRepository.getProcessInstancesStatusCount(criteria,Boolean.TRUE);
        }

        return result;
    }


    /**
     * Searches the processInstances based on user and its roles
     * @param requestInfo The RequestInfo of the search request
     * @param criteria The object containing Search params
     * @return List of processInstances based on search criteria
     */
    private List<ProcessInstance> getUserBasedProcessInstances(RequestInfo requestInfo,
                                       ProcessInstanceSearchCriteria criteria){

        enrichSearchCriteriaFromUser(requestInfo, criteria);
        List<ProcessInstance> processInstances = workflowRepository.getProcessInstancesForUserInbox(criteria);

        processInstances = filterDuplicates(processInstances);

        return processInstances;

    }


    /**
     * Removes duplicate businessId which got created due to simultaneous request
     * @param processInstances
     * @return
     */
    private List<ProcessInstance> filterDuplicates(List<ProcessInstance> processInstances){

        if(CollectionUtils.isEmpty(processInstances))
            return processInstances;

        Map<String,ProcessInstance> businessIdToProcessInstanceMap = new LinkedHashMap<>();

        for(ProcessInstance processInstance : processInstances){
            businessIdToProcessInstanceMap.put(processInstance.getBusinessId(), processInstance);
        }

        return new LinkedList<>(businessIdToProcessInstanceMap.values());
    }

    /**
     * Enriches processInstance search criteria based on requestInfo
     * @param requestInfo
     * @param criteria
     */
    private void enrichSearchCriteriaFromUser(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria){

        BusinessServiceSearchCriteria businessServiceSearchCriteria = new BusinessServiceSearchCriteria();

        /*
         * If tenantId is sent in query param processInstances only for that tenantId is returned
         * else all tenantIds for which the user has roles are returned
         * */
        if(criteria.getTenantId()!=null)
            businessServiceSearchCriteria.setTenantIds(Collections.singletonList(criteria.getTenantId()));
        else
            businessServiceSearchCriteria.setTenantIds(util.getTenantIds(requestInfo.getUserInfo()));

        List<BusinessService> businessServices = businessServiceRepository.getBusinessServices(businessServiceSearchCriteria);
        List<String> actionableStatuses = util.getActionableStatusesForRole(requestInfo,businessServices,criteria);
        criteria.setAssignee(requestInfo.getUserInfo().getUuid());
        criteria.setStatus(actionableStatuses);

    }
    
    /**
     * Enriches processInstance search criteria based on requestInfo and criteria
     * @param requestInfo
     * @param criteria
     */
    private void enrichSearchCriteriaForCount(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria){

        BusinessServiceSearchCriteria businessServiceSearchCriteria = new BusinessServiceSearchCriteria();

        /*
         * If tenantId is sent in query param processInstances only for that tenantId is returned
         * else all tenantIds for which the user has roles are returned
         * */
        if(criteria.getTenantId()!=null)
            businessServiceSearchCriteria.setTenantIds(Collections.singletonList(criteria.getTenantId()));
        else
            businessServiceSearchCriteria.setTenantIds(util.getTenantIds(requestInfo.getUserInfo()));
        
        if(!StringUtils.isEmpty(criteria.getBusinessService())) {
        	List<String> businessServices = new ArrayList<String>();
        	businessServices.add(criteria.getBusinessService());
        	businessServiceSearchCriteria.setBusinessServices(businessServices);
        }

        List<BusinessService> businessServices = businessServiceRepository.getBusinessServices(businessServiceSearchCriteria);
        List<String> actionableStatuses = util.getActionableStatusesForRole(requestInfo,businessServices,criteria);
        criteria.setAssignee(requestInfo.getUserInfo().getUuid());
        criteria.setStatus(actionableStatuses);

    }









}
