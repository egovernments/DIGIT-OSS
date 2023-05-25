package org.egov.egf.contract.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class BankAccount implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 5118183614058884219L;
    @SafeHtml
    private String code;
    @SafeHtml
    private String account;

    public BankAccount(final String code, final String account) {
        this.code = code;
        this.account = account;
    }

    public BankAccount() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(final String account) {
        this.account = account;
    }

}
