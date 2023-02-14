package digit.service;

import digit.config.BTRConfiguration;
import digit.enrichment.BirthApplicationEnrichment;
import digit.producer.Producer;
import digit.repository.BirthRegistrationRepository;
import digit.validator.BirthApplicationValidator;
import digit.web.models.BirthApplicationSearchCriteria;
import digit.web.models.BirthRegistrationApplication;
import digit.web.models.BirthRegistrationRequest;
import digit.web.models.Workflow;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class BirthRegistrationService {

    @Autowired
    private BirthApplicationValidator birthApplicationValidator;
    @Autowired
    private BirthApplicationEnrichment birthApplicationEnrichment;
    @Autowired
    private Producer producer;
    @Autowired
    private BTRConfiguration configuration;
    @Autowired
    private BirthRegistrationRepository birthRegistrationRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private WorkflowService workflowService;
    @Autowired
    private CalculationService calculationService;

    public List<BirthRegistrationApplication> registerBtRequest(BirthRegistrationRequest birthRegistrationRequest) {
        birthApplicationValidator.validateBirthApplication(birthRegistrationRequest);
        birthApplicationEnrichment.enrichBirthApplication(birthRegistrationRequest);

        // Enrich/Upsert user in upon birth registration
        userService.callUserService(birthRegistrationRequest);

        // Initiate workflow for the new application
        workflowService.updateWorkflowStatus(birthRegistrationRequest);

        //Call calculator to calculate and create demand
        calculationService.getCalculation(birthRegistrationRequest);

        // Push the application to the topic for persister to listen and persist
        producer.push(configuration.getCreateTopic(), birthRegistrationRequest);

        // Return the response back to user
        return birthRegistrationRequest.getBirthRegistrationApplications();
    }

    public List<BirthRegistrationApplication> searchBtApplications(RequestInfo requestInfo, BirthApplicationSearchCriteria birthApplicationSearchCriteria) {
        // Fetch applications from database according to the given search criteria
        List<BirthRegistrationApplication> applications = birthRegistrationRepository.getApplications(birthApplicationSearchCriteria);

        // If no applications are found matching the given criteria, return an empty list
        if(CollectionUtils.isEmpty(applications))
            return new ArrayList<>();

        // Enrich mother and father of applicant objects
        applications.forEach(application -> {
            birthApplicationEnrichment.enrichFatherApplicantOnSearch(application);
            birthApplicationEnrichment.enrichMotherApplicantOnSearch(application);
        });

        applications.forEach(application -> {
            application.setWorkflow(Workflow.builder().status(workflowService.getCurrentWorkflow(requestInfo, application.getTenantId(), application.getApplicationNumber()).getState().getState()).build());
        });

        // Otherwise, return the found applications
        return applications;
    }

    public List<BirthRegistrationApplication> updateBtApplication(BirthRegistrationRequest birthRegistrationRequest) {
        // Validate whether the application that is being requested for update indeed exists
        List<BirthRegistrationApplication> existingApplication = birthApplicationValidator.validateApplicationUpdateRequest(birthRegistrationRequest);
        // Enrich application upon update
        birthApplicationEnrichment.enrichBirthApplicationUponUpdate(birthRegistrationRequest);
        workflowService.updateWorkflowStatus(birthRegistrationRequest);
        // Just like create request, update request will be handled asynchronously by the persister
        producer.push(configuration.getUpdateTopic(), birthRegistrationRequest);

        return birthRegistrationRequest.getBirthRegistrationApplications();
    }

}
