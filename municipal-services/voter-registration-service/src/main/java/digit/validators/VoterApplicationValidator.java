package digit.validators;

import digit.repository.VoterRegistrationRepository;
import digit.web.models.coremodels.VoterApplicationSearchCriteria;
import digit.web.models.VoterRegistrationApplication;
import digit.web.models.VoterRegistrationRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

@Component
public class VoterApplicationValidator {

    @Autowired
    private VoterRegistrationRepository repository;

    public void validateVoterApplication(VoterRegistrationRequest voterRegistrationRequest) {
        voterRegistrationRequest.getVoterRegistrationApplications().forEach(application -> {
            if(ObjectUtils.isEmpty(application.getTenantId()))
                throw new CustomException("EG_VT_APP_ERR", "tenantId is mandatory for creating voter registration applications");
        });
    }

    public VoterRegistrationApplication validateApplicationExistence(VoterRegistrationApplication voterRegistrationApplication) {
        return repository.getApplications(VoterApplicationSearchCriteria.builder().applicationNumber(voterRegistrationApplication.getApplicationNumber()).build()).get(0);
    }
}
