package org.egov.vendor.web.model.location;


import java.util.Objects;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * GeoLocation
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-01-06T05:34:12.238Z[GMT]")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeoLocation {

	@SafeHtml
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("latitude")
	private Double latitude = null;

	@JsonProperty("longitude")
	private Double longitude = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;

	public GeoLocation latitude(Double latitude) {
		this.latitude = latitude;
		return this;
	}

	public GeoLocation id(String id) {
		this.id = id;
		return this;
	}

	/**
	 * latitude of the address
	 * 
	 * @return latitude
	 **/
	@ApiModelProperty(value = "latitude of the address")

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	/**
	 * latitude of the address
	 * 
	 * @return latitude
	 **/
	// @Schema(description = "latitude of the address")
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public GeoLocation longitude(Double longitude) {
		this.longitude = longitude;
		return this;
	}

	/**
	 * longitude of the address
	 * 
	 * @return longitude
	 **/
	// @Schema(description = "longitude of the address")
	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public GeoLocation additionalDetails(Object additionalDetails) {
		this.additionalDetails = additionalDetails;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated by
	 * model
	 * 
	 * @return additionalDetails
	 **/
	// @Schema(description = "Json object to capture any extra information which is
	// not accommodated by model")
	public Object getAdditionalDetails() {
		return additionalDetails;
	}

	public void setAdditionalDetails(Object additionalDetails) {
		this.additionalDetails = additionalDetails;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		GeoLocation geoLocation = (GeoLocation) o;
		return Objects.equals(this.latitude, geoLocation.latitude)
				&& Objects.equals(this.longitude, geoLocation.longitude)
				&& Objects.equals(this.additionalDetails, geoLocation.additionalDetails);
	}

	@Override
	public int hashCode() {
		return Objects.hash(latitude, longitude, additionalDetails);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class GeoLocation {\n");

		sb.append("    latitude: ").append(toIndentedString(latitude)).append("\n");
		sb.append("    longitude: ").append(toIndentedString(longitude)).append("\n");
		sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
		sb.append("}");
		return sb.toString();
	}

	/**
	 * Convert the given object to string with each line indented by 4 spaces
	 * (except the first line).
	 */
	private String toIndentedString(java.lang.Object o) {
		if (o == null) {
			return "null";
		}
		return o.toString().replace("\n", "\n    ");
	}

	
}
