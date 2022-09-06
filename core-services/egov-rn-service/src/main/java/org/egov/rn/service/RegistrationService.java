package org.egov.rn.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.rn.kafka.RnProducer;
import org.egov.rn.repository.Registration.RegistrationRepository;
import org.egov.rn.service.models.State;
import org.egov.rn.validators.RegistrationValidator;
import org.egov.rn.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RegistrationService {

    private RegistrationValidator registrationValidator;
    private RegistrationEnrichmentService registrationEnrichmentService;

    private WorkflowService workflowService;

    private RnProducer rnProducer;

    private DHIS2Service dhis2Service;

    private RegistrationRepository registrationRepository;

    @Autowired
    public RegistrationService(RegistrationValidator registrationValidator,
                               RegistrationEnrichmentService registrationEnrichmentService,
                               WorkflowService workflowService,
                               RnProducer rnProducer,
                               DHIS2Service dhis2Service,
                               RegistrationRepository registrationRepository) {
        this.registrationValidator = registrationValidator;
        this.registrationEnrichmentService = registrationEnrichmentService;
        this.workflowService = workflowService;
        this.rnProducer = rnProducer;
        this.dhis2Service = dhis2Service;
        this.registrationRepository = registrationRepository;
    }

    public RegistrationDetails register(RegistrationRequest registrationRequest) {
        registrationValidator.validate(registrationRequest);
        log.info("Request validated successfully");
        registrationEnrichmentService.enrich(registrationRequest);
        log.info("Enrichment successful {}", registrationRequest);
        rnProducer.send("save-hh-registration", registrationRequest);
        log.info("Registration saved successfully");
        dhis2Service.submitDataToDhis2(registrationRequest);
        State state = workflowService.updateWorkflowStatus(registrationRequest);
        log.info("Workflow updated successfully to state {}", state.getState());
        return HouseholdRegistrationDetails.builder()
                .registrationId(registrationRequest.getRegistration().getRegistrationId())
                .householdId(((HouseholdRegistration) registrationRequest.getRegistration()).getHouseholdId())
                .build();
    }

    public List<RegistrationData> getAllRegistration(){
        return registrationRepository.getRegistrations();
    }

    public RegistrationData getRegistrationBy(String registrationId){
        return registrationRepository.getRegistrationsBy(registrationId);
    }

    public List<RegistrationData> getRegistrationPast(Long lastModifiedTime){
        return registrationRepository.getRegistrationPast(lastModifiedTime);
    }


}
