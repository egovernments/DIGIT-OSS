package org.egov.collection.web.contract;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
/**
 * BillRequest
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillRequest   {
	
  @JsonProperty("RequestInfo")
  private RequestInfo requestInfo;

  @JsonProperty("Bills")
  private List<Bill> bills = new ArrayList<>();
}

