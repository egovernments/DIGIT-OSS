package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;
import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialYearRequest implements Serializable {

    private static final long serialVersionUID = 2769951203281774986L;

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    @SafeHtml
    private String teanantId;
    private List<Integer> ids;
    @SafeHtml
    private String finYearRange;
    private Date startingDate;
    private Date endingDate;
    private boolean active;
    private boolean isActiveForPosting;

    private Integer pageSize;
    private Integer offset;
    @SafeHtml
    private String sortBy;

    public FinancialYearRequest() {
    }

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(final RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public String getTeanantId() {
        return teanantId;
    }

    public void setTeanantId(final String teanantId) {
        this.teanantId = teanantId;
    }

    public List<Integer> getIds() {
        return ids;
    }

    public void setIds(final List<Integer> ids) {
        this.ids = ids;
    }

    public String getFinYearRange() {
        return finYearRange;
    }

    public void setFinYearRange(final String finYearRange) {
        this.finYearRange = finYearRange;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(final Date startingDate) {
        this.startingDate = startingDate;
    }

    public Date getEndingDate() {
        return endingDate;
    }

    public void setEndingDate(final Date endingDate) {
        this.endingDate = endingDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(final boolean active) {
        this.active = active;
    }

    public boolean isActiveForPosting() {
        return isActiveForPosting;
    }

    public void setActiveForPosting(final boolean isActiveForPosting) {
        this.isActiveForPosting = isActiveForPosting;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(final Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(final Integer offset) {
        this.offset = offset;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(final String sortBy) {
        this.sortBy = sortBy;
    }

}
