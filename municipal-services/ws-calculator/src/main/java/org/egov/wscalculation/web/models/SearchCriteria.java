package org.egov.wscalculation.web.models;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchCriteria {

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("status")
	private String status;

	@JsonProperty("ids")
	private Set<String> ids;

	@JsonProperty("applicationNumber")
	private String applicationNumber;
	
	@JsonProperty("applicationStatus")
	private String applicationStatus;

	@JsonProperty("connectionNumber")
	private String connectionNumber;

	@JsonProperty("oldConnectionNumber")
	private String oldConnectionNumber;

	@JsonProperty("mobileNumber")
	private String mobileNumber;
	
	@JsonProperty("propertyId")
	private String propertyId;

	@JsonIgnore
	private String accountId;

	@JsonProperty("fromDate")
	private Long fromDate = null;

	@JsonProperty("toDate")
	private Long toDate = null;

	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;

	@JsonIgnore
	private List<String> ownerIds;

	public boolean isEmpty() {
		return (this.tenantId == null && this.status == null && this.ids == null && this.applicationNumber == null
				&& this.connectionNumber == null && this.oldConnectionNumber == null && this.mobileNumber == null
				&& this.fromDate == null && this.toDate == null && this.ownerIds == null && this.propertyId == null);
	}

	public boolean tenantIdOnly() {
		return (this.tenantId != null && this.status == null && this.ids == null && this.applicationNumber == null
				&& this.connectionNumber == null && this.oldConnectionNumber == null && this.mobileNumber == null
				&& this.fromDate == null && this.toDate == null && this.ownerIds == null && this.propertyId == null);
	}

}
