package org.egov.vendor.web.model.location;

import org.egov.vendor.web.model.AuditDetails;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Representation of a address. Indiavidual APIs may choose to extend from this
 * using allOf if more details needed to be added in their case.
 */
//@Schema(description = "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. ")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-01-06T05:34:12.238Z[GMT]")
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class Address {

	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("doorNo")
	private String doorNo = null;

	@JsonProperty("plotNo")
	private String plotNo = null;

	@JsonProperty("id")
	private String id = null;

	@JsonProperty("landmark")
	private String landmark = null;

	@JsonProperty("city")
	private String city = null;

	@JsonProperty("district")
	private String district = null;

	@JsonProperty("region")
	private String region = null;

	@JsonProperty("state")
	private String state = null;

	@JsonProperty("country")
	private String country = null;

	@JsonProperty("pincode")
	private String pincode = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;

	@JsonProperty("buildingName")
	private String buildingName = null;

	@JsonProperty("street")
	private String street = null;

	@JsonProperty("locality")
	private Boundary locality = null;

	@JsonProperty("geoLocation")
	private GeoLocation geoLocation = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

}
