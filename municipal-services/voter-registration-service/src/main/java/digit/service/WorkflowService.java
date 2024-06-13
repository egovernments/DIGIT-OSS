package digit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import digit.config.VTRConfiguration;
import digit.repository.ServiceRequestRepository;
import digit.web.models.*;
import digit.web.models.coremodels.*;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class WorkflowService {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository repository;

    @Autowired
    private VTRConfiguration config;

    public void updateWorkflowStatus(VoterRegistrationRequest voterRegistrationRequest) {
        voterRegistrationRequest.getVoterRegistrationApplications().forEach(application -> {
            ProcessInstance processInstance = getProcessInstanceForVTR(application, voterRegistrationRequest.getRequestInfo());
            ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(voterRegistrationRequest.getRequestInfo(), Collections.singletonList(processInstance));
            callWorkFlow(workflowRequest);
        });
    }

    public State callWorkFlow(ProcessInstanceRequest workflowReq) {

        ProcessInstanceResponse response = null;
        StringBuilder url = new StringBuilder(config.getWfHost().concat(config.getWfTransitionPath()));
        Object optional = repository.fetchResult(url, workflowReq);
        response = mapper.convertValue(optional, ProcessInstanceResponse.class);
        return response.getProcessInstances().get(0).getState();
    }

    private ProcessInstance getProcessInstanceForVTR(VoterRegistrationApplication application, RequestInfo requestInfo) {
        Workflow workflow = application.getWorkflow();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setBusinessId(application.getApplicationNumber());
        processInstance.setAction(workflow.getAction());
        processInstance.setModuleName("voter-services");
        processInstance.setTenantId(application.getTenantId());
        processInstance.setBusinessService("VTR");
        processInstance.setDocuments(workflow.getDocuments());
        processInstance.setComment(workflow.getComments());

        if(!CollectionUtils.isEmpty(workflow.getAssignes())){
            List<User> users = new ArrayList<>();

            workflow.getAssignes().forEach(uuid -> {
                digit.web.models.User user = new digit.web.models.User();
                user.setUuid(uuid);
                users.add(user);
            });

            processInstance.setAssignes(users);
        }

        return processInstance;

    }

    private BusinessService getBusinessService(VoterRegistrationApplication application, RequestInfo requestInfo) {
        String tenantId = application.getTenantId();
        StringBuilder url = getSearchURLWithParams(tenantId, "VTR");
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();
        Object result = repository.fetchResult(url, requestInfoWrapper);
        BusinessServiceResponse response = null;
        try {
            response = mapper.convertValue(result, BusinessServiceResponse.class);
        } catch (IllegalArgumentException e) {
            throw new CustomException("PARSING ERROR", "Failed to parse response of workflow business service search");
        }

        if (CollectionUtils.isEmpty(response.getBusinessServices()))
            throw new CustomException("BUSINESSSERVICE_NOT_FOUND", "The businessService " + "VTR" + " is not found");

        return response.getBusinessServices().get(0);
    }

    private StringBuilder getSearchURLWithParams(String tenantId, String businessService) {

        StringBuilder url = new StringBuilder(config.getWfHost());
        url.append(config.getWfBusinessServiceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessServices=");
        url.append(businessService);
        return url;
    }

    public ProcessInstanceRequest getProcessInstanceForVoterRegistrationPayment(VoterRegistrationRequest updateRequest) {

        VoterRegistrationApplication application = updateRequest.getVoterRegistrationApplications().get(0);

        ProcessInstance process = ProcessInstance.builder()
                .businessService("VTR")
                .businessId(application.getApplicationNumber())
                .comment("Payment for voter registration processed")
                .moduleName("voter-services")
                .tenantId(application.getTenantId())
                .action("PAY")
                .build();

        return ProcessInstanceRequest.builder()
                .requestInfo(updateRequest.getRequestInfo())
                .processInstances(Arrays.asList(process))
                .build();

    }
}
