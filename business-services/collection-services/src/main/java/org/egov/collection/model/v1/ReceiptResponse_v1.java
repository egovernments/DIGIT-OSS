package org.egov.collection.model.v1;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Setter
@Getter
@ToString
@AllArgsConstructor
public class ReceiptResponse_v1  {

    public ReceiptResponse_v1() {
    }

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("Receipt")
    private List<Receipt_v1> receipts;

}