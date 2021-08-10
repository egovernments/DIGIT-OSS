package org.egov.fsm.calculator.web.models;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. 
 */
@ApiModel(description = "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. ")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Address   {
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("doorNo")
  private String doorNo = null;

  @JsonProperty("plotNo")
  private String plotNo = null;

  @JsonProperty("id")
  private String id = null;

  @JsonProperty("landmark")
  private String landmark = null;

  @JsonProperty("city")
  private String city = null;

  @JsonProperty("district")
  private String district = null;

  @JsonProperty("region")
  private String region = null;

  @JsonProperty("state")
  private String state = null;

  @JsonProperty("country")
  private String country = null;

  @JsonProperty("pincode")
  private String pincode = null;

  @JsonProperty("additionDetails")
  private String additionDetails = null;

  @JsonProperty("buildingName")
  private String buildingName = null;

  @JsonProperty("street")
  private String street = null;
  
  @JsonProperty("slumName")
  private String slumName = null;

  @JsonProperty("locality")
  private Boundary locality = null;

  @JsonProperty("geoLocation")
  private GeoLocation geoLocation = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  
}
