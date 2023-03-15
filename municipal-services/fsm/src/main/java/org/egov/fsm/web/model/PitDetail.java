package org.egov.fsm.web.model;

import javax.validation.constraints.DecimalMax;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * cature the pit details 
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@AllArgsConstructor
@EqualsAndHashCode
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
public class PitDetail   {
 
  @SafeHtml
  @JsonProperty("type")
  private String type = null;

  @SafeHtml
  @JsonProperty("id")
  private String id = null;

  @SafeHtml
  @JsonProperty("tenantId")
  private String tenantId = null;
  
  @JsonProperty("height")
  @DecimalMax(value="99.9")
  private Double height = null;

  @JsonProperty("length")
  @DecimalMax(value="99.9",message="Length value sholud be less than 100")
  private Double length = null;

  @JsonProperty("width")
  @DecimalMax(value="99.9",message="Width value sholud be less than 100")
  private Double width = null;
 
  @DecimalMax(value="99.9", message="Diameter value sholud be less than 100")
  @JsonProperty("diameter")
  private Double diameter = null;

  @JsonProperty("distanceFromRoad")
  private Double distanceFromRoad = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;
  
  @JsonProperty("additionalDetails")
  private Object additionalDetails ;
  
}
