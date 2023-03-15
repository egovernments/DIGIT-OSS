package org.egov.egf.instrument.web.requests;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;

import lombok.Data;

public @Data class InstrumentAccountCodeRequest {
    private RequestInfo requestInfo = new RequestInfo();
    private List<InstrumentAccountCodeContract> instrumentAccountCodes = new ArrayList<InstrumentAccountCodeContract>();
}