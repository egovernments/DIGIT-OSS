package org.egov.egf.instrument.web.requests;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

@JsonInclude(value = Include.NON_NULL)
public @Data class InstrumentAccountCodeResponse {
    private ResponseInfo responseInfo;
    private List<InstrumentAccountCodeContract> instrumentAccountCodes;
    private PaginationContract page;
}