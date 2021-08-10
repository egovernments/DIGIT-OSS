package org.egov.swcalculation.web.models;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

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
@EqualsAndHashCode(of= {"id"})
public class Unit   {
	
  @JsonProperty("id")
  private String id;

  @JsonProperty("tenantId")
  private String tenantId;

  @JsonProperty("floorNo")
  private Integer floorNo;

  @JsonProperty("unitType")
  private String unitType;

  @JsonProperty("usageCategory")
  @NotNull
  private String usageCategory;

  @JsonProperty("occupancyType")
  private OccupancyType occupancyType;

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


  @JsonProperty("arv")
  private BigDecimal arv;

}
