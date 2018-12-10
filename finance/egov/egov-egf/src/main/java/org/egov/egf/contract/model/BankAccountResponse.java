package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class BankAccountResponse implements Serializable {
    private ResponseInfo responseInfo;
    private List<BankAccount> bankaccounts;
    private Pagination page;
    public BankAccountResponse(ResponseInfo responseInfo, List<BankAccount> bankaccounts, Pagination page) {
        this.responseInfo = responseInfo;
        this.bankaccounts = bankaccounts;
        this.page = page;
    }
    public BankAccountResponse() {
    }
    public List<BankAccount> getBankaccounts() {
        return bankaccounts;
    }
    public void setBankaccounts(List<BankAccount> bankaccounts) {
        this.bankaccounts = bankaccounts;
    }
    public Pagination getPage() {
        return page;
    }
    public void setPage(Pagination page) {
        this.page = page;
    }
    
}
