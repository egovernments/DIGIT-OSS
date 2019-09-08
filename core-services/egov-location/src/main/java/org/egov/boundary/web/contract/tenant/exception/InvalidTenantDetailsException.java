package org.egov.boundary.web.contract.tenant.exception;


import lombok.Getter;
import org.egov.boundary.web.contract.tenant.model.Tenant;

@Getter
public class InvalidTenantDetailsException extends RuntimeException {

    private static final long serialVersionUID = -3442655486606529195L;

    private Tenant tenant;

    public InvalidTenantDetailsException(Tenant tenant) {
        this.tenant = tenant;
    }
}
