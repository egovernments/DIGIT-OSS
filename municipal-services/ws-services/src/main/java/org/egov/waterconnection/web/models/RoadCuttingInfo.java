package org.egov.waterconnection.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoadCuttingInfo {

  @JsonProperty("id")
  private String id ;

  @JsonProperty("roadType")
  private String roadType = null;

  @JsonProperty("roadCuttingArea")
  private Float roadCuttingArea = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails;

  @JsonProperty("status")
  private Status status;
}

