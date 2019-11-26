package org.egov.pt.web.models;

import lombok.Builder;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;

@Builder
@Data
public class DemandBasedAssessmentRequest {

    RequestInfo requestInfo;

    DemandBasedAssessment demandBasedAssessment;


}
