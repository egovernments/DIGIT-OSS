package org.egov.rn.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.utils.UuidProvider;
import org.egov.rn.web.models.Registration;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RegistrationApiController.class)
class RegistrationApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UuidProvider uuidProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

    }

    @Test
    @DisplayName("should return Http status as 200 and registrationId on successful registration")
    void shouldReturnHttpStatus200AndRegistrationIdOnSuccessfulRegistration() throws Exception {
        when(uuidProvider.uuid()).thenReturn(UUID.fromString("0000-00-00-00-000000"));

        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .registration(Registration.builder().name("John Doe")
                        .registrationType(Registration.RegistrationTypeEnum.HOUSEHOLD)
                        .build()).build();
        mockMvc.perform(post("/egov-rn-service/registration/v1/_create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registrationId")
                        .value("00000000-0000-0000-0000-000000000000"));
    }
}