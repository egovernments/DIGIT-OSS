package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;
import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FundRequest implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    @SafeHtml
    private String tenantId;
    private List<Integer> ids;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;
    private Boolean active;
    private Integer pageSize;
    private Integer Offset;
    @SafeHtml
    private String sortBy;

    public FundRequest() {
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

    public List<Integer> getIds() {
        return ids;
    }

    public void setIds(final List<Integer> ids) {
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(final Boolean active) {
        this.active = active;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(final Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getOffset() {
        return Offset;
    }

    public void setOffset(final Integer offset) {
        Offset = offset;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(final String sortBy) {
        this.sortBy = sortBy;
    }

}
