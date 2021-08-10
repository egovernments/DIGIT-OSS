package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialYearResponse implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 8760849380035651687L;
    private ResponseInfo responseInfo;
    private List<FinancialYear> financialYears;

    @JsonProperty("page")
    private Pagination page;

    public FinancialYearResponse() {
    }

    public FinancialYearResponse(final ResponseInfo responseInfo, final List<FinancialYear> financialYears,
            final Pagination page) {
        this.responseInfo = responseInfo;
        this.financialYears = financialYears;
        this.page = page;
    }

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(final ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<FinancialYear> getFinancialYears() {
        return financialYears;
    }

    public void setFinancialYears(final List<FinancialYear> financialYears) {
        this.financialYears = financialYears;
    }

    public Pagination getPage() {
        return page;
    }

    public void setPage(final Pagination page) {
        this.page = page;
    }

}
