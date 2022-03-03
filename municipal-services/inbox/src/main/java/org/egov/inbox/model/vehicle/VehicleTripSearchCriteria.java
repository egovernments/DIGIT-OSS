package org.egov.inbox.model.vehicle;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

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
public class VehicleTripSearchCriteria {
    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit; 

    
    @JsonProperty("tenantId")
    private String tenantId; 
    
    @JsonProperty("businessService")
    private String businessService; 
    
    @JsonProperty("ids")
    private List<String> ids;
    
    @JsonProperty("vehicleIds")
    private List<String> vehicleIds;
    
    @JsonProperty("tripOwnerIds")
    private List<String> tripOwnerIds;
    
    @JsonProperty("driverIds")
    private List<String> driverIds;
    
    @JsonProperty("applicationStatus")
    private List<String> applicationStatus;   
    
    @JsonProperty("refernceNos")
    private List<String> refernceNos;   
    
    @JsonProperty("applicationNos")
    private List<String> applicationNos;   
    
    @JsonProperty("sortBy")
    private SortBy sortBy;
    
    @JsonProperty("sortOrder")
    private SortOrder sortOrder;
    
    public enum SortOrder {
        ASC,
        DESC
    }

    public enum SortBy {
    		applicationStatus,
        applicationiNo,
        vehicle,
        referenceNo,
        createdTime,
        tripStartTime,
        tripEndTime
    }
    
    public boolean isEmpty() {
		// TODO Auto-generated method stub
		 return (this.tenantId == null && this.offset == null && this.limit == null
				 && CollectionUtils.isEmpty(this.applicationStatus)  && StringUtils.isEmpty(businessService) &&
				 CollectionUtils.isEmpty(this.vehicleIds) &&
				 CollectionUtils.isEmpty(this.tripOwnerIds) && CollectionUtils.isEmpty(this.ids) && CollectionUtils.isEmpty(this.driverIds)
				 && CollectionUtils.isEmpty(this.applicationNos) && CollectionUtils.isEmpty(this.applicationNos));
	}
    
    public boolean tenantIdOnly() {
		// TODO Auto-generated method stub
		 return (this.tenantId != null && this.offset == null && this.limit == null
				 && CollectionUtils.isEmpty(this.applicationStatus)  && StringUtils.isEmpty(businessService) &&
				 CollectionUtils.isEmpty(this.vehicleIds) &&
				 CollectionUtils.isEmpty(this.tripOwnerIds) && CollectionUtils.isEmpty(this.ids) && CollectionUtils.isEmpty(this.driverIds)
				 && CollectionUtils.isEmpty(this.applicationNos) && CollectionUtils.isEmpty(this.applicationNos));
	}
    
}
