package org.egov.fsm.web.model;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.fsm.web.model.dso.Vendor;
import org.egov.fsm.web.model.location.Address;
import org.egov.fsm.web.model.user.User;
import org.egov.fsm.web.model.vehicle.Vehicle;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request schema of FSM application.  
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FSM   {
  @JsonProperty("citizen")
  private User citizen ;

  @JsonProperty("id")
  private String id ;

  @NotNull
  @Size(min=2,max=64)
  @JsonProperty("tenantId")
  private String tenantId ;

  @JsonProperty("applicationNo")
  private String applicationNo ;

  @JsonProperty("description")
  private String description ;

  @JsonProperty("accountId")
  private String accountId ;

  @JsonProperty("additionalDetails")
  private Object additionalDetails ;

  @JsonProperty("applicationStatus")
  private String applicationStatus ;

  @JsonProperty("source")
  private String source ;

  @JsonProperty("sanitationtype")
  private String sanitationtype ;

  @JsonProperty("propertyUsage")
  private String propertyUsage ;
  
  @JsonProperty("vehicleType")
  private String vehicleType ;

  @JsonProperty("noOfTrips")
  private Integer noOfTrips ;

  /**
   * Gets or Sets status
   */
  public enum StatusEnum {
    ACTIVE("ACTIVE"),
    
    INACTIVE("INACTIVE");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static StatusEnum fromValue(String text) {
      for (StatusEnum b : StatusEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }
  @JsonProperty("status")
  private StatusEnum status ;

  @JsonProperty("vehicleId")
  private String vehicleId ;
  
  @JsonProperty("vehicle")
  private Vehicle vehicle ;
  
  @JsonProperty("dsoId")
  private String dsoId ;
  
  @JsonProperty("dso")
  private Vendor dso ;
  
  @JsonProperty("possibleServiceDate")
  private Long possibleServiceDate ;

  @JsonProperty("pitDetail")
  private PitDetail pitDetail ;

  @Valid
  @JsonProperty("address")
  private Address address;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails ;
  
  @JsonProperty("wasteCollected")
  private Double wasteCollected ;
  

  @JsonProperty("completedOn")
  private Long completedOn ;

}
