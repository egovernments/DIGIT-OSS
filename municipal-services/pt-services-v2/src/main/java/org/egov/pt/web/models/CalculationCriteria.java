package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * CalulationCriteria
 */
@Validated

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CalculationCriteria {
	
		@Valid
		@NotNull
        @JsonProperty("property")
        private Property property;

        @JsonProperty("assesmentNumber")
        private String assesmentNumber;

        @JsonProperty("assessmentYear")
        private String assessmentYear;

        @JsonProperty("oldAssessmentNumber")
        private String oldAssessmentNumber;

        @JsonProperty("tenantId")
        private String tenantId;


}

