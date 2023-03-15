package org.egov.fsm.web.model;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PeriodicApplicationResponse {
	
	@JsonProperty("responseInfo")
	ResponseInfo responseInfo;
	
	@JsonProperty("applicationNoList")
	List<String> applicationNoList;
	
}
