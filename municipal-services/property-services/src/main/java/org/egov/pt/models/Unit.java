package org.egov.pt.models;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.SafeHtml;

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

	@SafeHtml
	@JsonProperty("id")
	private String id;

	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId;

	@Max(value = 500)
	@JsonProperty("floorNo")
	private Integer floorNo;

	@SafeHtml
	@JsonProperty("unitType")
	private String unitType;

	@JsonProperty("usageCategory")
	@SafeHtml
	@NotNull
	private String usageCategory;

	@SafeHtml
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
	private Object additionalDetails;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("arv")
	private BigDecimal arv;

}
