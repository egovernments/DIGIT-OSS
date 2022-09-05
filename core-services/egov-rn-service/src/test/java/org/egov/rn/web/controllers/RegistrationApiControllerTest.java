package org.egov.rn.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.exception.EnrichmentException;
import org.egov.rn.exception.ProducerException;
import org.egov.rn.exception.ValidationException;
import org.egov.rn.exception.WorkflowException;
import org.egov.rn.helper.RegistrationRequestTestBuilder;
import org.egov.rn.service.RegistrationService;
import org.egov.rn.web.models.HouseholdRegistrationDetails;
import org.egov.rn.web.models.RegistrationDetails;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.utils.ExceptionUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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

        mockMvc.perform(post("/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.RegistrationDetails.registrationId")
                        .value("MQ-RN-2022-08-26-000002"))
                .andExpect(jsonPath("$.RegistrationDetails.householdId")
                        .value("MQ-RN-2022-08-26-HHID-000001"));
    }

    @Test
    @DisplayName("should return Http status as 500 in case of an exception in enrichment stage")
    void shouldReturnHttpStatus500InCaseOfAnErrorInEnrichment() throws Exception {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        when(registrationService.register(any(RegistrationRequest.class)))
                .thenThrow(new EnrichmentException("Error in enrichment"));

        mockMvc.perform(post("/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.Errors[0].message")
                        .value("Error in enrichment"));
    }

    @Test
    @DisplayName("should return Http status as 500 in case of an exception in updating workflow")
    void shouldReturnHttpStatus500InCaseOfAnErrorInWorkflowUpdate() throws Exception {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        when(registrationService.register(any(RegistrationRequest.class)))
                .thenThrow(new WorkflowException("Error in workflow"));

        mockMvc.perform(post("/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.Errors[0].message")
                        .value("Error in workflow"));
    }

    @Test
    @DisplayName("should return Http status as 400 in case of a validation error")
    void shouldReturnHttpStatus400InCaseOfAValidationError() throws Exception {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        when(registrationService.register(any(RegistrationRequest.class)))
                .thenThrow(new ValidationException("Error in validation"));

        mockMvc.perform(post("/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.Errors[0].message")
                        .value("Error in validation"));
    }

    @Test
    @DisplayName("should return Http status as 500 in case of an error while producing to Kafka")
    void shouldReturnHttpStatus500InCaseOfAnErrorInProducingToKafka() throws Exception {

        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder.builder()
                .withRequestInfo()
                .withHeadOfHousehold()
                .build();

        when(registrationService.register(any(RegistrationRequest.class)))
                .thenThrow(new ProducerException("Error in producing to kafka"));

        mockMvc.perform(post("/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.Errors[0].message")
                        .value("Error in producing to kafka"));
    }
}