package org.egov.vendor.web.model;

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
public class VendorSearchCriteria {
	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("vehicleType")
	private String vehicleType;

	@JsonProperty("ownerIds")
	private List<String> ownerIds;

	@JsonProperty("vehicleRegistrationNumber")
	private List<String> vehicleRegistrationNumber;

	@JsonProperty("vehicleIds")
	private List<String> vehicleIds;

	@JsonProperty("name")
	private List<String> name;

	@JsonProperty("ids")
	private List<String> ids;

	@JsonProperty("vehicleCapacity")
	private String vehicleCapacity;

	@JsonProperty("status")
	private List<String> status;

	@JsonProperty("driverIds")
	private List<String> driverIds;

	@JsonProperty("sortBy")
	private SortBy sortBy;

	@JsonProperty("sortOrder")
	private SortOrder sortOrder;

	public enum SortOrder {
		ASC, DESC
	}

	public enum SortBy {
		tenantId, mobileNumber, vehicleType, ownerIds, vehicleRegistrationNumber, vehicleIds, name, ids,
		vehicleCapacity, status, driverIds, createdTime,vendor_createdTime
	}

	public boolean isEmpty() {
		return (this.tenantId == null && this.offset == null && this.limit == null && this.mobileNumber == null
				&& CollectionUtils.isEmpty(this.vehicleRegistrationNumber) && this.ownerIds == null
				&& CollectionUtils.isEmpty(this.name) && CollectionUtils.isEmpty(this.vehicleIds)
				&& CollectionUtils.isEmpty(this.ids) && this.vehicleType == null && this.vehicleCapacity == null
				&& CollectionUtils.isEmpty(this.status));
	}

	public boolean tenantIdOnly() {
		return (this.tenantId != null && this.mobileNumber == null && this.ownerIds == null
				&& CollectionUtils.isEmpty(this.vehicleRegistrationNumber) && CollectionUtils.isEmpty(this.vehicleIds)
				&& CollectionUtils.isEmpty(this.name) && CollectionUtils.isEmpty(this.ids) && this.vehicleType == null
				&& this.vehicleCapacity == null && CollectionUtils.isEmpty(this.status));
	}

}
