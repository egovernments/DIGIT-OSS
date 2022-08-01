package org.egov.tl.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeLicenseSearchCriteria {


    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("status")
    private List<String> status;

    @JsonProperty("applicationType")
    private String applicationType;

    @JsonProperty("ids")
    private List<String> ids;

    @JsonProperty("applicationNumber")
    private String applicationNumber;

    @JsonProperty("licenseNumbers")
    private List<String> licenseNumbers;

    @JsonProperty("oldLicenseNumber")
    private String oldLicenseNumber;

    @JsonProperty("mobileNumber")
    private String mobileNumber = null;

    @JsonIgnore
    private String accountId;


    @JsonProperty("fromDate")
    private Long fromDate = null;

    @JsonProperty("toDate")
    private Long toDate = null;

    @JsonProperty("businessService")
    private String businessService = null;

    @JsonProperty("validTo")
    private Long validTo = null;

    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @JsonProperty("locality")
    private String locality = null;

    @JsonProperty("tradeName")
    private String tradeName = null;

    @JsonProperty("ownerName")
    private String ownerName = null;

    @JsonProperty("issuedFrom")
    private Long issuedFrom = null;

    @JsonProperty("issuedTo")
    private Long issuedTo = null;

    @JsonIgnore
    private List<String> ownerIds;
    
    @JsonProperty("RenewalPending")
    private Boolean RenewalPending;
    
    @JsonProperty("onlyMobileNumber")
    private Boolean onlyMobileNumber;
    
    @JsonProperty("financialYear")
    private String financialYear;

    @JsonProperty("tradeType")
    private String tradeType = null;

    public boolean isEmpty() {
        return (this.tenantId == null && this.status == null && this.applicationType == null && this.ids == null && this.applicationNumber == null
                && this.licenseNumbers == null && this.oldLicenseNumber == null && this.mobileNumber == null &&
                this.fromDate == null && this.toDate == null && this.ownerIds == null && this.locality == null && this.tradeName == null &&
                this.ownerName == null && this.issuedFrom == null && this.issuedTo == null && this.tradeType == null
        );
    }

    public boolean tenantIdOnly() {
        return (this.tenantId != null && this.status == null && this.applicationType == null && this.ids == null && this.applicationNumber == null
                && this.licenseNumbers == null && this.oldLicenseNumber == null && this.mobileNumber == null &&
                this.fromDate == null && this.toDate == null && this.ownerIds == null && this.locality == null && this.tradeName == null &&
                this.ownerName == null && this.issuedFrom == null && this.issuedTo == null && this.tradeType == null
        );
    }
    
    public boolean mobileNumberOnly() {
    	return (this.tenantId == null && this.status == null && this.applicationType == null && this.ids == null && this.applicationNumber == null
                && this.licenseNumbers == null && this.oldLicenseNumber == null && this.mobileNumber != null &&
                this.fromDate == null && this.toDate == null && this.ownerIds == null && this.locality == null && this.tradeName == null &&
                this.ownerName == null && this.issuedFrom == null && this.issuedTo == null && this.tradeType == null
        );
    }

}
