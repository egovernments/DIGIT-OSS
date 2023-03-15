package org.egov.tenant.domain.exception;

import lombok.Getter;
import org.egov.tenant.domain.model.Tenant;

@Getter
public class DuplicateTenantCodeException extends RuntimeException {

    private Tenant tenant;

    private static final long serialVersionUID = -3442655486606529295L;

    public DuplicateTenantCodeException(Tenant tenant) {
        this.tenant = tenant;
    }
}
