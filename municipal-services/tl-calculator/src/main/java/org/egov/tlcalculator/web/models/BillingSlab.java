package org.egov.tlcalculator.web.models;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BillingSlab {
	
	@JsonProperty("tenantId")
	@NotNull
	@Size(min = 2, max = 128)
	private String tenantId = null;

	@JsonProperty("id")
	@Size(min = 2, max = 64)
	private String id = null;

	@JsonProperty("licenseType")
	private LicenseTypeEnum licenseType = null;
	
	@JsonProperty("applicationType")
	private String applicationType = null;

	@JsonProperty("structureType")
	@Size(min = 2, max = 64)
	private String structureType = null;

	@JsonProperty("tradeType")
	@Size(min = 2, max = 64)
	private String tradeType = null;

	@JsonProperty("accessoryCategory")
	@Size(min = 2, max = 64)
	private String accessoryCategory = null;

	@JsonProperty("type")
	private TypeEnum type = null;
	
	@JsonProperty("uom")
	@Size(min = 2, max = 32)
	private String uom = null;

	@JsonProperty("fromUom")
	private Double fromUom = null;

	@JsonProperty("toUom")
	private Double toUom = null;

	@JsonProperty("rate")
	private BigDecimal rate = null;
	
	private AuditDetails auditDetails;

	
	public enum LicenseTypeEnum {
		TEMPORARY("TEMPORARY"),

		PERMANENT("PERMANENT");

		private String value;

		LicenseTypeEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static LicenseTypeEnum fromValue(String text) {
			for (LicenseTypeEnum b : LicenseTypeEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}
	
	public enum TypeEnum {
		RATE("RATE"),

		FLAT("FLAT");

		private String value;

		TypeEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static TypeEnum fromValue(String text) {
			for (TypeEnum b : TypeEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}
}
