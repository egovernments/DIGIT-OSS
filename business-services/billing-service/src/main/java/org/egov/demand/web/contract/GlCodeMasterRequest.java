package org.egov.demand.web.contract;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.GlCodeMaster;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlCodeMasterRequest {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	@Valid
	@JsonProperty("GlCodeMasters")
	List<GlCodeMaster> glCodeMasters = new ArrayList<>();;

}
