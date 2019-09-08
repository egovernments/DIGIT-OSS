package org.egov.pg.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.pg.models.Transaction;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionSearchResponse {

    @JsonProperty("ResponseInfo")
    @Valid
    private ResponseInfo responseInfo;

    @JsonProperty("Transaction")
    @Valid
    private List<Transaction> transactions;

}
