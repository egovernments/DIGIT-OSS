package org.egov.domain.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.egov.domain.exception.InvalidTokenSearchCriteriaException;

import static org.springframework.util.StringUtils.isEmpty;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class TokenSearchCriteria {
    private String uuid;
    private String tenantId;

    public void validate() {
        if (isIdAbsent() || isTenantIdAbsent()) {
            throw new InvalidTokenSearchCriteriaException(this);
        }
    }

    public boolean isIdAbsent() {
        return isEmpty(uuid);
    }

    public boolean isTenantIdAbsent() {
        return isEmpty(tenantId);
    }
}
