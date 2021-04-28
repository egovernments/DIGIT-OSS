package org.egov.fsm.web.model;

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
	
  @JsonProperty("type")
  private String type = null;

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
  
  @JsonProperty("diameter")
  private Double diameter = null;

  @JsonProperty("distanceFromRoad")
  private Double distanceFromRoad = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;
}
