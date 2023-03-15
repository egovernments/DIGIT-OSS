package org.egov.swservice.web.models.collection;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
public class PaymentResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @NotNull
    @Valid
    @JsonProperty("Payments")
    private List<Payment> payments;
}
