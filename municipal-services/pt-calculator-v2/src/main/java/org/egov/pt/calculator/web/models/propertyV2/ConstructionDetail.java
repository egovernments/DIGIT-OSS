package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.Digits;
import java.math.BigDecimal;

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

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("carpetArea")
	private BigDecimal carpetArea;

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("builtUpArea")
	private BigDecimal builtUpArea;

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("plinthArea")
	private BigDecimal plinthArea;

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("superBuiltUpArea")
	private BigDecimal superBuiltUpArea;

	@JsonProperty("constructionType")
	private String constructionType;

	@JsonProperty("constructionDate")
	private Long constructionDate;

	@JsonProperty("dimensions")
	private Object dimensions;

}
