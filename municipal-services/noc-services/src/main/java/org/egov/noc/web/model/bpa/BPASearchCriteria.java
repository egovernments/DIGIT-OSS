package org.egov.noc.web.model.bpa;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BPASearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;
    
    @JsonProperty("applicationNo")
    private String applicationNo;

    @JsonProperty("mobileNumber")
    private String mobileNumber;
    
    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    public boolean isEmpty() {
        return (this.tenantId == null &&  this.applicationNo == null
                && this.mobileNumber == null);
    }

    public boolean tenantIdOnly() {
        return (this.tenantId != null && this.applicationNo == null
                && this.mobileNumber == null);
    }
}
