package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class BankBranchResponse implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 8098459522682163493L;
    private ResponseInfo responseInfo;
    private List<BankBranch> bankBranches;
    private Pagination page;

    public BankBranchResponse() {
    }

    public BankBranchResponse(final ResponseInfo responseInfo, final List<BankBranch> bankBranches,
            final Pagination page) {
        this.responseInfo = responseInfo;
        this.bankBranches = bankBranches;
        this.page = page;
    }

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(final ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<BankBranch> getBankBranches() {
        return bankBranches;
    }

    public void setBankBranches(final List<BankBranch> bankBranches) {
        this.bankBranches = bankBranches;
    }

    public Pagination getPage() {
        return page;
    }

    public void setPage(final Pagination page) {
        this.page = page;
    }

}
