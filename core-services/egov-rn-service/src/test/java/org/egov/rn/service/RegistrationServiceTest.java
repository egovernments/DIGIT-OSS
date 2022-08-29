package org.egov.rn.service;

import org.egov.rn.helper.RegistrationRequestTestBuilder;
import org.egov.rn.kafka.Producer;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.validators.RegistrationValidator;
import org.egov.rn.web.models.HouseholdRegistrationDetails;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private RegistrationValidator registrationValidator;

    @Mock
    private RegistrationEnrichmentService registrationEnrichmentService;

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private Producer producer;

    @InjectMocks
    private RegistrationService registrationService;

    @BeforeEach
    void setUp() {
        registrationService = new RegistrationService(registrationValidator,
                registrationEnrichmentService, workflowService, producer);
    }

    @Test
    @DisplayName("should register an entity and successfully generate registration details")
    void registerAnEntitySuccessfullyAndGenerateRegistrationDetails() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        HouseholdRegistrationDetails registrationDetails = (HouseholdRegistrationDetails)
                registrationService.register(registrationRequest);

        verify(registrationValidator, times(1)).validate(registrationRequest);
        verify(registrationEnrichmentService, times(1)).enrich(registrationRequest);
        verify(producer, times(1)).send(anyString(), any());
        verify(workflowService, times(1)).updateWorkflowStatus(registrationRequest);
    }
}
