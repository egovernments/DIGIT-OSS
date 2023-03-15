package org.egov.egf.dashboard.model;

import java.math.BigDecimal;
import java.util.Date;

public class EgBillPayeedetailsData {
    private Integer id;
    private BigDecimal debitAmount;
    private BigDecimal creditAmount;
    private Date lastUpdatedTime;
    private String detailtypename;
    private String detailkeyname;
    public EgBillPayeedetailsData() {
        // TODO Auto-generated constructor stub
    }
    public EgBillPayeedetailsData(Integer id, BigDecimal debitAmount, BigDecimal creditAmount, Date lastUpdatedTime, String detailtypename,
            String detailkeyname) {
        this.id = id;
        this.debitAmount = debitAmount;
        this.creditAmount = creditAmount;
        this.lastUpdatedTime = lastUpdatedTime;
        this.detailtypename = detailtypename;
        this.detailkeyname = detailkeyname;
    }
    public BigDecimal getDebitAmount() {
        return debitAmount;
    }
    public void setDebitAmount(BigDecimal debitAmount) {
        this.debitAmount = debitAmount;
    }
    public BigDecimal getCreditAmount() {
        return creditAmount;
    }
    public void setCreditAmount(BigDecimal creditAmount) {
        this.creditAmount = creditAmount;
    }
    public Date getLastUpdatedTime() {
        return lastUpdatedTime;
    }
    public void setLastUpdatedTime(Date lastUpdatedTime) {
        this.lastUpdatedTime = lastUpdatedTime;
    }
    public String getDetailtypename() {
        return detailtypename;
    }
    public void setDetailtypename(String detailtypename) {
        this.detailtypename = detailtypename;
    }
    public String getDetailkeyname() {
        return detailkeyname;
    }
    public void setDetailkeyname(String detailkeyname) {
        this.detailkeyname = detailkeyname;
    }
    
    public static class Builder {
        private Integer id;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
        private Date lastUpdatedTime;
        private String detailtypename;
        private String detailkeyname;
        
        public Builder setDebitAmount(BigDecimal debitAmount) {
            this.debitAmount = debitAmount;
            return this;
        }
        public Builder setCreditAmount(BigDecimal creditAmount) {
            this.creditAmount = creditAmount;
            return this;
        }
        public Builder setLastUpdatedTime(Date lastUpdatedTime) {
            this.lastUpdatedTime = lastUpdatedTime;
            return this;
        }
        public Builder setDetailtypename(String detailtypename) {
            this.detailtypename = detailtypename;
            return this;
        }
        public Builder setDetailkeyname(String detailkeyname) {
            this.detailkeyname = detailkeyname;
            return this;
        }
        public Builder setId(Integer id) {
            this.id = id;
            return this;
        }
        public EgBillPayeedetailsData build(){
            return new EgBillPayeedetailsData(id, debitAmount, creditAmount, lastUpdatedTime, detailtypename, detailkeyname);
        }
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    @Override
    public String toString() {
        return "EgBillPayeedetailsData [id=" + id + ", debitAmount=" + debitAmount + ", creditAmount=" + creditAmount
                + ", lastUpdatedTime=" + lastUpdatedTime + ", detailtypename=" + detailtypename + ", detailkeyname="
                + detailkeyname + "]";
    }
    
}
