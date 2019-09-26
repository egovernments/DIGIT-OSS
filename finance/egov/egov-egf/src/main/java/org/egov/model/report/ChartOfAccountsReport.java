package org.egov.model.report;

import org.egov.commons.CChartOfAccounts;

public class ChartOfAccountsReport {

    private String accountCode;
    private String accountName;
    private String majorCode;
    private Long majorCodeId;
    private Long minorCodeId;
   private String minorCode;
    private String majorName;
    private String minorName;
    private String type;
    private Long purposeId;
    private String purpose;
    private Boolean isActiveForPosting;
    private Boolean functionReqd;
    private Boolean budgetCheckReq;
    private Long detailTypeId;
    private String accountDetailType;
    private CChartOfAccounts detailChartOfAccounts;
    private CChartOfAccounts majorChartOfAccounts;
    private CChartOfAccounts minorChartOfAccounts;
    
    

    public CChartOfAccounts getDetailChartOfAccounts() {
        return detailChartOfAccounts;
    }

    public void setDetailChartOfAccounts(CChartOfAccounts detailChartOfAccounts) {
        this.detailChartOfAccounts = detailChartOfAccounts;
    }

    public CChartOfAccounts getMajorChartOfAccounts() {
        return majorChartOfAccounts;
    }

    public void setMajorChartOfAccounts(CChartOfAccounts majorChartOfAccounts) {
        this.majorChartOfAccounts = majorChartOfAccounts;
    }

    public CChartOfAccounts getMinorChartOfAccounts() {
        return minorChartOfAccounts;
    }

    public void setMinorChartOfAccounts(CChartOfAccounts minorChartOfAccounts) {
        this.minorChartOfAccounts = minorChartOfAccounts;
    }

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(String accountCode) {
        this.accountCode = accountCode;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getMajorCode() {
        return majorCode;
    }

    public void setMajorCode(String majorCode) {
        this.majorCode = majorCode;
    }

    public String getMinorCode() {
        return minorCode;
    }

    public void setMinorCode(String minorCode) {
        this.minorCode = minorCode;
    }

    public String getMajorName() {
        return majorName;
    }

    public void setMajorName(String majorName) {
        this.majorName = majorName;
    }

    public String getMinorName() {
        return minorName;
    }

    public void setMinorName(String minorName) {
        this.minorName = minorName;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getPurposeId() {
        return purposeId;
    }

    public void setPurposeId(Long purposeId) {
        this.purposeId = purposeId;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Boolean getIsActiveForPosting() {
        return isActiveForPosting;
    }

    public void setIsActiveForPosting(Boolean isActiveForPosting) {
        this.isActiveForPosting = isActiveForPosting;
    }

    public Boolean getFunctionReqd() {
        return functionReqd;
    }

    public void setFunctionReqd(Boolean functionReqd) {
        this.functionReqd = functionReqd;
    }

    public Boolean getBudgetCheckReq() {
        return budgetCheckReq;
    }

    public void setBudgetCheckReq(Boolean budgetCheckReq) {
        this.budgetCheckReq = budgetCheckReq;
    }

    public Long getDetailTypeId() {
        return detailTypeId;
    }

    public void setDetailTypeId(Long detailTypeId) {
        this.detailTypeId = detailTypeId;
    }

    public String getAccountDetailType() {
        return accountDetailType;
    }

    public void setAccountDetailType(String accountDetailType) {
        this.accountDetailType = accountDetailType;
    }
    
    public Long getMajorCodeId() {
        return majorCodeId;
    }

    public void setMajorCodeId(Long majorCodeId) {
        this.majorCodeId = majorCodeId;
    }

    public Long getMinorCodeId() {
        return minorCodeId;
    }

    public void setMinorCodeId(Long minorCodeId) {
        this.minorCodeId = minorCodeId;
    }


}
