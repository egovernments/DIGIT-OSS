package digit.enrichment;

import digit.utils.IdgenUtil;
import digit.web.models.AuditDetails;
import digit.web.models.VoterRegistrationApplication;
import digit.web.models.VoterRegistrationRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.UUID;

@Component
public class VoterApplicationEnrichment {

    @Autowired
    private IdgenUtil idgenUtil;

    public void enrichVoterApplication(VoterRegistrationRequest voterRegistrationRequest) {
        List<String> voterRegistrationIdList = idgenUtil.getIdList(voterRegistrationRequest.getRequestInfo(), voterRegistrationRequest.getVoterRegistrationApplications().get(0).getTenantId(), "vtr.registrationid", "", voterRegistrationRequest.getVoterRegistrationApplications().size());
        Integer index = 0;
        for(VoterRegistrationApplication application : voterRegistrationRequest.getVoterRegistrationApplications()){
            // Enrich audit details
            AuditDetails auditDetails = AuditDetails.builder().createdBy(voterRegistrationRequest.getRequestInfo().getUserInfo().getUuid()).createdTime(System.currentTimeMillis()).lastModifiedBy(voterRegistrationRequest.getRequestInfo().getUserInfo().getUuid()).lastModifiedTime(System.currentTimeMillis()).build();
            application.setAuditDetails(auditDetails);

            // Enrich UUID
            application.setId(UUID.randomUUID().toString());

            // Enrich registration Id
            application.getAddress().setRegistrationId(application.getId());

            // Enrich address UUID
            application.getAddress().setId(UUID.randomUUID().toString());

            //Enrich application number from IDgen
            application.setApplicationNumber(voterRegistrationIdList.get(index++));

        }
    }

    public void enrichVoterApplicationUponUpdate(VoterRegistrationRequest voterRegistrationRequest) {
        // Enrich lastModifiedTime and lastModifiedBy in case of update
        voterRegistrationRequest.getVoterRegistrationApplications().get(0).getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
        voterRegistrationRequest.getVoterRegistrationApplications().get(0).getAuditDetails().setLastModifiedBy(voterRegistrationRequest.getRequestInfo().getUserInfo().getUuid());
    }
}
