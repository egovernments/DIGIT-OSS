package org.egov.fsm.calculator.web.models;

import org.egov.common.contract.request.User;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * cature the pit details 
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PitDetail   {
  @JsonProperty("citizen")
  private User citizen = null;

  @JsonProperty("id")
  private String id = null;

  @JsonProperty("tenantId")
  private String tenantId = null;
  
  @JsonProperty("height")
  private Double height = null;

  @JsonProperty("length")
  private Double length = null;

  @JsonProperty("width")
  private Double width = null;

  @JsonProperty("distanceFromRoad")
  private Double distanceFromRoad = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;
}
