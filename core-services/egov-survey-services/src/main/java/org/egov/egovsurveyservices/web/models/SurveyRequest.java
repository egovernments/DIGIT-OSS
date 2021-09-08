package org.egov.egovsurveyservices.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SurveyRequest {

    @JsonProperty("SurveyEntity")
    SurveyEntity surveyEntity;

    @JsonProperty("RequestInfo")
    RequestInfo requestInfo;

}
