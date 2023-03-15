package org.egov.fsm.web.model.dso;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.web.model.AuditDetails;
import org.egov.fsm.web.model.location.Address;
import org.egov.fsm.web.model.user.User;
import org.egov.fsm.web.model.vehicle.Vehicle;
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
	private String id;

	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId;

	@SafeHtml
	@JsonProperty("name")
	private String name;

	@JsonProperty("address")
	private Address address;

	@JsonProperty("owner")
	private User owner;

	@JsonProperty("vehicles")
	@Valid
	private List<Vehicle> vehicles = new ArrayList<Vehicle>();

	@JsonProperty("drivers")
	@Valid
	private List<Driver> drivers;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@SafeHtml
	@JsonProperty("source")
	private String source;

	@SafeHtml
	@JsonProperty("description")
	private String description;

	@SafeHtml
	@JsonProperty("ownerId")
	private String ownerId;

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
	private StatusEnum status;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

}
