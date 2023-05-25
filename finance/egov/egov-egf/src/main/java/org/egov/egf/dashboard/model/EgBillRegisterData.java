package org.egov.egf.dashboard.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

import org.egov.commons.EgwStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
@JsonIgnoreProperties(ignoreUnknown = true)
public class EgBillRegisterData{
    private String id;
    private String billnumber;
    private Date billdate;
    private BigDecimal billamount;
    private BigDecimal passedamount;
    private String billtype;
    private String expendituretype;
    private String workordernumber;
    private String billapprovalstatus;
    @JsonProperty("timestamp")
    private Long timeStamp;
    private EgwStatus status;
    private Date lastupdatedtime;
  //BillRegisterMIS Data
    private String narration;
    private String departmentcode;
    private String departmentname;
    private String payto;
    private String functionname;
    private String functioncode;
    private String schemename;
    private String schemecode;
    private String subschemename;
    private String subschemecode;
    private String vouchernumber;
    private String fundname;
    private String fundCode;
    private String partyBillNumber;
    private Date partyBillDate;
    private String budgetaryAppnumber;
    private String fundsource;
    private String egBillSubType;
    private Set<EgBilldetailsData> egbilldetailes;
    private String ulbCode;
    private String ulbname;
    private String ulbgrade;
    private String districtname;
    private String regionname;
    public EgBillRegisterData() {
        // TODO Auto-generated constructor stub
    }
   
    public EgBillRegisterData(String id, String billnumber, Date billdate, BigDecimal billamount, String narration,
            BigDecimal passedamount, String billtype, String expendituretype, String workordernumber, String billapprovalstatus,
            Long timeStamp, EgwStatus status, Date lastupdatedtime, String departmentcode, String departmentname, String payto,
            String functionname, String schemename, String schemecode, String subschemename, String subschemecode,
            String vouchernumber, String fundname, String fundCode, String partyBillNumber, Date partyBillDate,
            String budgetaryAppnumber, String fundsource, String egBillSubType, Set<EgBilldetailsData> egbilldetailes) {
        this.id = id;
        this.billnumber = billnumber;
        this.billdate = billdate;
        this.billamount = billamount;
        this.narration = narration;
        this.passedamount = passedamount;
        this.billtype = billtype;
        this.expendituretype = expendituretype;
        this.workordernumber = workordernumber;
        this.billapprovalstatus = billapprovalstatus;
        this.timeStamp = timeStamp;
        this.status = status;
        this.lastupdatedtime = lastupdatedtime;
        this.departmentcode = departmentcode;
        this.departmentname = departmentname;
        this.payto = payto;
        this.functionname = functionname;
        this.schemename = schemename;
        this.schemecode = schemecode;
        this.subschemename = subschemename;
        this.subschemecode = subschemecode;
        this.vouchernumber = vouchernumber;
        this.fundname = fundname;
        this.fundCode = fundCode;
        this.partyBillNumber = partyBillNumber;
        this.partyBillDate = partyBillDate;
        this.budgetaryAppnumber = budgetaryAppnumber;
        this.fundsource = fundsource;
        this.egBillSubType = egBillSubType;
        this.egbilldetailes = egbilldetailes;
    }

    public static class Builder {
        private Long id;
        private String billnumber;
        private Date billdate;
        private BigDecimal billamount;
        private String narration;
        private BigDecimal passedamount;
        private String billtype;
        private String expendituretype;
        private String workordernumber;
        private String billapprovalstatus;
        @JsonProperty("timestamp")
        private Long timeStamp;
        private EgwStatus status;
        private Date lastupdatedtime;
        private String departmentcode;
        private String departmentname;
        private String payto;
        private String functionname;
        private String schemename;
        private String schemecode;
        private String subscheme;
        private String subcchemecode;
        private String vouchernumber;
        private String fundname;
        private String fundCode;
        private String partyBillNumber;
        private Date partyBillDate;
        private String budgetaryAppnumber;
        private String fundsource;
        private String egBillSubType;
        private Set<EgBilldetailsData> egbilldetailes;
        public Builder() {
            // TODO Auto-generated constructor stub
        }
        
        public Builder setId(Long id) {
            this.id = id;
            return this;
        }
        public Builder setBillnumber(String billnumber) {
            this.billnumber = billnumber;
            return this;
        }
        public Builder setBilldate(Date billdate) {
            this.billdate = billdate;
            return this;
        }
        public Builder setBillamount(BigDecimal billamount) {
            this.billamount = billamount;
            return this;
        }
        public Builder setNarration(String narration) {
            this.narration = narration;
            return this;
        }
        public Builder setPassedamount(BigDecimal passedamount) {
            this.passedamount = passedamount;
            return this;
        }
        public Builder setBilltype(String billtype) {
            this.billtype = billtype;
            return this;
        }
        public Builder setExpendituretype(String expendituretype) {
            this.expendituretype = expendituretype;
            return this;
        }
        public Builder setWorkordernumber(String workordernumber) {
            this.workordernumber = workordernumber;
            return this;
        }
        public Builder setBillapprovalstatus(String billapprovalstatus) {
            this.billapprovalstatus = billapprovalstatus;
            return this;
        }
        public Builder setTimeStamp(Long timeStamp) {
            this.timeStamp = timeStamp;
            return this;
        }
        
        public Builder setStatus(EgwStatus status) {
            this.status = status;
            return this;
        }
        public Builder setEgbilldetailes(Set<EgBilldetailsData> egbilldetailes) {
            this.egbilldetailes = egbilldetailes;
            return this;
        }
        
        public Builder setLastupdatedtime(Date lastupdatedtime) {
            this.lastupdatedtime = lastupdatedtime;
            return this;
        }
        public Builder setDepartmentcode(String departmentcode) {
            this.departmentcode = departmentcode;
            return this;
        }
        public Builder setPayto(String payto) {
            this.payto = payto;
            return this;
        }
        public Builder setVouchernumber(String vouchernumber) {
            this.vouchernumber = vouchernumber;
            return this;
        }
        public Builder setPartyBillNumber(String partyBillNumber) {
            this.partyBillNumber = partyBillNumber;
            return this;
        }
        public Builder setPartyBillDate(Date partyBillDate) {
            this.partyBillDate = partyBillDate;
            return this;
        }
        public Builder setBudgetaryAppnumber(String budgetaryAppnumber) {
            this.budgetaryAppnumber = budgetaryAppnumber;
            return this;
        }
        public Builder setDepartmentname(String departmentname) {
            this.departmentname = departmentname;
            return this;
        }
        public Builder setFunctionname(String functionname) {
            this.functionname = functionname;
            return this;
        }
        public Builder setSchemename(String schemename) {
            this.schemename = schemename;
            return this;
        }
        public Builder setSchemecode(String schemecode) {
            this.schemecode = schemecode;
            return this;
        }
        public Builder setSubscheme(String subscheme) {
            this.subscheme = subscheme;
            return this;
        }
        public Builder setSubcchemecode(String subcchemecode) {
            this.subcchemecode = subcchemecode;
            return this;
        }
        public Builder setFundname(String fundname) {
            this.fundname = fundname;
            return this;
        }
        public Builder setFundCode(String fundCode) {
            this.fundCode = fundCode;
            return this;
        }
        public Builder setFundsource(String fundsource) {
            this.fundsource = fundsource;
            return this;
        }
        public Builder setEgBillSubType(String egBillSubType) {
            this.egBillSubType = egBillSubType;
            return this;
        }
        public EgBillRegisterData build(){
            return new EgBillRegisterData(id+"", billnumber, billdate, billamount, narration, passedamount, billtype, expendituretype, workordernumber, billapprovalstatus, timeStamp, status, lastupdatedtime, departmentcode, departmentname, payto, functionname, schemename, schemecode, subscheme, subcchemecode, vouchernumber, fundname, fundCode, partyBillNumber, partyBillDate, budgetaryAppnumber, fundsource, egBillSubType, egbilldetailes);
        }
        
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBillnumber() {
        return billnumber;
    }

    public void setBillnumber(String billnumber) {
        this.billnumber = billnumber;
    }

    public Date getBilldate() {
        return billdate;
    }

    public void setBilldate(Date billdate) {
        this.billdate = billdate;
    }

    public BigDecimal getBillamount() {
        return billamount;
    }

    public void setBillamount(BigDecimal billamount) {
        this.billamount = billamount;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public BigDecimal getPassedamount() {
        return passedamount;
    }

    public void setPassedamount(BigDecimal passedamount) {
        this.passedamount = passedamount;
    }

    public String getBilltype() {
        return billtype;
    }

    public void setBilltype(String billtype) {
        this.billtype = billtype;
    }

    public String getExpendituretype() {
        return expendituretype;
    }


    public String getWorkordernumber() {
        return workordernumber;
    }

    public void setWorkordernumber(String workordernumber) {
        this.workordernumber = workordernumber;
    }

    public String getBillapprovalstatus() {
        return billapprovalstatus;
    }

    public void setBillapprovalstatus(String billapprovalstatus) {
        this.billapprovalstatus = billapprovalstatus;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Long timeStamp) {
        this.timeStamp = timeStamp;
    }

    public EgwStatus getStatus() {
        return status;
    }

    public void setStatus(EgwStatus status) {
        this.status = status;
    }

    public Set<EgBilldetailsData> getEgbilldetailes() {
        return egbilldetailes;
    }

    public void setEgbilldetailes(Set<EgBilldetailsData> egbilldetailes) {
        this.egbilldetailes = egbilldetailes;
    }

    public Date getLastupdatedtime() {
        return lastupdatedtime;
    }

    public void setLastupdatedtime(Date lastupdatedtime) {
        this.lastupdatedtime = lastupdatedtime;
    }
    
    public String getDepartmentcode() {
        return departmentcode;
    }

    public void setDepartmentcode(String departmentcode) {
        this.departmentcode = departmentcode;
    }

    public String getPayto() {
        return payto;
    }

    public void setPayto(String payto) {
        this.payto = payto;
    }

    public String getVouchernumber() {
        return vouchernumber;
    }

    public void setVouchernumber(String vouchernumber) {
        this.vouchernumber = vouchernumber;
    }

    public String getPartyBillNumber() {
        return partyBillNumber;
    }

    public void setPartyBillNumber(String partyBillNumber) {
        this.partyBillNumber = partyBillNumber;
    }

    public Date getPartyBillDate() {
        return partyBillDate;
    }

    public void setPartyBillDate(Date partyBillDate) {
        this.partyBillDate = partyBillDate;
    }

    public String getBudgetaryAppnumber() {
        return budgetaryAppnumber;
    }

    public void setBudgetaryAppnumber(String budgetaryAppnumber) {
        this.budgetaryAppnumber = budgetaryAppnumber;
    }

    public String getDepartmentname() {
        return departmentname;
    }

    public void setDepartmentname(String departmentname) {
        this.departmentname = departmentname;
    }

    public String getFunctionname() {
        return functionname;
    }

    public void setFunctionname(String functionname) {
        this.functionname = functionname;
    }

    public String getSchemename() {
        return schemename;
    }

    public void setSchemename(String schemename) {
        this.schemename = schemename;
    }

    public String getSchemecode() {
        return schemecode;
    }

    public void setSchemecode(String schemecode) {
        this.schemecode = schemecode;
    }

    public String getSubschemecode() {
        return subschemecode;
    }

    public void setSubschemecode(String subcchemecode) {
        this.subschemecode = subcchemecode;
    }

    public String getFundname() {
        return fundname;
    }

    public void setFundname(String fundname) {
        this.fundname = fundname;
    }

    public String getFundCode() {
        return fundCode;
    }

    public void setFundCode(String fundCode) {
        this.fundCode = fundCode;
    }

    public String getFundsource() {
        return fundsource;
    }

    public void setFundsource(String fundsource) {
        this.fundsource = fundsource;
    }

    public String getEgBillSubType() {
        return egBillSubType;
    }

    public void setEgBillSubType(String egBillSubType) {
        this.egBillSubType = egBillSubType;
    }

    public void setExpendituretype(String expendituretype) {
        this.expendituretype = expendituretype;
    }

    public String getFunctioncode() {
        return functioncode;
    }

    public void setFunctioncode(String functioncode) {
        this.functioncode = functioncode;
    }

    public String getSubschemename() {
        return subschemename;
    }

    public void setSubschemename(String subschemename) {
        this.subschemename = subschemename;
    }

    @Override
    public String toString() {
        return "EgBillRegisterData [id=" + id + ", billnumber=" + billnumber + ", billdate=" + billdate + ", billamount="
                + billamount + ", passedamount=" + passedamount + ", billtype=" + billtype + ", expendituretype="
                + expendituretype + ", workordernumber=" + workordernumber + ", billapprovalstatus=" + billapprovalstatus
                + ", timeStamp=" + timeStamp + ", status=" + status + ", lastupdatedtime=" + lastupdatedtime + ", narration="
                + narration + ", departmentcode=" + departmentcode + ", departmentname=" + departmentname + ", payto=" + payto
                + ", functionname=" + functionname + ", functioncode=" + functioncode + ", schemename=" + schemename
                + ", schemecode=" + schemecode + ", subschemename=" + subschemename + ", subschemecode=" + subschemecode
                + ", vouchernumber=" + vouchernumber + ", fundname=" + fundname + ", fundCode=" + fundCode + ", partyBillNumber="
                + partyBillNumber + ", partyBillDate=" + partyBillDate + ", budgetaryAppnumber=" + budgetaryAppnumber
                + ", fundsource=" + fundsource + ", egBillSubType=" + egBillSubType + ", egbilldetailes=" + egbilldetailes + "]";
    }

    public String getUlbCode() {
        return ulbCode;
    }

    public void setUlbCode(String ulbCode) {
        this.ulbCode = ulbCode;
    }

    public String getUlbname() {
        return ulbname;
    }

    public void setUlbname(String ulbname) {
        this.ulbname = ulbname;
    }

    public String getUlbgrade() {
        return ulbgrade;
    }

    public void setUlbgrade(String ulbgrade) {
        this.ulbgrade = ulbgrade;
    }

    public String getDistrictname() {
        return districtname;
    }

    public void setDistrictname(String districtname) {
        this.districtname = districtname;
    }

    public String getRegionname() {
        return regionname;
    }

    public void setRegionname(String regionname) {
        this.regionname = regionname;
    }
    
    
    

}
