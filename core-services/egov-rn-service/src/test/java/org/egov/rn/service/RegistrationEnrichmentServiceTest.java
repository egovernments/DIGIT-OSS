package org.egov.rn.service;

import org.egov.rn.helper.RegistrationRequestTestBuilder;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationEnrichmentServiceTest {

    @Mock
    private ServiceRequestRepository serviceRequestRepository;
    @InjectMocks
    private RegistrationEnrichmentService registrationEnrichmentService;


    @BeforeEach
    void setUp() {
        registrationEnrichmentService = new RegistrationEnrichmentService(serviceRequestRepository);
    }

    @Test
    @DisplayName("should enrich registration request with audit details and ids")
    void shouldEnrichRegistrationRequestSuccessfullyWithAuditDetailsAndIds() {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withHeadOfHousehold()
                .withRequestInfo()
                .build();
        setupIdGenResMock();

        registrationEnrichmentService.enrich(registrationRequest);

        assertNotNull(registrationRequest.getRegistration().getAuditDetails());
        assertNotNull(registrationRequest.getRegistration().getAuditDetails().getCreatedTime());
        assertNotNull(registrationRequest.getRegistration().getAuditDetails().getLastModifiedTime());
        assertEquals("user-id", registrationRequest.getRegistration().getAuditDetails().getCreatedBy());
        assertEquals("user-id", registrationRequest.getRegistration().getAuditDetails().getLastModifiedBy());
        assertEquals("MQ-RN-2022-08-26-000002", registrationRequest.getRegistration().getRegistrationId());
        assertEquals("MQ-RN-2022-08-26-HHID-000001", ((HouseholdRegistration) registrationRequest.getRegistration()).getHouseholdId());
        verify(serviceRequestRepository, times(1))
                .fetchResult(any(StringBuilder.class), any(Object.class));
    }

    private void setupIdGenResMock() {
        Map idGenRes = getIdGenRes();
        when(serviceRequestRepository.fetchResult(any(StringBuilder.class), any(Object.class)))
                .thenReturn(idGenRes);
    }

    private Map getIdGenRes() {
        String registrationId = "{\"id\": \"MQ-RN-2022-08-26-000002\"}";
        String householdId = "{\"id\": \"MQ-RN-2022-08-26-HHID-000001\"}";
        List<String> idResponses = new ArrayList<>();
        idResponses.add(registrationId);
        idResponses.add(householdId);
        Map idGenRes = new HashMap();
        idGenRes.put("idResponses", idResponses);
        return idGenRes;
    }
}