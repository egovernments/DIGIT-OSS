package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class BankResponse implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 3346360754326833147L;
    private ResponseInfo responseInfo;
    private List<Bank> banks;
    private Pagination page;

    public BankResponse() {
    }

    public BankResponse(final ResponseInfo responseInfo, final List<Bank> banks, final Pagination page) {
        this.responseInfo = responseInfo;
        this.banks = banks;
        this.page = page;
    }

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(final ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<Bank> getBanks() {
        return banks;
    }

    public void setBanks(final List<Bank> banks) {
        this.banks = banks;
    }

    public Pagination getPage() {
        return page;
    }

    public void setPage(final Pagination page) {
        this.page = page;
    }

}
