package org.egov.rn.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.service.models.ProcessInstance;
import org.egov.rn.service.models.ProcessInstanceRequest;
import org.egov.rn.service.models.ProcessInstanceResponse;
import org.egov.rn.service.models.State;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class WorkflowService {

    private ServiceRequestRepository serviceRequestRepository;
    private ObjectMapper objectMapper;

    @Value("${egov.workflow.host}")
    private String wfHost;

    @Value("${egov.workflow.transition.path}")
    private String wfTransitionUrl;

    @Autowired
    public WorkflowService(ServiceRequestRepository serviceRequestRepository, ObjectMapper objectMapper) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.objectMapper = objectMapper;
    }


    public State updateWorkflowStatus(RegistrationRequest registrationRequest) {
        ProcessInstance processInstance = getProcessInstanceForRegistration(registrationRequest);
        ProcessInstanceRequest processInstanceRequest = new ProcessInstanceRequest(registrationRequest.getRequestInfo(),
                Collections.singletonList(processInstance));
        return callWorkflow(processInstanceRequest);
    }

    private State callWorkflow(ProcessInstanceRequest processInstanceRequest) {
        StringBuilder url = new StringBuilder(wfHost + wfTransitionUrl);
        Object optional = serviceRequestRepository.fetchResult(url, processInstanceRequest);
        ProcessInstanceResponse response = objectMapper.convertValue(optional,
                ProcessInstanceResponse.class);
        return response.getProcessInstances().get(0).getState();
    }

    private ProcessInstance getProcessInstanceForRegistration(RegistrationRequest registrationRequest) {
        List<User> assignes = new ArrayList<>();
        User user = new User();
        user.setUuid(registrationRequest.getRequestInfo().getUserInfo().getUuid());
        assignes.add(user);
        return ProcessInstance.builder()
                .businessId(registrationRequest.getRegistration().getRegistrationId())
                .tenantId(registrationRequest.getTenantId())
                .action("SUBMIT")
                .moduleName("egov-rn-service")
                .businessService("RNS")
                .assignes(assignes)
                .build();
    }
}
