package org.egov.egf.instrument.web.requests;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;

import lombok.Data;

public @Data class InstrumentTypeRequest {
    private RequestInfo requestInfo = new RequestInfo();
    private List<InstrumentTypeContract> instrumentTypes = new ArrayList<InstrumentTypeContract>();
}