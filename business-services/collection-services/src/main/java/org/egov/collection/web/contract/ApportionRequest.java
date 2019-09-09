package org.egov.collection.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
public class ApportionRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	private String tenantId;

	private List<Bill> bills;

}
