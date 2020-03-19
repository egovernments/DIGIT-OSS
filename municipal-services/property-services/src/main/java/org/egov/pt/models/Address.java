package org.egov.pt.models;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.pt.models.enums.Type;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {

	@JsonProperty("id")
	private String id;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("doorNo")
	private String doorNo;

	@JsonProperty("latitude")
	private Double latitude;

	@JsonProperty("longitude")
	private Double longitude;

	@JsonProperty("addressNumber")
	private String addressNumber;

	@JsonProperty("type")
	@NotNull
	private Type type;

	@JsonProperty("addressLine1")
	private String addressLine1;

	@JsonProperty("addressLine2")
	private String addressLine2;

	@JsonProperty("landmark")
	private String landmark;

	@JsonProperty("city")
	private String city;

	@JsonProperty("pincode")
	@NotNull
	private String pincode;

	@JsonProperty("detail")
	private String detail;

	@JsonProperty("buildingName")
	private String buildingName;

	@JsonProperty("street")
	private String street;

	@JsonProperty("locality")
	@NotNull
	@Valid
	private Boundary locality;
}
