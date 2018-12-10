package org.egov.egf.contract.model;

import java.io.Serializable;

public class BankAccount implements Serializable {
	
	private String code;
	private String account;
    public BankAccount(String code, String account) {
        this.code = code;
        this.account = account;
    }
    public BankAccount() {
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getAccount() {
        return account;
    }
    public void setAccount(String account) {
        this.account = account;
    }
	
}
