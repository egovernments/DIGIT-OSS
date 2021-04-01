package org.egov.egf.master.web.requests;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.master.web.contract.RecoveryContract;

import java.util.List;

@JsonInclude(value = Include.NON_NULL)
public @Data class RecoveryResponse {
	private ResponseInfo responseInfo;
	private List<RecoveryContract> recoverys;
	private PaginationContract page;
}