package org.egov.egf.master.web.requests;

import lombok.Data;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.master.web.contract.RecoveryContract;

import java.util.ArrayList;
import java.util.List;

public @Data class RecoveryRequest {
	private RequestInfo requestInfo = new RequestInfo();
	private List<RecoveryContract> recoverys = new ArrayList<RecoveryContract>();
}