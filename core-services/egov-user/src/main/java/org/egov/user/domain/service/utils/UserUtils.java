package org.egov.user.domain.service.utils;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import org.egov.user.domain.model.enums.UserType;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Getter
@Component
public class UserUtils {
	
    public String getStateLevelTenantForCitizen(String tenantId, UserType userType) {
        if (!isNull(userType) && userType.equals(UserType.CITIZEN) && !isEmpty(tenantId) && tenantId.contains("."))
            return tenantId.split("\\.")[0];
        else
            return tenantId;
    }
}
