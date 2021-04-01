package org.egov.tenant.domain.exception;

import lombok.Getter;
import org.egov.tenant.domain.model.Tenant;

@Getter
public class InvalidTenantDetailsException extends RuntimeException {

    private static final long serialVersionUID = -3442655486606529195L;

    private Tenant tenant;

    public InvalidTenantDetailsException(Tenant tenant) {
        this.tenant = tenant;
    }
}
