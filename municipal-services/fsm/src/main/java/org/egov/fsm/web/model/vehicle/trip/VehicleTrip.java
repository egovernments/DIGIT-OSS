package org.egov.fsm.web.model.vehicle.trip;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.User;
import org.egov.fsm.web.model.AuditDetails;
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
 * Request schema of VehicleTrip.  
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VehicleTrip   {

  @JsonProperty("id")
  private String id = null;

  @NotNull
  @NotBlank
  @JsonProperty("tenantId")
  private String tenantId = null;
  
  @JsonProperty("tripOwner")
  private User tripOwner = null;
  
  @JsonProperty("tripOwnerId")
  private String tripOwnerId = null;
  
  @JsonProperty("driver")
  private User driver = null;
  
  @JsonProperty("driverId")
  private String driverId = null;
  

  @NotNull
  @JsonProperty("vehicle")
  private Vehicle vehicle;
  

  @JsonProperty("vehicleId")
  private String vehicleId = null;

  @JsonProperty("applicationNo")
  private String applicationNo = null;
  
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

  @NotNull
  @NotBlank
  @JsonProperty("businessService")
  private String businessService = null;
  
  
  @JsonProperty("applicationStatus")
  private String applicationStatus = null;


  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;
  
  @NotNull
  @NotEmpty
  @Valid
  @JsonProperty("tripDetails")
  private List<VehicleTripDetail> tripDetails = null;


  @JsonProperty("tripStartTime")
  private Long tripStartTime = null;
  
  @JsonProperty("tripEndTime")
  private Long tripEndTime = null;
  
  @JsonProperty("volumeCarried")
  private Double volumeCarried = null;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;
  


}

