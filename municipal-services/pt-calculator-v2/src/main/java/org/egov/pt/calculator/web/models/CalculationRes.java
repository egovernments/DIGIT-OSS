package org.egov.pt.calculator.web.models;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CalculationRes
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalculationRes   {
	
        @JsonProperty("ResponseInfo")
        private ResponseInfo responseInfo;

        @JsonProperty("Calculation")
        @Valid
        private List<Calculation> calculation;


        public CalculationRes addCalculationItem(Calculation calculationItem) {
            if (this.calculation == null) {
            this.calculation = new ArrayList<>();
            }
        this.calculation.add(calculationItem);
        return this;
        }

}

