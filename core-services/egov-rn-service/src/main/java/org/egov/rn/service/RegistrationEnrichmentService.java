package org.egov.rn.service;

import org.egov.rn.web.models.AuditDetails;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.stereotype.Service;

@Service
public class RegistrationEnrichmentService {

    public void enrich(RegistrationRequest registrationRequest) {
        AuditDetails auditDetails = AuditDetails.builder()
                .createdBy(registrationRequest.getRequestInfo().getUserInfo().getUuid())
                .lastModifiedBy(registrationRequest.getRequestInfo().getUserInfo().getUuid())
                .build();
        registrationRequest.getRegistration().setAuditDetails(auditDetails);
        registrationRequest.getRegistration().setRegistrationId("registration-id");
        if (registrationRequest.getRegistration() instanceof HouseholdRegistration) {
            ((HouseholdRegistration) registrationRequest.getRegistration()).setHouseholdId("household-id");
        }
    }
}
