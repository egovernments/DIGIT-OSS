package org.egov.egf.dashboard.model;

import java.math.BigDecimal;

import org.egov.commons.Accountdetailtype;
import org.egov.commons.CGeneralLedger;

public class CGeneralLedgerDetailData {
    private Long id;
    private String detailkeyname;
    private String detailtypename;
    private BigDecimal amount;
    public CGeneralLedgerDetailData(Long id, String detailkeyname, String detailtypename, BigDecimal amount) {
        this.id = id;
        this.detailkeyname = detailkeyname;
        this.detailtypename = detailtypename;
        this.amount = amount;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDetailkeyname() {
        return detailkeyname;
    }
    public void setDetailkeyname(String detailkeyname) {
        this.detailkeyname = detailkeyname;
    }
    public String getDetailtypename() {
        return detailtypename;
    }
    public void setDetailtypename(String detailtypename) {
        this.detailtypename = detailtypename;
    }
    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public static class Builder {
        private Long id;
        private String detailkeyname;
        private String detailtypename;
        private BigDecimal amount;
        public Builder() {
            // TODO Auto-generated constructor stub
        }
        public Builder setId(Long id) {
            this.id = id;
            return this;
        }
        public Builder setDetailkeyname(String detailkeyname) {
            this.detailkeyname = detailkeyname;
            return this;
        }
        public Builder setDetailtypename(String detailtypename) {
            this.detailtypename = detailtypename;
            return this;
        }
        public Builder setAmount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        public CGeneralLedgerDetailData build(){
            return new CGeneralLedgerDetailData(id, detailkeyname, detailtypename, amount);
        }
        
    }
}
