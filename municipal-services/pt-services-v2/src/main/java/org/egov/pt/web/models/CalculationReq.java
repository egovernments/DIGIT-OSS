package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * CalculationReq
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-14T00:55:55.623+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CalculationReq {
	
		@JsonProperty("RequestInfo")
		@NotNull
        private RequestInfo requestInfo;

        @Valid
        @NotNull
        @Builder.Default
        @JsonProperty("CalculationCriteria")
        private List<CalculationCriteria> calculationCriteria = new ArrayList<>();


        public CalculationReq addCalulationCriteriaItem(CalculationCriteria calulationCriteriaItem) {
                if(null == this.calculationCriteria) this.calculationCriteria = new ArrayList<>();
        this.calculationCriteria.add(calulationCriteriaItem);
        return this;
        }

}

