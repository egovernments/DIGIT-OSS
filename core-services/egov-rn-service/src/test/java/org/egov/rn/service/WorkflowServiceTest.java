package org.egov.rn.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.helper.RegistrationRequestTestBuilder;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.service.models.ProcessInstance;
import org.egov.rn.service.models.ProcessInstanceResponse;
import org.egov.rn.service.models.State;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkflowServiceTest {

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper objectMapper;

    @InjectMocks
    private WorkflowService workflowService;


    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        workflowService = new WorkflowService(serviceRequestRepository, objectMapper);
    }

    @Test
    @DisplayName("should update the workflow status to submitted")
    void shouldUpdateWorkflowStatusToSubmitted() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();
        ProcessInstance processInstance = ProcessInstance.builder()
                .state(State.builder().state("SUBMITTED")
                        .isTerminateState(true).actions(null).build()).build();
        List<ProcessInstance> processInstances = new ArrayList<>();
        processInstances.add(processInstance);
        ProcessInstanceResponse processInstanceResponse = ProcessInstanceResponse.builder()
                .processInstances(processInstances).build();

        when(serviceRequestRepository.fetchResult(any(StringBuilder.class), any(Object.class)))
                .thenReturn(processInstanceResponse);

        State state = workflowService
                .updateWorkflowStatus(registrationRequest);

        assertEquals(processInstanceResponse.getProcessInstances().get(0).getState().getState(), state.getState());
        verify(serviceRequestRepository, times(1))
                .fetchResult(any(StringBuilder.class), any(Object.class));
    }
}
