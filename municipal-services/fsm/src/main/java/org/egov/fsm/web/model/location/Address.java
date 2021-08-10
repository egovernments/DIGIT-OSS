package org.egov.fsm.web.model.location;

import javax.validation.constraints.Max;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.egov.fsm.web.model.AuditDetails;
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
 * Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. 
 */

@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-09T07:13:46.742Z[GMT]")


@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class Address   {
  @JsonProperty("tenantId")
  private String tenantId ;

 @Size(max=256)
  @JsonProperty("doorNo")
  private String doorNo ;

 @Size(max=64)
  @JsonProperty("plotNo")
  private String plotNo ;

  @JsonProperty("id")
  private String id ;

  @Size(max=1024)
  @JsonProperty("landmark")
  private String landmark ;

  @JsonProperty("city")
  private String city ;

  @JsonProperty("district")
  private String district ;
  @Size(max=64)
  @JsonProperty("region")
  private String region ;
  
  @Size(max=64)
  @JsonProperty("state")
  private String state ;

  @Size(max=64)
  @JsonProperty("country")
  private String country ;

  @Size(max=6)
  @Pattern( regexp = "^[1-9]{1}[0-9]{5}$")
  @JsonProperty("pincode")
  private String pincode ;

  @JsonProperty("additionalDetails")
  private Object additionalDetails ;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails ;

  @Size(max=64)
  @JsonProperty("buildingName")
  private String buildingName ;

  @Size(max=256)
  @JsonProperty("street")
  private String street ;
  
  @JsonProperty("slumName")
  private String slumName ;

  @JsonProperty("locality")
  private Boundary locality ;
  

  @JsonProperty("geoLocation")
  private GeoLocation geoLocation ;

 
}
