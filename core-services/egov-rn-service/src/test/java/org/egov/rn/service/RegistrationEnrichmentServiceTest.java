package org.egov.rn.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class RegistrationEnrichmentServiceTest {

    private RegistrationEnrichmentService registrationEnrichmentService;

    @BeforeEach
    void setUp() {
        registrationEnrichmentService = new RegistrationEnrichmentService();
    }

    @Test
    @DisplayName("should enrich registration request with audit details and ids")
    void shouldEnrichRegistrationRequestSuccessfullyWithAuditDetailsAndIds() {

        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .requestInfo(RequestInfo.builder().userInfo(User.builder().uuid("user-id").build()).build())
                .tenantId("mq")
                .registration(HouseholdRegistration.builder()
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(true).build())
                .build();

        registrationEnrichmentService.enrich(registrationRequest);

        assertNotNull(registrationRequest.getRegistration().getAuditDetails());
        assertEquals("user-id", registrationRequest.getRegistration().getAuditDetails().getCreatedBy());
        assertEquals("user-id", registrationRequest.getRegistration().getAuditDetails().getLastModifiedBy());
        assertEquals("registration-id", registrationRequest.getRegistration().getRegistrationId());
        assertEquals("household-id", ((HouseholdRegistration) registrationRequest.getRegistration()).getHouseholdId());
    }
}