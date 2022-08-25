package org.egov.rn.validators;

import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.security.InvalidParameterException;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RegistrationValidatorTest {
    private RegistrationValidator registrationValidator;

    @BeforeEach
    void setUp() {
        registrationValidator = new RegistrationValidator();
    }

    @Test
    @DisplayName("should validate registration request for a household successfully")
    void shouldValidateRegistrationRequestForAHouseholdSuccessfully() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .tenantId("mq")
                .registration(HouseholdRegistration.builder()
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(true).build())
                .build();
        assertDoesNotThrow(() -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should validate registration request for a member of a household successfully")
    void shouldValidateRegistrationRequestForAMemberOfTheHouseholdSuccessfully() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .tenantId("mq")
                .registration(HouseholdRegistration.builder()
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId("household-id").build())
                .build();
        assertDoesNotThrow(() -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if registrationReuqest is null")
    void shouldThrowInvalidParameterExceptionIfRegistrationRequestIsNull() {
        assertThrows(InvalidParameterException.class, () -> registrationValidator.validate(null));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if registration is null")
    void shouldThrowInvalidParameterExceptionIfRegistrationIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .registration(null)
                .build();
        assertThrows(InvalidParameterException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if name is null")
    void shouldThrowInvalidParameterExceptionIfNameIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .registration(HouseholdRegistration.builder().name(null).build())
                .build();
        assertThrows(InvalidParameterException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if tenantId is null")
    void shouldThrowInvalidParameterExceptionIfTenantIdIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .registration(HouseholdRegistration.builder()
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId("household-id").build())
                .build();
        assertThrows(InvalidParameterException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if the member is not a head but has null householdId")
    void shouldThrowInvalidParameterExceptionIfIsHeadIsFalseAndHouseholdIdIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .registration(HouseholdRegistration.builder()
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId(null)
                        .build())
                .build();
        assertThrows(InvalidParameterException.class, () -> registrationValidator.validate(registrationRequest));
    }
}