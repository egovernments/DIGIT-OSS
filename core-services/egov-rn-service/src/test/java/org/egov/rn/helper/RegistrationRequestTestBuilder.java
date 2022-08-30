package org.egov.rn.helper;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;

import java.time.LocalDate;

public class RegistrationRequestTestBuilder {
    private RegistrationRequest.RegistrationRequestBuilder builder;

    public static RegistrationRequestTestBuilder builder() {
        return new RegistrationRequestTestBuilder();
    }

    public RegistrationRequestTestBuilder() {
        this.builder = RegistrationRequest.builder();
    }

    public RegistrationRequestTestBuilder withHeadOfHousehold() {
        builder
                .registration(HouseholdRegistration.builder()
                        .tenantId("mq")
                        .registrationType("Household")
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(true).build());
        return this;
    }

    public RegistrationRequestTestBuilder withRequestInfo() {
        builder
                .requestInfo(RequestInfo.builder()
                        .userInfo(User.builder().uuid("user-id")
                                .build()).build());
        return this;
    }

    public RegistrationRequestTestBuilder withRequestInfoAndNullUuid() {
        builder
                .requestInfo(RequestInfo.builder()
                        .userInfo(User.builder().uuid(null)
                                .build()).build());
        return this;
    }

    public RegistrationRequestTestBuilder withMemberOfHousehold() {
        builder
                .registration(HouseholdRegistration.builder()
                        .registrationType("Household")
                        .tenantId("mq")
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId("household-id").build());
        return this;
    }

    public RegistrationRequestTestBuilder withNullTenantId() {
        builder
                .registration(HouseholdRegistration.builder()
                        .registrationType("Household")
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId("household-id").build());
        return this;
    }

    public RegistrationRequestTestBuilder withMemberWithoutHouseholdId() {
        builder
                .registration(HouseholdRegistration.builder()
                        .registrationType("Household")
                        .tenantId("mq")
                        .name("John Doe")
                        .gender(HouseholdRegistration.GenderEnum.MALE)
                        .dateOfRegistration(LocalDate.of(2022, 8, 22))
                        .dateOfBirth(LocalDate.of(1991, 5, 5))
                        .isHead(false)
                        .householdId(null).build());
        return this;
    }


    public RegistrationRequest build() {
        return builder.build();
    }
}
