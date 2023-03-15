package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.validator.constraints.SafeHtml;

public class AuditDetails implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -6546672411255429027L;
    @SafeHtml
    private String tenantId;
    private Long createBy;
    private Long lastModifiedBy;
    private Date createdDate;
    private Date lastModifiedDate;

    public AuditDetails() {
    }

    public AuditDetails(final String tenantId, final Long createBy, final Long lastModifiedBy, final Date createdDate,
            final Date lastModifiedDate) {
        this.tenantId = tenantId;
        this.createBy = createBy;
        this.lastModifiedBy = lastModifiedBy;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
    }

    public Long getCreateBy() {
        return createBy;
    }

    public void setCreateBy(final Long createBy) {
        this.createBy = createBy;
    }

    public Long getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(final Long lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(final Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(final Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

}
