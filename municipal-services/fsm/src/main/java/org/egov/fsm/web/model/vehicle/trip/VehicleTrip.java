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

import com.fasterxml.jackson.annotation.JsonProperty;

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
  private String id ;

  @NotNull
  @NotBlank
  @JsonProperty("tenantId")
  private String tenantId ;
  
  @JsonProperty("tripOwner")
  private User tripOwner;
  
  @JsonProperty("tripOwnerId")
  private String tripOwnerId ;
  
  @JsonProperty("driver")
  private User driver;
  
  @JsonProperty("driverId")
  private String driverId ;
  

  @NotNull
  @JsonProperty("vehicle")
  private Vehicle vehicle;
  

  @JsonProperty("vehicleId")
  private String vehicleId ;

  @JsonProperty("applicationNo")
  private String applicationNo;
  
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
  }
  @JsonProperty("status")
  private StatusEnum status ;

  @NotNull
  @NotBlank
  @JsonProperty("businessService")
  private String businessService ;
  
  
  @JsonProperty("applicationStatus")
  private String applicationStatus ;


  @JsonProperty("additionalDetails")
  private Object additionalDetails;
  
  @NotNull
  @NotEmpty
  @Valid
  @JsonProperty("tripDetails")
  private List<VehicleTripDetail> tripDetails ;


  @JsonProperty("tripStartTime")
  private Long tripStartTime ;
  
  @JsonProperty("tripEndTime")
  private Long tripEndTime ;
  
  @JsonProperty("volumeCarried")
  private Double volumeCarried ;
  
  @JsonProperty("auditDetails")
  private AuditDetails auditDetails ;
  


}

