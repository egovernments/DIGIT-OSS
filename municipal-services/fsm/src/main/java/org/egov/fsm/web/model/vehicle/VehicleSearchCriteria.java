package org.egov.fsm.web.model.vehicle;

import java.util.List;

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
public class VehicleSearchCriteria {
	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("ownerId")
	private List<String> ownerId;
	
	@JsonProperty("id")
	private List<String> id;
	
	@JsonProperty("registrationNumber")
	private List<String> registrationNumber;
	
	@JsonProperty("type")
	private List<String> type;
	
	@JsonProperty("model")
	private List<String> model;
	
	@JsonProperty("tankCapicity")
	private Double tankCapicity;
	
	@JsonProperty("suctionType")
	private List<String> suctionType;

    @JsonProperty("mobileIds")
    private List <String> mobileIds;

	  @JsonProperty("sortBy")
	    private SortBy sortBy;
	    
	    @JsonProperty("sortOrder")
	    private SortOrder sortOrder;
	    
	    public enum SortOrder {
	        ASC,
	        DESC
	    }

	    public enum SortBy {
	    	TYPE,
	    	MODEL,
	    	SUCTIONTYPE,
	    	POLLUTIONCERTIVALIDTILL,
	    	INSURANCECERTVALIDTILL,
	    	FITNESSVALIDTILL,
	    	ROADTAXPAIDTILL,
	    	TANKCAPICITY,
	    	CREATEDTIME
	    }
	

	public boolean isEmpty() {
		return (this.tenantId == null && this.offset == null && this.limit == null && this.mobileNumber == null && this.tankCapicity ==null
				&&  CollectionUtils.isEmpty(this.ownerId)  && CollectionUtils.isEmpty(this.type)
				&& CollectionUtils.isEmpty(this.id) && CollectionUtils.isEmpty(this.registrationNumber)
				&& CollectionUtils.isEmpty(this.model) && CollectionUtils.isEmpty(this.suctionType));
	}

	public boolean tenantIdOnly() {
		return (this.tenantId != null && this.mobileNumber == null && this.tankCapicity ==null
				&&  CollectionUtils.isEmpty(this.ownerId)  && CollectionUtils.isEmpty(this.type)
				&& CollectionUtils.isEmpty(this.id) && CollectionUtils.isEmpty(this.registrationNumber)
				&& CollectionUtils.isEmpty(this.model) && CollectionUtils.isEmpty(this.suctionType));
	}
}
