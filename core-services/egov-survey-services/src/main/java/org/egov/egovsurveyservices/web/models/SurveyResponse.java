package org.egov.egovsurveyservices.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;
import org.egov.common.contract.response.ResponseInfo;

import javax.validation.Valid;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SurveyResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo = null;

    @JsonProperty("TotalCount")
    private Integer totalCount;

    @JsonProperty("Surveys")
    @Valid
    private List<SurveyEntity> surveyEntities = null;

}
