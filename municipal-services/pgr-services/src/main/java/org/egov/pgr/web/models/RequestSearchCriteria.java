package org.egov.pgr.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestSearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("serviceCode")
    private String serviceCode;

    @JsonProperty("applicationStatus")
    private Set<String> applicationStatus;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("serviceRequestId")
    private String serviceRequestId;

    @JsonProperty("ids")
    private Set<String> ids;

    @JsonProperty("limit")
    private Integer limit;

    @JsonProperty("offset")
    private Integer offset;

    @JsonIgnore
    private Set<String> userIds;



    public boolean isEmpty(){
        return (this.tenantId==null && this.serviceCode==null && this.mobileNumber==null && this.serviceRequestId==null
        && this.applicationStatus==null && this.ids==null && this.userIds==null);
    }

}
