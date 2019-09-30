package org.egov.collection.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {


    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("Payment")
    private Payment payment;

}
