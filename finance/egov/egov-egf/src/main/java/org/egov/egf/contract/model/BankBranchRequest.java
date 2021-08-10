package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;
import org.hibernate.validator.constraints.SafeHtml;

public class BankBranchRequest implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 9056373628830876075L;
    private RequestInfo requestInfo;
    @SafeHtml
    private String tenantId;
    private List<Long> ids;
    private Long bank;
    @SafeHtml
    private String code;
    private Boolean active;
    private Integer offset;
    private Integer pageSize;
    @SafeHtml
    private String sortBy;
    @SafeHtml
    private String name;

    public BankBranchRequest() {
    }

    public BankBranchRequest(final RequestInfo requestInfo, final String tenantId, final List<Long> ids,
            final Long bank, final String code, final Boolean active, final Integer offset, final Integer pageSize,
            final String sortBy, final String name) {
        this.requestInfo = requestInfo;
        this.tenantId = tenantId;
        this.ids = ids;
        this.bank = bank;
        this.code = code;
        this.active = active;
        this.offset = offset;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
        this.name = name;
    }

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(final RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(final List<Long> ids) {
        this.ids = ids;
    }

    public Long getBank() {
        return bank;
    }

    public void setBank(final Long bank) {
        this.bank = bank;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(final Boolean active) {
        this.active = active;
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

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

}
