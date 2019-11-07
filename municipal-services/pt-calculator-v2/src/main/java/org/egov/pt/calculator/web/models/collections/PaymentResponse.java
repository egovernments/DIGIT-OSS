package org.egov.pt.calculator.web.models.collections;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("Payments")
    private List<Payment> payments;

}
