package org.egov.egf.contract.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class BankAccountRequest implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 2946252349035262831L;
    @SafeHtml
    private String tenantId;
    private Integer offset;
    private Integer pageSize;
    @SafeHtml
    private String sortBy;

    public BankAccountRequest(final String tenantId, final Integer offset, final Integer pageSize,
            final String sortBy) {
        this.tenantId = tenantId;
        this.offset = offset;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
    }

    public BankAccountRequest() {
    }

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(final Integer offset) {
        this.offset = offset;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(final Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(final String sortBy) {
        this.sortBy = sortBy;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

}
