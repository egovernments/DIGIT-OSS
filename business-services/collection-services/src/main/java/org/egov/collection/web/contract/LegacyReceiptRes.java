package org.egov.collection.web.contract;

import java.util.List;

import org.egov.collection.model.LegacyReceiptHeader;
import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class LegacyReceiptRes {
    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;
    
    @JsonProperty("")
    private List<LegacyReceiptHeader> legacyReceipts;
}
