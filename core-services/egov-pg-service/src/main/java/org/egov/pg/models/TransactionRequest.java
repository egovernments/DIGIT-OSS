package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;


@AllArgsConstructor
@Getter
@ToString
public class TransactionRequest {

    @JsonProperty("RequestInfo")
    private org.egov.common.contract.request.RequestInfo requestInfo;

    @JsonProperty("Transaction")
    private Transaction transaction;
}
