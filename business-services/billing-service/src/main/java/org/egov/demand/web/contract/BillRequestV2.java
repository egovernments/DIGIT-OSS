package org.egov.demand.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BillV2;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder.Default;
/**
 * BillRequest
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillRequestV2   {
	
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo;
  
  @JsonProperty("Bills")
  @Default
  private List<BillV2> bills = new ArrayList<>();
}

