package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * CalculationReq
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalculationReq {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo = null;

    @JsonProperty("CalculationCriteria")
    @Valid
    private List<CalculationCriteria> calculationCriteria = new ArrayList<>();


    public CalculationReq addCalculationCriteriaItem(CalculationCriteria calculationCriteriaItem) {
        this.calculationCriteria.add(calculationCriteriaItem);
        return this;
    }

}

