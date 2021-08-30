package org.egov.egf.instrument.web.requests;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;

import lombok.Data;

public @Data class SurrenderReasonRequest {
    private RequestInfo requestInfo = new RequestInfo();
    private List<SurrenderReasonContract> surrenderReasons = new ArrayList<SurrenderReasonContract>();
}