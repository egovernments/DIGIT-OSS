package org.egov.swcalculation.web.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


/**
 * Construction/constructionDetail details are captured here. Detail information of the constructionDetail including floor wise usage and area are saved as seperate units .For each financial year construction details may change. constructionDetail object is required for tax calculation
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConstructionDetail   {
	
  @JsonProperty("carpetArea")
  private BigDecimal carpetArea;

  @JsonProperty("builtUpArea")
  private BigDecimal builtUpArea;

  @JsonProperty("plinthArea")
  private BigDecimal plinthArea;

  @JsonProperty("superBuiltUpArea")
  private BigDecimal superBuiltUpArea;

  @JsonProperty("constructionType")
  private String constructionType;

  @JsonProperty("constructionDate")
  private Long constructionDate;

  @JsonProperty("dimensions")
  private Object dimensions;

}
