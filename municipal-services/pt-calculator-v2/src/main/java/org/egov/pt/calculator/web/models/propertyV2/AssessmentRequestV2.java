package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

/**
 * The request to create or update an assessment. Contains the RequestHeader and the assessment details
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentRequestV2 {

  @JsonProperty("RequestInfo")
  private RequestInfo  requestInfo;

  @JsonProperty("Assessment")
  private AssessmentV2 assessment;
}
