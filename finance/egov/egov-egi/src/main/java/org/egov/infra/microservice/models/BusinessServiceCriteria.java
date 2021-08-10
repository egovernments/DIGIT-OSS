package org.egov.infra.microservice.models;

import org.hibernate.validator.constraints.SafeHtml;

public class BusinessServiceCriteria {
    @SafeHtml
    private String code;
    private boolean voucherCreationEnabled;
    @SafeHtml
    private String fund;
    @SafeHtml
    private String function;
    @SafeHtml
    private String department;
    @SafeHtml 
    private String functionary;
    @SafeHtml
    private String scheme;
    @SafeHtml
    private String subscheme;
    private Long validFrom;
    private Long validTo;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isVoucherCreationEnabled() {
        return voucherCreationEnabled;
    }

    public void setVoucherCreationEnabled(boolean voucherCreationEnabled) {
        this.voucherCreationEnabled = voucherCreationEnabled;
    }

    public String getFund() {
        return fund;
    }

    public void setFund(String fund) {
        this.fund = fund;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getFunctionary() {
        return functionary;
    }

    public void setFunctionary(String functionary) {
        this.functionary = functionary;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getSubscheme() {
        return subscheme;
    }

    public void setSubscheme(String subscheme) {
        this.subscheme = subscheme;
    }

    public Long getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Long validFrom) {
        this.validFrom = validFrom;
    }

    public Long getValidTo() {
        return validTo;
    }

    public void setValidTo(Long validTo) {
        this.validTo = validTo;
    }
}
