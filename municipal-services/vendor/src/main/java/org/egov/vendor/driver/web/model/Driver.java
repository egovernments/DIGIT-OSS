package org.egov.vendor.driver.web.model;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.egov.vendor.web.model.AuditDetails;
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
 * Capture the Drivers information in the system.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-01-06T05:34:12.238Z[GMT]")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Driver {
	@SafeHtml
	@JsonProperty("id")
	private String id = null;
	
	@JsonProperty("tenantId")
	@SafeHtml
	@Size(max=64)
	private String tenantId = null;

	@JsonProperty("ownerId")
	@SafeHtml
	@Size(max=64)
	private String ownerId = null;
	
	@JsonProperty("name")
	@SafeHtml
	@Size(max = 128)
	private String name = null;

	@JsonProperty("driverLicenseNumber")
	@SafeHtml
	@Size(max = 128)
	private String driverLicenseNumber = null;

	@JsonProperty("vendorName")
	@SafeHtml
	@Size(max = 64)
	private String vendrName = null;

	@JsonProperty("drivers")
	@Valid
	private List<Driver> drivers = new ArrayList<Driver>();

	//dateOfCreation

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
