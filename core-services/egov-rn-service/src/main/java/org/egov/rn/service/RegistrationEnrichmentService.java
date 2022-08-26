package org.egov.rn.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.service.models.IdGenerationRequest;
import org.egov.rn.service.models.IdRequest;
import org.egov.rn.service.models.IdResponse;
import org.egov.rn.web.models.AuditDetails;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
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
            Object response = serviceRequestRepository.fetchResult(new StringBuilder(idGenHost + idGenUrl),
                    getIdGenRequest(registrationRequest.getTenantId()));
            ObjectMapper objectMapper = new ObjectMapper();
            IdResponse registrationId = objectMapper.readValue((String) JsonPath.read(response,
                    "$.idResponses.[0]"), IdResponse.class);
            IdResponse householdId = objectMapper.readValue((String) JsonPath.read(response,
                    "$.idResponses.[1]"), IdResponse.class);
            registrationRequest.getRegistration().setRegistrationId(registrationId.getId());
            if (registrationRequest.getRegistration() instanceof HouseholdRegistration) {
                ((HouseholdRegistration) registrationRequest.getRegistration()).setHouseholdId(householdId.getId());
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    private IdGenerationRequest getIdGenRequest(String tenantId) {
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
                .idRequests(idRequestList)
                .build();
    }
}
