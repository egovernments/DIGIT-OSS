package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Data
public class DemandBasedAssessmentResponse {

   @JsonProperty("ResponseInfo")
   ResponseInfo responseInfo;

   @JsonProperty("demandBasedAssessments")
   List<DemandBasedAssessment> demandBasedAssessments;
}
