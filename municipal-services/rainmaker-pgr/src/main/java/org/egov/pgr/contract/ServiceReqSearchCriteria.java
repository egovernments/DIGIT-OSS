package org.egov.pgr.contract;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceReqSearchCriteria {
		
	@NotNull
	@JsonProperty("tenantId")
	@Size(min=2,max=25)
	@Pattern(regexp="^[a-zA-Z.]*$")
	private String tenantId;
	
	@JsonProperty("serviceRequestId")
	private List<String> serviceRequestId;
	
	@JsonProperty("assignedTo")
	@Pattern(regexp="^[a-zA-Z0-9]$")
	private String assignedTo;
	
	@JsonProperty("accountId")
	@Pattern(regexp="^[a-zA-Z0-9]$")
	private String accountId;
	
	@JsonProperty("status")
	private List<String> status;
	
	@JsonProperty("startDate")
	private Long startDate;
	
	@JsonProperty("endDate")
	private Long endDate;
	
	@JsonProperty("lastUpdatedSince")
	private Long lastUpdatedSince;	
	
	@JsonProperty("group")
	@Pattern(regexp="^[a-zA-Z.]$")
	private String group;
	
	@JsonProperty("serviceCodes")
	private List<String> serviceCodes;
	
	@JsonProperty("phone")
	@Pattern(regexp="(^$|[0-9]{10})")
	private String phone;
	
	@JsonProperty("active")
	private Boolean active;
	
	@JsonProperty("createdBy")
	private String createdBy;
	
	@JsonProperty("noOfRecords")
	private Long noOfRecords;
	
	@JsonProperty("offset")
	private Long offset;
	
}
