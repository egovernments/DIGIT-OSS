package org.egov.collection.web.contract;

import java.util.List;

import org.egov.collection.model.LegacyReceiptHeader;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LegacyReceiptReq {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    
    @JsonProperty("LegacyReceipts")
    private List<LegacyReceiptHeader> legacyReceipts;

}
