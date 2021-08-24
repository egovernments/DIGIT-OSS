package org.egov.pt.models;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Unit
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = { "id" })
public class Unit {

	@JsonProperty("id")
	private String id;

	@JsonProperty("tenantId")
	private String tenantId;

	@Max(value = 500)
	@JsonProperty("floorNo")
	private Integer floorNo;

	@JsonProperty("unitType")
	private String unitType;

	@JsonProperty("usageCategory")
	@NotNull
	private String usageCategory;

	@JsonProperty("occupancyType")
	private String occupancyType;

	@JsonProperty("active")
	private Boolean active;

	@JsonProperty("occupancyDate")
	private Long occupancyDate;

	@Valid
	@NotNull
	@JsonProperty("constructionDetail")
	private ConstructionDetail constructionDetail;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("arv")
	private BigDecimal arv;

}
