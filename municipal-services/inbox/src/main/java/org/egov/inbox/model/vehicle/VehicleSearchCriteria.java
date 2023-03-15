package org.egov.inbox.model.vehicle;

import java.util.List;

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
public class VehicleSearchCriteria {
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
	    
	    @JsonProperty("mobileNumber")
		private String mobileNumber;
	    
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
	

}
