package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class ReceiptWorkflowRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("ReceiptWorkflow")
    @Size(min = 1)
    @Valid
    private List<ReceiptWorkflow> receiptWorkflow;

}
