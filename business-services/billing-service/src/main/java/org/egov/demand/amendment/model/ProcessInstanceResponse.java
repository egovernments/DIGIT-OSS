package org.egov.demand.amendment.model;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Contract class to send response. Array of TradeLicense items are used in case
 * of search results or response for create, whereas single TradeLicense item is
 * used for update
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProcessInstanceResponse {
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("ProcessInstances")
	@Valid
	private List<ProcessInstance> processInstances;

	public ProcessInstanceResponse addProceInstanceItem(ProcessInstance proceInstanceItem) {
		if (this.processInstances == null) {
			this.processInstances = new ArrayList<>();
		}
		this.processInstances.add(proceInstanceItem);
		return this;
	}

}
