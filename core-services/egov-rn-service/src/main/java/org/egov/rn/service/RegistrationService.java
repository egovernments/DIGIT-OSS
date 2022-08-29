package org.egov.rn.service;

import org.egov.rn.kafka.Producer;
import org.egov.rn.validators.RegistrationValidator;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.HouseholdRegistrationDetails;
import org.egov.rn.web.models.RegistrationDetails;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {

    private RegistrationValidator registrationValidator;
    private RegistrationEnrichmentService registrationEnrichmentService;

    private WorkflowService workflowService;

    private Producer producer;

    @Autowired
    public RegistrationService(RegistrationValidator registrationValidator,
                               RegistrationEnrichmentService registrationEnrichmentService,
                               WorkflowService workflowService,
                               Producer producer) {
        this.registrationValidator = registrationValidator;
        this.registrationEnrichmentService = registrationEnrichmentService;
        this.workflowService = workflowService;
        this.producer = producer;
    }

    public RegistrationDetails register(RegistrationRequest registrationRequest) {
        registrationValidator.validate(registrationRequest);
        registrationEnrichmentService.enrich(registrationRequest);
        producer.send("save-hh-registration", registrationRequest);
        workflowService.updateWorkflowStatus(registrationRequest);
        return HouseholdRegistrationDetails.builder()
                .registrationId(registrationRequest.getRegistration().getRegistrationId())
                .householdId(((HouseholdRegistration) registrationRequest.getRegistration()).getHouseholdId())
                .build();
    }
}
