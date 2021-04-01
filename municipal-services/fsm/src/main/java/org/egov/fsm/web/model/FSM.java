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
  private User citizen = null;

  @JsonProperty("id")
  private String id = null;

  @NotNull
  @Size(min=2,max=64)
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("applicationNo")
  private String applicationNo = null;

  @JsonProperty("description")
  private String description = null;

  @JsonProperty("accountId")
  private String accountId = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;

  @JsonProperty("applicationStatus")
  private String applicationStatus = null;

  @JsonProperty("source")
  private String source = null;

  @JsonProperty("sanitationtype")
  private String sanitationtype = null;

  @JsonProperty("propertyUsage")
  private String propertyUsage = null;
  
  @JsonProperty("vehicleType")
  private String vehicleType = null;

  @JsonProperty("noOfTrips")
  private Integer noOfTrips = null;

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
  private StatusEnum status = null;

  @JsonProperty("vehicleId")
  private String vehicleId = null;
  
  @JsonProperty("vehicle")
  private Vehicle vehicle = null;
  
  @JsonProperty("dsoId")
  private String dsoId = null;
  
  @JsonProperty("dso")
  private Vendor dso = null;
  
  @JsonProperty("possibleServiceDate")
  private Long possibleServiceDate = null;

  @JsonProperty("pitDetail")
  private PitDetail pitDetail = null;

  @Valid
  @JsonProperty("address")
  private Address address = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;
  
  @JsonProperty("wasteCollected")
  private Double wasteCollected = null;
  

  @JsonProperty("completedOn")
  private Long completedOn = null;

}
