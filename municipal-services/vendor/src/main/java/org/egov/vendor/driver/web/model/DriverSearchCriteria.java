package org.egov.vendor.driver.web.model;

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
public class DriverSearchCriteria {
	
	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("mobileNumber")
	private String mobileNumber;
	
	@JsonProperty("ownerIds")
	private List<String> ownerIds;
	
	@JsonProperty("name")
	private List<String> name;
	
	@JsonProperty("dsoName")
	private List<String> dsoName;


	@JsonProperty("ids")
	private List<String> ids;
	
	@JsonProperty("status")
	private List<String> status; 
	
	@JsonProperty("driverWithNoVendor")
	private boolean driverWithNoVendor;


	public boolean isEmpty() {
		// TODO Auto-generated method stub
		return (this.tenantId == null && this.offset == null && this.limit == null && this.mobileNumber == null
				&& this.ownerIds == null && CollectionUtils.isEmpty(this.name) && CollectionUtils.isEmpty(this.ids)
				&& CollectionUtils.isEmpty(this.status));
	}

	public boolean tenantIdOnly() {
		// TODO Auto-generated method stub
		return (this.tenantId != null && this.mobileNumber == null && this.ownerIds == null
				&& CollectionUtils.isEmpty(this.name) && CollectionUtils.isEmpty(this.ids) 
				&& CollectionUtils.isEmpty(this.status));
	}
	

}