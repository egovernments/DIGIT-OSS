package org.egov.egf.dashboard.model;

import java.util.Date;
import java.util.Set;

import org.egov.commons.Fund;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VoucherHeaderData {
    private String id;
    private String name;
    private String type;
    private String description;
    private Date effectiveDate;
    private String voucherNumber;
    private Date voucherDate;
    private String fundcode;
    private String fundname;
    private String fiscalperiodname;
    private String status;
    private Long originalvcId;
    private Long refvhId;
    private String voucherSubType;
    private String billNumber;
    private Date billDate;
    @JsonProperty("timestamp")
    private Long timeStamp;
    
    //vouchermis data
    private String fundsourcecode;
    private String fundsourcename;
    private String departmentcode;
    private String departmentName;
    private String schemecode;
    private String schemecname;
    private String subschemecode;
    private String subschemename;
    private String functionarycode;
    private String functionaryname;
    private String functioncode;
    private String functionname;
    private String referenceDocument;
    private String serviceName;
    private Set<CGeneralLedgerData> generalLedger;
    
    private String ulbCode;
    private String ulbname;
    private String ulbgrade;
    private String districtname;
    private String regionname;

    public VoucherHeaderData() {
        // TODO Auto-generated constructor stub
    }

    public VoucherHeaderData(String id, String name, String type, String description, Date effectiveDate, String voucherNumber,
            Date voucherDate, String fundcode, String fundname, String fiscalperiodname, String status,
            Long originalvcId, Long refvhId, String voucherSubType, String billNumber, Date billDate, Long timeStamp,
            String fundsourcecode, String fundsourcename, String departmentcode, String departmentName, String schemecode,
            String schemecname, String subschemecode, String subschemename, String functionarycode, String functionaryname,
            String functioncode, String functionname, String referenceDocument, String serviceName) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.effectiveDate = effectiveDate;
        this.voucherNumber = voucherNumber;
        this.voucherDate = voucherDate;
        this.fundcode = fundcode;
        this.fundname = fundname;
        this.fiscalperiodname = fiscalperiodname;
        this.status = status;
        this.originalvcId = originalvcId;
        this.refvhId = refvhId;
        this.voucherSubType = voucherSubType;
        this.billNumber = billNumber;
        this.billDate = billDate;
        this.timeStamp = timeStamp;
        this.fundsourcecode = fundsourcecode;
        this.fundsourcename = fundsourcename;
        this.departmentcode = departmentcode;
        this.departmentName = departmentName;
        this.schemecode = schemecode;
        this.schemecname = schemecname;
        this.subschemecode = subschemecode;
        this.subschemename = subschemename;
        this.functionarycode = functionarycode;
        this.functionaryname = functionaryname;
        this.functioncode = functioncode;
        this.functionname = functionname;
        this.referenceDocument = referenceDocument;
        this.serviceName = serviceName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getVoucherNumber() {
        return voucherNumber;
    }

    public void setVoucherNumber(String voucherNumber) {
        this.voucherNumber = voucherNumber;
    }

    public Date getVoucherDate() {
        return voucherDate;
    }

    public void setVoucherDate(Date voucherDate) {
        this.voucherDate = voucherDate;
    }

    public String getFundcode() {
        return fundcode;
    }

    public void setFundcode(String fundcode) {
        this.fundcode = fundcode;
    }

    public String getFundname() {
        return fundname;
    }

    public void setFundname(String fundname) {
        this.fundname = fundname;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getOriginalvcId() {
        return originalvcId;
    }

    public void setOriginalvcId(Long originalvcId) {
        this.originalvcId = originalvcId;
    }

    public Long getRefvhId() {
        return refvhId;
    }

    public void setRefvhId(Long refvhId) {
        this.refvhId = refvhId;
    }

    public String getVoucherSubType() {
        return voucherSubType;
    }

    public void setVoucherSubType(String voucherSubType) {
        this.voucherSubType = voucherSubType;
    }


    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public Date getBillDate() {
        return billDate;
    }

    public void setBillDate(Date billDate) {
        this.billDate = billDate;
    }


    public String getFundsourcecode() {
        return fundsourcecode;
    }

    public void setFundsourcecode(String fundsourcecode) {
        this.fundsourcecode = fundsourcecode;
    }

    public String getFundsourcename() {
        return fundsourcename;
    }

    public void setFundsourcename(String fundsourcename) {
        this.fundsourcename = fundsourcename;
    }

    public String getDepartmentcode() {
        return departmentcode;
    }

    public void setDepartmentcode(String departmentcode) {
        this.departmentcode = departmentcode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getSchemecode() {
        return schemecode;
    }

    public void setSchemecode(String schemecode) {
        this.schemecode = schemecode;
    }

    public String getSchemecname() {
        return schemecname;
    }

    public void setSchemecname(String schemecname) {
        this.schemecname = schemecname;
    }

    public String getSubschemecode() {
        return subschemecode;
    }

    public void setSubschemecode(String subschemecode) {
        this.subschemecode = subschemecode;
    }

    public String getSubschemename() {
        return subschemename;
    }

    public void setSubschemename(String subschemename) {
        this.subschemename = subschemename;
    }

    public String getFunctionarycode() {
        return functionarycode;
    }

    public void setFunctionarycode(String functionarycode) {
        this.functionarycode = functionarycode;
    }

    public String getFunctionaryname() {
        return functionaryname;
    }

    public void setFunctionaryname(String functionaryname) {
        this.functionaryname = functionaryname;
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

    public String getReferenceDocument() {
        return referenceDocument;
    }

    public void setReferenceDocument(String referenceDocument) {
        this.referenceDocument = referenceDocument;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Set<CGeneralLedgerData> getGeneralLedger() {
        return generalLedger;
    }

    public void setGeneralLedger(Set<CGeneralLedgerData> generalLedger) {
        this.generalLedger = generalLedger;
    }
    
    
    public static class Builder {
        private Long id;
        private String name;
        private String type;
        private String description;
        private Date effectiveDate;
        private String voucherNumber;
        private Date voucherDate;
        private String fundcode;
        private String fundname;
        private String fiscalperiodname;
        private String status;
        private Long originalvcId;
        private Long refvhId;
        private String voucherSubType;
        private String billNumber;
        private Date billDate;
        private Long timeStamp;
        
        //vouchermis data
        private String fundsourcecode;
        private String fundsourcename;
        private String departmentcode;
        private String departmentName;
        private String schemecode;
        private String schemecname;
        private String subschemecode;
        private String subschemename;
        private String functionarycode;
        private String functionaryname;
        private String functioncode;
        private String functionname;
        private String referenceDocument;
        private String serviceName;
        public Builder() {
            // TODO Auto-generated constructor stub
        }
        public Builder setId(Long id) {
            this.id = id;
            return this;
        }
        public Builder setName(String name) {
            this.name = name;
            return this;
        }
        public Builder setType(String type) {
            this.type = type;
            return this;
        }
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }
        public Builder setEffectiveDate(Date effectiveDate) {
            this.effectiveDate = effectiveDate;
            return this;
        }
        public Builder setVoucherNumber(String voucherNumber) {
            this.voucherNumber = voucherNumber;
            return this;
        }
        public Builder setVoucherDate(Date voucherDate) {
            this.voucherDate = voucherDate;
            return this;
        }
        public Builder setFundcode(String fundcode) {
            this.fundcode = fundcode;
            return this;
        }
        public Builder setFundname(String fundname) {
            this.fundname = fundname;
            return this;
        }
        public Builder setFiscalPeriodName(String fiscalperiodname) {
            this.fiscalperiodname = fiscalperiodname;
            return this;
        }
        public Builder setStatus(String status) {
            this.status = status;
            return this;
        }
        public Builder setOriginalvcId(Long originalvcId) {
            this.originalvcId = originalvcId;
            return this;
        }
        public Builder setRefvhId(Long refvhId) {
            this.refvhId = refvhId;
            return this;
        }
        public Builder setVoucherSubType(String voucherSubType) {
            this.voucherSubType = voucherSubType;
            return this;
        }
        public Builder setBillNumber(String billNumber) {
            this.billNumber = billNumber;
            return this;
        }
        public Builder setBillDate(Date billDate) {
            this.billDate = billDate;
            return this;
        }
        public Builder setFundsourcecode(String fundsourcecode) {
            this.fundsourcecode = fundsourcecode;
            return this;
        }
        public Builder setFundsourcename(String fundsourcename) {
            this.fundsourcename = fundsourcename;
            return this;
        }
        public Builder setDepartmentcode(String departmentcode) {
            this.departmentcode = departmentcode;
            return this;
        }
        public Builder setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }
        public Builder setSchemecode(String schemecode) {
            this.schemecode = schemecode;
            return this;
        }
        public Builder setSchemecname(String schemecname) {
            this.schemecname = schemecname;
            return this;
        }
        public Builder setSubschemecode(String subschemecode) {
            this.subschemecode = subschemecode;
            return this;
        }
        public Builder setSubschemename(String subschemename) {
            this.subschemename = subschemename;
            return this;
        }
        public Builder setFunctionarycode(String functionarycode) {
            this.functionarycode = functionarycode;
            return this;
        }
        public Builder setFunctionaryname(String functionaryname) {
            this.functionaryname = functionaryname;
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
        public Builder setReferenceDocument(String referenceDocument) {
            this.referenceDocument = referenceDocument;
            return this;
        }
        public Builder setServiceName(String serviceName) {
            this.serviceName = serviceName;
            return this;
        }
        public Builder setTimeStamp(Long timeStamp) {
            this.timeStamp = timeStamp;
            return this;
        }
        
        
        public VoucherHeaderData build(){
            return new VoucherHeaderData(id+"", name, type, description, effectiveDate, voucherNumber, voucherDate, fundcode, fundname, fiscalperiodname, status, originalvcId, refvhId, voucherSubType, billNumber, billDate, timeStamp, fundsourcecode, fundsourcename, departmentcode, departmentName, schemecode, schemecname, subschemecode, subschemename, functionarycode, functionaryname, functioncode, functionname, referenceDocument, serviceName);
        }
        
    }


    public String getFiscalperiodname() {
        return fiscalperiodname;
    }

    public void setFiscalperiodname(String fiscalperiodname) {
        this.fiscalperiodname = fiscalperiodname;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Long timeStamp) {
        this.timeStamp = timeStamp;
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
