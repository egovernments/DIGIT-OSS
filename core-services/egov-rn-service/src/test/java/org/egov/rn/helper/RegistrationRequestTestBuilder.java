package org.egov.rn.helper;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;

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
                        .registrationType("HouseholdRegistration")
                        .name("John Doe")
                        .gender("Male")
                        .dateOfRegistration(20220822L)
                        .dateOfBirth(19910505L)
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
                        .registrationType("HouseholdRegistration")
                        .tenantId("mq")
                        .name("John Doe")
                        .gender("Male")
                        .dateOfRegistration(20220822L)
                        .dateOfBirth(19910505L)
                        .isHead(false)
                        .householdId("household-id").build());
        return this;
    }

    public RegistrationRequestTestBuilder withNullTenantId() {
        builder
                .registration(HouseholdRegistration.builder()
                        .registrationType("HouseholdRegistration")
                        .name("John Doe")
                        .gender("Male")
                        .dateOfRegistration(20220822L)
                        .dateOfBirth(19910505L)
                        .isHead(false)
                        .householdId("household-id").build());
        return this;
    }

    public RegistrationRequestTestBuilder withMemberWithoutHouseholdId() {
        builder
                .registration(HouseholdRegistration.builder()
                        .registrationType("HouseholdRegistration")
                        .tenantId("mq")
                        .name("John Doe")
                        .gender("Male")
                        .dateOfRegistration(20220822L)
                        .dateOfBirth(19910505L)
                        .isHead(false)
                        .householdId(null).build());
        return this;
    }


    public RegistrationRequest build() {
        return builder.build();
    }
}
