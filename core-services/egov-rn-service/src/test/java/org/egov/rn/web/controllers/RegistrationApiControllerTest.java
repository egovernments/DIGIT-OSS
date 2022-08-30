package org.egov.rn.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.helper.RegistrationRequestTestBuilder;
import org.egov.rn.service.RegistrationService;
import org.egov.rn.web.models.HouseholdRegistrationDetails;
import org.egov.rn.web.models.RegistrationDetails;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RegistrationApiController.class)
class RegistrationApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegistrationService registrationService;

    @BeforeEach
    void setUp() {
    }

    @Test
    @DisplayName("should return Http status as 200 and registration details on successful registration")
    void shouldReturnHttpStatus200AndRegistrationIdOnSuccessfulRegistration() throws Exception {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        RegistrationDetails registrationDetails = HouseholdRegistrationDetails.builder()
                .registrationId("MQ-RN-2022-08-26-000002")
                .householdId("MQ-RN-2022-08-26-HHID-000001")
                .build();

        when(registrationService.register(any(RegistrationRequest.class))).thenReturn(registrationDetails);

        mockMvc.perform(post("/egov-rn-service/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.RegistrationDetails.registrationId")
                        .value("MQ-RN-2022-08-26-000002"))
                .andExpect(jsonPath("$.RegistrationDetails.householdId")
                        .value("MQ-RN-2022-08-26-HHID-000001"));
    }
}