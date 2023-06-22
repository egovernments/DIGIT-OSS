package digit.service;

import digit.enrichment.VoterApplicationEnrichment;
import digit.producer.Producer;
import digit.repository.VoterRegistrationRepository;
import digit.web.models.*;
import digit.validators.VoterApplicationValidator;
import digit.web.models.coremodels.VoterApplicationSearchCriteria;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class VoterRegistrationService {

    @Autowired
    private VoterApplicationValidator validator;

    @Autowired
    private VoterApplicationEnrichment enrichmentUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private VoterRegistrationRepository voterRegistrationRepository;

    @Autowired
    private Producer producer;

    public List<VoterRegistrationApplication> registerVtRequest(VoterRegistrationRequest voterRegistrationRequest) {
        // Validate applications
        validator.validateVoterApplication(voterRegistrationRequest);

        // Enrich applications
        enrichmentUtil.enrichVoterApplication(voterRegistrationRequest);

        // Enrich/Upsert user in upon voter registration
        userService.callUserService(voterRegistrationRequest);

        // Initiate workflow for the new application
        workflowService.updateWorkflowStatus(voterRegistrationRequest);

        // Push the application to the topic for persister to listen and persist
        producer.push("save-vt-application", voterRegistrationRequest);

        // Return the response back to user
        return voterRegistrationRequest.getVoterRegistrationApplications();
    }

    public List<VoterRegistrationApplication> searchVtApplications(RequestInfo requestInfo, VoterApplicationSearchCriteria voterApplicationSearchCriteria) {
        // Fetch applications from database according to the given search criteria
        List<VoterRegistrationApplication> applications = voterRegistrationRepository.getApplications(voterApplicationSearchCriteria);

        // If no applications are found matching the given criteria, return an empty list
        if(CollectionUtils.isEmpty(applications))
            return new ArrayList<>();

        // Otherwise return the found applications
        return applications;
    }

    public VoterRegistrationApplication updateVtApplication(VoterRegistrationRequest voterRegistrationRequest) {
        // Validate whether the application that is being requested for update indeed exists
        VoterRegistrationApplication existingApplication = validator.validateApplicationExistence(voterRegistrationRequest.getVoterRegistrationApplications().get(0));
        existingApplication.setWorkflow(voterRegistrationRequest.getVoterRegistrationApplications().get(0).getWorkflow());
        voterRegistrationRequest.setVoterRegistrationApplications(Collections.singletonList(existingApplication));

        // Enrich application upon update
        enrichmentUtil.enrichVoterApplicationUponUpdate(voterRegistrationRequest);

        workflowService.updateWorkflowStatus(voterRegistrationRequest);

        // Just like create request, update request will be handled asynchronously by the persister
        producer.push("update-vt-application", voterRegistrationRequest.getVoterRegistrationApplications().get(0));

        return voterRegistrationRequest.getVoterRegistrationApplications().get(0);
    }
}
