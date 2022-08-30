package org.egov.rn.validators;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.rn.exception.ValidationException;
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

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationValidatorTest {

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @InjectMocks
    private RegistrationValidator registrationValidator;

    @BeforeEach
    void setUp() {
        registrationValidator = new RegistrationValidator(serviceRequestRepository);
    }

    @Test
    @DisplayName("should validate registration request for a household successfully")
    void shouldValidateRegistrationRequestForAHouseholdSuccessfully() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withHeadOfHousehold()
                .withRequestInfo()
                .build();

        setupMdmsResMock();

        assertDoesNotThrow(() -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should validate registration request for a member of a household successfully")
    void shouldValidateRegistrationRequestForAMemberOfTheHouseholdSuccessfully() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withMemberOfHousehold()
                .withRequestInfo()
                .build();

        setupMdmsResMock();

        assertDoesNotThrow(() -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if registrationReuqest is null")
    void shouldThrowInvalidParameterExceptionIfRegistrationRequestIsNull() {
        assertThrows(ValidationException.class, () -> registrationValidator.validate(null));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if registration is null")
    void shouldThrowInvalidParameterExceptionIfRegistrationIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .requestInfo(RequestInfo.builder().build())
                .registration(null)
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if name is null")
    void shouldThrowInvalidParameterExceptionIfNameIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequest.builder()
                .requestInfo(RequestInfo.builder().userInfo(User.builder().uuid("user-uuid").build()).build())
                .registration(HouseholdRegistration.builder().name(null).build())
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if tenantId is null")
    void shouldThrowInvalidParameterExceptionIfTenantIdIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withRequestInfo()
                .withNullTenantId()
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if the member is not a head but has null householdId")
    void shouldThrowInvalidParameterExceptionIfIsHeadIsFalseAndHouseholdIdIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withRequestInfo()
                .withMemberWithoutHouseholdId()
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if the requestInfo is null")
    void shouldThrowInvalidParameterExceptionIfRequestInfoDoesNotHaveUserUuid() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withMemberWithoutHouseholdId()
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should throw InvalidParameterException if the user uuid is null")
    void shouldThrowInvalidParameterExceptionIfUserUuidIsNull() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withRequestInfoAndNullUuid()
                .withMemberWithoutHouseholdId()
                .build();
        assertThrows(ValidationException.class, () -> registrationValidator.validate(registrationRequest));
    }

    @Test
    @DisplayName("should be able to fetch validation rules from MDMS")
    void shouldFetchValidationRulesFromMDMSSuccessfully() {
        RegistrationRequest registrationRequest = RegistrationRequestTestBuilder
                .builder()
                .withHeadOfHousehold()
                .withRequestInfo()
                .build();

        setupMdmsResMock();

        assertDoesNotThrow(() -> registrationValidator.validate(registrationRequest));
        verify(serviceRequestRepository, times(1))
                .fetchResult(any(StringBuilder.class), any(Object.class));
    }

    private void setupMdmsResMock() {
        Map mdmsRes = getMsmsResponse();
        when(serviceRequestRepository.fetchResult(any(StringBuilder.class), any(Object.class)))
                .thenReturn(mdmsRes);
    }

    private static Map getMsmsResponse() {
        String validation = "{\"name\": \"checkIfAlreadyExists\", \"code\": \"CHECK_IF_ALREADY_EXISTS\", \"active\": true}";
        List<String> stringList = new ArrayList<>();
        stringList.add(validation);
        Map validations = new HashMap();
        validations.put("validations", stringList);
        Map egovRnService = new HashMap();
        egovRnService.put("egov-rn-service", validations);
        Map mdmsRes = new HashMap();
        mdmsRes.put("MdmsRes", egovRnService);
        return mdmsRes;
    }
}