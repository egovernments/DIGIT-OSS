package org.egov.demand.web.contract;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxHeadMaster;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxHeadMasterRequest {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
	@Valid
	@JsonProperty("TaxHeadMasters")
	List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();;
}
