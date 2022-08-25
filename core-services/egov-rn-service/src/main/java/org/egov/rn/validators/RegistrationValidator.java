package org.egov.rn.validators;

import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.Registration;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.stereotype.Component;

import java.security.InvalidParameterException;

@Component
public class RegistrationValidator {

    public void validate(RegistrationRequest registrationRequest) {
        if (registrationRequest == null || registrationRequest.getRegistration() == null) {
            throw new InvalidParameterException("null payload");
        }
        if (registrationRequest.getTenantId() == null) {
            throw new InvalidParameterException("tenantId cannot be null");
        }
        Registration registration = registrationRequest.getRegistration();
        if (registration instanceof HouseholdRegistration) {
            HouseholdRegistration householdRegistration = (HouseholdRegistration) registration;
            if (householdRegistration.getName() == null) {
                throw new InvalidParameterException("name cannot be null");
            }
            if (Boolean.FALSE.equals(householdRegistration.getIsHead())
                    && householdRegistration.getHouseholdId() == null) {
                throw new InvalidParameterException("a member of a household needs to have a householdId");
            }
        }
    }
}
