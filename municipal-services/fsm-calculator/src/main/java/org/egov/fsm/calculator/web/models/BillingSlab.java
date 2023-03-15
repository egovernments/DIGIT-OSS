package org.egov.fsm.calculator.web.models;

import java.math.BigDecimal;

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
 * Request schema of Billing Slab.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BillingSlab {

	@JsonProperty("id")
	private String id = null;
	
	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("capacityFrom")
	private BigDecimal capacityFrom = null;
	
	@JsonProperty("capacityTo")
	private BigDecimal capacityTo = null;
	
	@JsonProperty("propertyType")
	private String propertyType = null;
	
	@JsonProperty("slum")
	private SlumEnum slum = null;

	@JsonProperty("price")
	private BigDecimal price = null;

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

	/**
	 * Gets or Sets SLUM
	 */
	public enum SlumEnum {
		YES("YES"),

		NO("NO"),
		
		YESNO("YESNO");

		private String value;

		SlumEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static SlumEnum fromValue(String text) {
			for (SlumEnum b : SlumEnum.values()) {
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
