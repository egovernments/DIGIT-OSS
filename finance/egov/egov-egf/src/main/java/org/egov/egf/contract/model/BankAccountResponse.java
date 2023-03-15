package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class BankAccountResponse implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 4577981079298009495L;
    private List<BankAccount> bankaccounts;
    private Pagination page;

    public BankAccountResponse(final ResponseInfo responseInfo, final List<BankAccount> bankaccounts,
            final Pagination page) {
        this.bankaccounts = bankaccounts;
        this.page = page;
    }

    public BankAccountResponse() {
    }

    public List<BankAccount> getBankaccounts() {
        return bankaccounts;
    }

    public void setBankaccounts(final List<BankAccount> bankaccounts) {
        this.bankaccounts = bankaccounts;
    }

    public Pagination getPage() {
        return page;
    }

    public void setPage(final Pagination page) {
        this.page = page;
    }

}
