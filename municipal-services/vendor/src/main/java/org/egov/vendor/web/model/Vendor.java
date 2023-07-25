package org.egov.vendor.web.model;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.web.model.location.Address;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.vehicle.Vehicle;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



/**
 * Capture the vendor information in the system.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-01-06T05:34:12.238Z[GMT]")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Vendor {

	@SafeHtml
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("tenantId")
	@SafeHtml
	@Size(max=64)
	private String tenantId = null;

	@JsonProperty("name")
	@SafeHtml
	@Size(max=128)
	private String name = null;

	@JsonProperty("address")
	private Address address = null;

	@JsonProperty("owner")
	@Valid
	private User owner = null;

	@JsonProperty("vehicles")
	@Valid
	private List<Vehicle> vehicles = new ArrayList<Vehicle>();

	@JsonProperty("drivers")
	@Valid
	private List<Driver> drivers = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;

	@SafeHtml
	@JsonProperty("source")
	private String source = null;

	@SafeHtml
	@JsonProperty("description")
	private String description = null;
	
	@JsonProperty("ownerId")
	@SafeHtml
	@Size(max=64)
	private String ownerId = null;

	@JsonProperty("agencyType")
	@SafeHtml
	@Size(max=128)
	private String agencyType = null;
	
	@JsonProperty("paymentPreference")
	@SafeHtml
	@Size(max=128)
	private String paymentPreference = null;

	/**
	 * Inactive records will be consider as soft deleted
	 */
	public enum StatusEnum {
		ACTIVE("ACTIVE"),

		INACTIVE("INACTIVE");

		private String value;

		StatusEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
		
			return String.valueOf(value);
		}

		@JsonCreator
		public static StatusEnum fromValue(String text) {
			for (StatusEnum b : StatusEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}

	@JsonProperty("status")
	private StatusEnum status = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

}
