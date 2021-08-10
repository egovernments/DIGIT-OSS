package org.egov.pgr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.repository.ServiceRequestRepository;
import org.egov.pgr.web.models.*;
import org.egov.pgr.web.models.workflow.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.pgr.util.PGRConstants.*;

@org.springframework.stereotype.Service
public class WorkflowService {

    private PGRConfiguration pgrConfiguration;

    private ServiceRequestRepository repository;

    private ObjectMapper mapper;


    @Autowired
    public WorkflowService(PGRConfiguration pgrConfiguration, ServiceRequestRepository repository, ObjectMapper mapper) {
        this.pgrConfiguration = pgrConfiguration;
        this.repository = repository;
        this.mapper = mapper;
    }

    /*
     *
     * Should return the applicable BusinessService for the given request
     *
     * */
    public BusinessService getBusinessService(ServiceRequest serviceRequest) {
        String tenantId = serviceRequest.getService().getTenantId();
        StringBuilder url = getSearchURLWithParams(tenantId, PGR_BUSINESSSERVICE);
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(serviceRequest.getRequestInfo()).build();
        Object result = repository.fetchResult(url, requestInfoWrapper);
        BusinessServiceResponse response = null;
        try {
            response = mapper.convertValue(result, BusinessServiceResponse.class);
        } catch (IllegalArgumentException e) {
            throw new CustomException("PARSING ERROR", "Failed to parse response of workflow business service search");
        }

        if (CollectionUtils.isEmpty(response.getBusinessServices()))
            throw new CustomException("BUSINESSSERVICE_NOT_FOUND", "The businessService " + PGR_BUSINESSSERVICE + " is not found");

        return response.getBusinessServices().get(0);
    }


    /*
     * Call the workflow service with the given action and update the status
     * return the updated status of the application
     *
     * */
    public String updateWorkflowStatus(ServiceRequest serviceRequest) {
        ProcessInstance processInstance = getProcessInstanceForPGR(serviceRequest);
        ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(serviceRequest.getRequestInfo(), Collections.singletonList(processInstance));
        State state = callWorkFlow(workflowRequest);
        serviceRequest.getService().setApplicationStatus(state.getApplicationStatus());
        return state.getApplicationStatus();
    }


    public void validateAssignee(ServiceRequest serviceRequest) {
        /*
         * Call HRMS service and validate of the assignee belongs to same department
         * as the employee assigning it
         *
         * */

    }

    /**
     * Creates url for search based on given tenantId and businessservices
     *
     * @param tenantId        The tenantId for which url is generated
     * @param businessService The businessService for which url is generated
     * @return The search url
     */
    private StringBuilder getSearchURLWithParams(String tenantId, String businessService) {

        StringBuilder url = new StringBuilder(pgrConfiguration.getWfHost());
        url.append(pgrConfiguration.getWfBusinessServiceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessServices=");
        url.append(businessService);
        return url;
    }


    public void enrichmentForSendBackToCititzen() {
        /*
         * If send bac to citizen action is taken assignes should be set to accountId
         *
         * */
    }


    public List<ServiceWrapper> enrichWorkflow(RequestInfo requestInfo, List<ServiceWrapper> serviceWrappers) {

        // FIX ME FOR BULK SEARCH
        Map<String, List<ServiceWrapper>> tenantIdToServiceWrapperMap = getTenantIdToServiceWrapperMap(serviceWrappers);

        List<ServiceWrapper> enrichedServiceWrappers = new ArrayList<>();

        for(String tenantId : tenantIdToServiceWrapperMap.keySet()) {

            List<String> serviceRequestIds = new ArrayList<>();

            List<ServiceWrapper> tenantSpecificWrappers = tenantIdToServiceWrapperMap.get(tenantId);

            tenantSpecificWrappers.forEach(pgrEntity -> {
                serviceRequestIds.add(pgrEntity.getService().getServiceRequestId());
            });

            RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

            StringBuilder searchUrl = getprocessInstanceSearchURL(tenantId, StringUtils.join(serviceRequestIds, ','));
            Object result = repository.fetchResult(searchUrl, requestInfoWrapper);


            ProcessInstanceResponse processInstanceResponse = null;
            try {
                processInstanceResponse = mapper.convertValue(result, ProcessInstanceResponse.class);
            } catch (IllegalArgumentException e) {
                throw new CustomException("PARSING ERROR", "Failed to parse response of workflow processInstance search");
            }

            if (CollectionUtils.isEmpty(processInstanceResponse.getProcessInstances()) || processInstanceResponse.getProcessInstances().size() != serviceRequestIds.size())
                throw new CustomException("WORKFLOW_NOT_FOUND", "The workflow object is not found");

            Map<String, Workflow> businessIdToWorkflow = getWorkflow(processInstanceResponse.getProcessInstances());

            tenantSpecificWrappers.forEach(pgrEntity -> {
                pgrEntity.setWorkflow(businessIdToWorkflow.get(pgrEntity.getService().getServiceRequestId()));
            });

            enrichedServiceWrappers.addAll(tenantSpecificWrappers);
        }

        return enrichedServiceWrappers;

    }

    private Map<String, List<ServiceWrapper>> getTenantIdToServiceWrapperMap(List<ServiceWrapper> serviceWrappers) {
        Map<String, List<ServiceWrapper>> resultMap = new HashMap<>();
        for(ServiceWrapper serviceWrapper : serviceWrappers){
            if(resultMap.containsKey(serviceWrapper.getService().getTenantId())){
                resultMap.get(serviceWrapper.getService().getTenantId()).add(serviceWrapper);
            }else{
                List<ServiceWrapper> serviceWrapperList = new ArrayList<>();
                serviceWrapperList.add(serviceWrapper);
                resultMap.put(serviceWrapper.getService().getTenantId(), serviceWrapperList);
            }
        }
        return resultMap;
    }

    /**
     * Enriches ProcessInstance Object for workflow
     *
     * @param request
     */
    private ProcessInstance getProcessInstanceForPGR(ServiceRequest request) {

        Service service = request.getService();
        Workflow workflow = request.getWorkflow();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setBusinessId(service.getServiceRequestId());
        processInstance.setAction(request.getWorkflow().getAction());
        processInstance.setModuleName(PGR_MODULENAME);
        processInstance.setTenantId(service.getTenantId());
        processInstance.setBusinessService(getBusinessService(request).getBusinessService());
        processInstance.setDocuments(request.getWorkflow().getVerificationDocuments());
        processInstance.setComment(workflow.getComments());

        if(!CollectionUtils.isEmpty(workflow.getAssignes())){
            List<User> users = new ArrayList<>();

            workflow.getAssignes().forEach(uuid -> {
                User user = new User();
                user.setUuid(uuid);
                users.add(user);
            });

            processInstance.setAssignes(users);
        }

        return processInstance;
    }

    /**
     *
     * @param processInstances
     */
    public Map<String, Workflow> getWorkflow(List<ProcessInstance> processInstances) {

        Map<String, Workflow> businessIdToWorkflow = new HashMap<>();

        processInstances.forEach(processInstance -> {
            List<String> userIds = null;

            if(!CollectionUtils.isEmpty(processInstance.getAssignes())){
                userIds = processInstance.getAssignes().stream().map(User::getUuid).collect(Collectors.toList());
            }

            Workflow workflow = Workflow.builder()
                    .action(processInstance.getAction())
                    .assignes(userIds)
                    .comments(processInstance.getComment())
                    .verificationDocuments(processInstance.getDocuments())
                    .build();

            businessIdToWorkflow.put(processInstance.getBusinessId(), workflow);
        });

        return businessIdToWorkflow;
    }

    /**
     * Method to integrate with workflow
     * <p>
     * take the ProcessInstanceRequest as paramerter to call wf-service
     * <p>
     * and return wf-response to sets the resultant status
     */
    private State callWorkFlow(ProcessInstanceRequest workflowReq) {

        ProcessInstanceResponse response = null;
        StringBuilder url = new StringBuilder(pgrConfiguration.getWfHost().concat(pgrConfiguration.getWfTransitionPath()));
        Object optional = repository.fetchResult(url, workflowReq);
        response = mapper.convertValue(optional, ProcessInstanceResponse.class);
        return response.getProcessInstances().get(0).getState();
    }


    public StringBuilder getprocessInstanceSearchURL(String tenantId, String serviceRequestId) {

        StringBuilder url = new StringBuilder(pgrConfiguration.getWfHost());
        url.append(pgrConfiguration.getWfProcessInstanceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessIds=");
        url.append(serviceRequestId);
        return url;

    }


}
