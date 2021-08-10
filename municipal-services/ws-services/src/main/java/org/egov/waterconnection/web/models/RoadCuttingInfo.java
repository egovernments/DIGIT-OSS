package org.egov.waterconnection.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.validator.constraints.SafeHtml;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoadCuttingInfo {

  @SafeHtml
  @JsonProperty("id")
  private String id ;

  @SafeHtml
  @JsonProperty("roadType")
  private String roadType = null;

  @JsonProperty("roadCuttingArea")
  private Float roadCuttingArea = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails;

  @JsonProperty("status")
  private Status status;
}

