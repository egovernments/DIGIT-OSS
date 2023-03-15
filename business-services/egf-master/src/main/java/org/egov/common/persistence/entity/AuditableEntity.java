package org.egov.common.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Auditable;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuditableEntity {
    protected String tenantId;
    protected String createdBy;
    protected String lastModifiedBy;
    protected Date createdDate;
    protected Date lastModifiedDate;
    protected String deleteReason;

    protected void toDomain(Auditable domain) {
        if (createdBy != null) {
            if (!createdBy.isEmpty())
                domain.setCreatedBy(User.builder().id(Long.parseLong(this.getCreatedBy())).build());
        }
        if (lastModifiedBy != null) {
            if (!lastModifiedBy.isEmpty())
                domain.setLastModifiedBy(User.builder().id(Long.parseLong(this.getLastModifiedBy())).build());
        }
        domain.setCreatedDate(this.getCreatedDate());
        domain.setLastModifiedDate(this.getLastModifiedDate());
        domain.setTenantId(this.getTenantId());
        domain.setDeleteReason(this.getDeleteReason());
    }

    protected void toEntity(Auditable domain) {
        this.setCreatedBy(domain.getCreatedBy() != null ? domain.getCreatedBy().getId().toString() : null);
        this.setLastModifiedBy(domain.getLastModifiedBy() != null ? domain.getLastModifiedBy().getId().toString() : null);
        this.setCreatedDate(domain.getCreatedDate());
        this.setLastModifiedDate(domain.getLastModifiedDate());
        this.setTenantId(domain.getTenantId());
        this.setDeleteReason(domain.getDeleteReason());
    }

}
