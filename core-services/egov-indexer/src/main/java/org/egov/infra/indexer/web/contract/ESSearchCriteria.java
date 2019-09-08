package org.egov.infra.indexer.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ESSearchCriteria {

	@NotNull
	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("index")
	public String index;
	
	@NotNull
	@JsonProperty("type")
	public String type;
	
	@NotNull
	@JsonProperty("id")
	public String id;
	
	@JsonProperty("fields")
	public List<String> fields;
	
}
