package org.egov.infra.microservice.models;

import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

public class BusinessDetails {

    private Long id;
    @SafeHtml
    private String code;
    @SafeHtml
    private String name;

    private Boolean active;

    private Long businessCategory;
    @SafeHtml
    private String businessType;
    @SafeHtml
    private String businessUrl;
    @SafeHtml
    private String department;
    @SafeHtml
    private String fundSource;
    @SafeHtml
    private String functionary;

    private Boolean voucherCreation;

    private Boolean isVoucherApproved;

    private Boolean callBackForApportioning;

    private Long voucherCutoffDate;

    private Integer ordernumber;
    @SafeHtml
    private String fund;
    @SafeHtml
    private String function;
    @SafeHtml
    private String tenantId;

    private List<BusinessAccountDetails> accountDetails;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getBusinessCategory() {
        return businessCategory;
    }

    public void setBusinessCategory(Long businessCategory) {
        this.businessCategory = businessCategory;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessUrl() {
        return businessUrl;
    }

    public void setBusinessUrl(String businessUrl) {
        this.businessUrl = businessUrl;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getFundSource() {
        return fundSource;
    }

    public void setFundSource(String fundSource) {
        this.fundSource = fundSource;
    }

    public String getFunctionary() {
        return functionary;
    }

    public void setFunctionary(String functionary) {
        this.functionary = functionary;
    }

    public Boolean getVoucherCreation() {
        return voucherCreation;
    }

    public void setVoucherCreation(Boolean voucherCreation) {
        this.voucherCreation = voucherCreation;
    }

    public Boolean getIsVoucherApproved() {
        return isVoucherApproved;
    }

    public void setIsVoucherApproved(Boolean isVoucherApproved) {
        this.isVoucherApproved = isVoucherApproved;
    }

    public Boolean getCallBackForApportioning() {
        return callBackForApportioning;
    }

    public void setCallBackForApportioning(Boolean callBackForApportioning) {
        this.callBackForApportioning = callBackForApportioning;
    }

    public Long getVoucherCutoffDate() {
        return voucherCutoffDate;
    }

    public void setVoucherCutoffDate(Long voucherCutoffDate) {
        this.voucherCutoffDate = voucherCutoffDate;
    }

    public Integer getOrdernumber() {
        return ordernumber;
    }

    public void setOrdernumber(Integer ordernumber) {
        this.ordernumber = ordernumber;
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

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<BusinessAccountDetails> getAccountDetails() {
        return accountDetails;
    }

    public void setAccountDetails(List<BusinessAccountDetails> accountDetails) {
        this.accountDetails = accountDetails;
    }

}