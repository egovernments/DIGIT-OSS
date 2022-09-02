package org.egov.rn.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.rn.exception.EnrichmentException;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.service.models.IdGenerationRequest;
import org.egov.rn.service.models.IdGenerationResponse;
import org.egov.rn.service.models.IdRequest;
import org.egov.rn.service.models.IdResponse;
import org.egov.rn.web.models.AuditDetails;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.Registration;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class RegistrationEnrichmentService {

    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.generate.endpoint}")
    private String idGenUrl;

    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    public RegistrationEnrichmentService(ServiceRequestRepository serviceRequestRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public void enrich(RegistrationRequest registrationRequest) {
        try {
            AuditDetails auditDetails = AuditDetails.builder()
                    .createdTime(System.currentTimeMillis())
                    .createdBy(registrationRequest.getRequestInfo().getUserInfo().getUuid())
                    .lastModifiedTime(System.currentTimeMillis())
                    .lastModifiedBy(registrationRequest.getRequestInfo().getUserInfo().getUuid())
                    .build();
            registrationRequest.getRegistration().setAuditDetails(auditDetails);
            IdGenerationResponse response = (IdGenerationResponse) serviceRequestRepository.fetchResult(new StringBuilder(idGenHost + idGenUrl),
                    getIdGenRequest(registrationRequest.getRequestInfo(), registrationRequest.getRegistration().getTenantId()), IdGenerationResponse.class);
            IdResponse registrationId = response.getIdResponses().get(0);
            IdResponse householdId = response.getIdResponses().get(1);
            registrationRequest.getRegistration().setRegistrationId(registrationId.getId());
            if (registrationRequest.getRegistration() instanceof HouseholdRegistration) {
                ((HouseholdRegistration) registrationRequest.getRegistration()).setHouseholdId(householdId.getId());
                ((HouseholdRegistration) registrationRequest.getRegistration()).setMd5Hash(generateMd5Hash(registrationRequest.getRegistration()));
            }
        } catch (Exception ex) {
            throw new EnrichmentException(ex.getMessage(), ex);
        }
    }

    private String generateMd5Hash(Registration registration) throws NoSuchAlgorithmException {
        HouseholdRegistration householdRegistration = (HouseholdRegistration) registration;
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] theMD5digest = md.digest(householdRegistration.getName()
                .concat(householdRegistration.getDateOfBirth().toString())
                .concat(householdRegistration.getGender()).getBytes(Charset.defaultCharset()));
        return new String(theMD5digest);
    }

    private IdGenerationRequest getIdGenRequest(RequestInfo requestInfo, String tenantId) {
        IdRequest registrationIdRequest = IdRequest.builder()
                .tenantId(tenantId)
                .idName("rn.registrationId").build();
        IdRequest householdIdRequest = IdRequest.builder()
                .tenantId(tenantId)
                .idName("rn.householdId")
                .build();
        List<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(registrationIdRequest);
        idRequestList.add(householdIdRequest);
        return IdGenerationRequest.builder()
                .requestInfo(requestInfo)
                .idRequests(idRequestList)
                .build();
    }
}
