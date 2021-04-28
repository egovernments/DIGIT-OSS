package org.egov.egf.instrument.web.requests;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.web.contract.DishonorReasonContract;

import lombok.Data;

public @Data class DishonorReasonRequest {
    private RequestInfo requestInfo = new RequestInfo();
    private List<DishonorReasonContract> surrenderReasons = new ArrayList<DishonorReasonContract>();
}