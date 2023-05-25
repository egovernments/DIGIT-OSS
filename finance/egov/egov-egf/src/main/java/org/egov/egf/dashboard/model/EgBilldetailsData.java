package org.egov.egf.dashboard.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.egov.model.bills.EgBillPayeedetails;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class EgBilldetailsData {
    private Integer id;
    private Long billid;
    private String functioncode;
    private String functionname;
    private String glcode;
    private String coaname;
    private BigDecimal debitamount;
    private BigDecimal creditamount;
    private Date lastupdatedtime;
    private String narration;
    private Set<EgBillPayeedetailsData> egBillPaydetailes = new HashSet<EgBillPayeedetailsData>(0);
    public EgBilldetailsData() {
        // TODO Auto-generated constructor stub
    }
    public EgBilldetailsData(Integer id, Long billid, String glcode, BigDecimal debitamount,
            BigDecimal creditamount, Date lastupdatedtime, String narration,String coaname, String functioncode,String functionname) {
        this.id = id;
        this.billid = billid;
        this.glcode = glcode;
        this.debitamount = debitamount;
        this.creditamount = creditamount;
        this.lastupdatedtime = lastupdatedtime;
        this.narration = narration;
        this.coaname = coaname;
        this.functioncode = functioncode;
        this.functionname = functionname;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Long getBillid() {
        return billid;
    }
    public void setBillid(Long billid) {
        this.billid = billid;
    }
    public BigDecimal getDebitamount() {
        return debitamount;
    }
    public void setDebitamount(BigDecimal debitamount) {
        this.debitamount = debitamount;
    }
    public BigDecimal getCreditamount() {
        return creditamount;
    }
    public void setCreditamount(BigDecimal creditamount) {
        this.creditamount = creditamount;
    }
    public Date getLastupdatedtime() {
        return lastupdatedtime;
    }
    public void setLastupdatedtime(Date lastupdatedtime) {
        this.lastupdatedtime = lastupdatedtime;
    }
    public String getNarration() {
        return narration;
    }
    public void setNarration(String narration) {
        this.narration = narration;
    }
    public Set<EgBillPayeedetailsData> getEgBillPaydetailes() {
        return egBillPaydetailes;
    }
    public void setEgBillPaydetailes(Set<EgBillPayeedetailsData> egBillPaydetailes) {
        this.egBillPaydetailes = egBillPaydetailes;
    }
    
    public static class Builder{
        private Integer id;
        private Long billid;
        private String functioncode;
        private String functionname;
        private String glcode;
        private String coaname;
        private BigDecimal debitamount;
        private BigDecimal creditamount;
        private Date lastupdatedtime;
        private String narration;
        public Builder setId(Integer id) {
            this.id = id;
            return this;
        }
        public Builder setBillid(Long billid) {
            this.billid = billid;
            return this;
        }
        public Builder setDebitamount(BigDecimal debitamount) {
            this.debitamount = debitamount;
            return this;
        }
        public Builder setCreditamount(BigDecimal creditamount) {
            this.creditamount = creditamount;
            return this;
        }
        public Builder setLastupdatedtime(Date lastupdatedtime) {
            this.lastupdatedtime = lastupdatedtime;
            return this;
        }
        public Builder setNarration(String narration) {
            this.narration = narration;
            return this;
        }
        
        public Builder setGlcode(String glcode) {
            this.glcode = glcode;
            return this;
        }
        public Builder setCoaname(String coaname) {
            this.coaname = coaname;
            return this;
        }
        public Builder setFunctioncode(String functioncode) {
            this.functioncode = functioncode;
            return this;
        }
        public Builder setFunctionname(String functionname) {
            this.functionname = functionname;
            return this;
        }
        
        public EgBilldetailsData build(){
            return new EgBilldetailsData(id, billid, glcode, debitamount, creditamount, lastupdatedtime, narration, coaname, functioncode, functionname);
        }
    }

    public String getGlcode() {
        return glcode;
    }
    public void setGlcode(String glcode) {
        this.glcode = glcode;
    }
    public String getCoaname() {
        return coaname;
    }
    public void setCoaname(String coaname) {
        this.coaname = coaname;
    }
    public String getFunctioncode() {
        return functioncode;
    }
    public void setFunctioncode(String functioncode) {
        this.functioncode = functioncode;
    }
    public String getFunctionname() {
        return functionname;
    }
    public void setFunctionname(String functionname) {
        this.functionname = functionname;
    }
    @Override
    public String toString() {
        return "EgBilldetailsData [id=" + id + ", billid=" + billid + ", functioncode=" + functioncode + ", functionname="
                + functionname + ", glcode=" + glcode + ", coaname=" + coaname + ", debitamount=" + debitamount
                + ", creditamount=" + creditamount + ", lastupdatedtime=" + lastupdatedtime + ", narration=" + narration
                + ", egBillPaydetailes=" + egBillPaydetailes + "]";
    }
    
    
}
