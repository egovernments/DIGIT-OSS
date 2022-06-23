package org.egov.auditservice.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

/**
 * Data object containing static master data to be ingested for DSS Dashboards
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2022-03-30T07:20:03.639Z[GMT]")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RequestInfoWrapper   {
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo = null;

}
