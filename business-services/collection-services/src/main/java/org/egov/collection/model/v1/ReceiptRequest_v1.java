package org.egov.collection.model.v1;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
@ToString
@Builder
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptRequest_v1 {

    @NotNull
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @NotNull
    @JsonProperty("Receipt")
    @Valid
    private List<Receipt_v1> receipt = null;


}