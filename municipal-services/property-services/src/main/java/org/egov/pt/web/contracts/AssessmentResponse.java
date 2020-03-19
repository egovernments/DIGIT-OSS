package org.egov.pt.web.contracts;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.models.Assessment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentResponse {
	
        @JsonProperty("ResponseInfo")
        private ResponseInfo responseInfo ;

        @JsonProperty("Assessments")
        @Valid
        private List<Assessment> assessments ;


        public AssessmentResponse addAssessmentsItem(Assessment assessmentsItem) {
            if (this.assessments == null) {
            this.assessments = new ArrayList<>();
            }
        this.assessments.add(assessmentsItem);
        return this;
        }

}

