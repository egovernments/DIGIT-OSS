package org.egov.pgr.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

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
	private String tenantId;
	
	@JsonProperty("serviceRequestId")
	private List<String> serviceRequestId;
	
	@JsonProperty("assignedTo")
	private String assignedTo;
	
	@JsonProperty("accountId")
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
	private String group;
	
	@JsonProperty("serviceCodes")
	private List<String> serviceCodes;
	
	@JsonProperty("phone")
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
