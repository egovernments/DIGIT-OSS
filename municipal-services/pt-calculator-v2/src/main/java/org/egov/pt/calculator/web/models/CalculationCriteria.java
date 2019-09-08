package org.egov.pt.calculator.web.models;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.pt.calculator.web.models.property.Property;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
public class CalculationCriteria   {
	
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

        @NotNull
        @JsonProperty("tenantId")
        private String tenantId;


}

