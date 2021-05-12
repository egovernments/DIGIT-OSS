package org.egov.pt.models;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.SafeHtml;

/**
 * Construction/constructionDetail details are captured here. Detail information
 * of the constructionDetail including floor wise usage and area are saved as
 * seperate units .For each financial year construction details may change.
 * constructionDetail object is required for tax calculation
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConstructionDetail {

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("carpetArea")
	private BigDecimal carpetArea;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("builtUpArea")
	private BigDecimal builtUpArea;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("plinthArea")
	private BigDecimal plinthArea;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("superBuiltUpArea")
	private BigDecimal superBuiltUpArea;

	@SafeHtml
	@JsonProperty("constructionType")
	private String constructionType;

	@JsonProperty("constructionDate")
	private Long constructionDate;

	@JsonProperty("dimensions")
	private Object dimensions;

}
