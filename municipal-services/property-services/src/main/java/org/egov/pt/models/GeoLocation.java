package org.egov.pt.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * GeoLocation
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeoLocation   {
	
  @JsonProperty("latitude")
  private BigDecimal latitude;

  @JsonProperty("longitude")
  private BigDecimal longitude;

  @JsonProperty("additionalDetails")
  private Object additionalDetails;
  
}
