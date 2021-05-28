package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BankRequest implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -4973193018259908346L;
    // private RequestInfo requestInfo;
    @SafeHtml
    private String tenantId;
    private List<Long> ids;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;
    private boolean active;

    private Integer offset;
    private Integer pageSize;
    @SafeHtml
    private String sortBy;

    public BankRequest() {
    }

    public BankRequest(/* RequestInfo requestInfo, */final String tenantId, final List<Long> ids, final String name,
            final String code, final boolean active, final Integer offset, final Integer pageSize,
            final String sortBy) {
        // this.requestInfo = requestInfo;
        this.tenantId = tenantId;
        this.ids = ids;
        this.name = name;
        this.code = code;
        this.active = active;
        this.offset = offset;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

    // public RequestInfo getRequestInfo() {
    // return requestInfo;
    // }
    //
    // public void setRequestInfo(RequestInfo requestInfo) {
    // this.requestInfo = requestInfo;
    // }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(final List<Long> ids) {
        this.ids = ids;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(final boolean active) {
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

}
