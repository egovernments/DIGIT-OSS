package org.egov.pt.web.contracts;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.models.Assessment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * The response of create or update of assessment. Contains the ResponseHeader and created/updated assessment
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResponse   {
  @JsonProperty("ResponseInfo")
  private ResponseInfo responseInfo;

  @JsonProperty("Assessments")
  private List<Assessment> assessments;

 
}
