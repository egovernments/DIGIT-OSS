package org.egov.vehicle.trip.web.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.vehicle.web.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlantMapping {

	@JsonProperty("id")
	private String id;

	@Size(max = 64)
	@JsonProperty("employeeUuid")
	private String employeeUuid;

	@Size(max = 64)
	@JsonProperty("plantCode")
	private String plantCode;

	@NotNull
	@Size(min = 2, max = 64)
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	/**
	 * Gets or Sets status
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
}
