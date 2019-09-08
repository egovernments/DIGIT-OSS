package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Instrument;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
@EqualsAndHashCode(of = {"receiptNumber"})
public class Receipt {

    @NotNull
    private String tenantId;

    private String transactionId;

    // Read only, populated during search
    private String receiptNumber;

    // Read only, populated during search
    private String consumerCode;

    // Read only, populated during search
    private Long receiptDate;

    @NotNull
    @Size(min = 1, max = 1)
    @Valid
    @JsonProperty("Bill")
    private List<Bill> bill = new ArrayList<>();

    private AuditDetails auditDetails;

    @Valid
    private Instrument instrument;

}
