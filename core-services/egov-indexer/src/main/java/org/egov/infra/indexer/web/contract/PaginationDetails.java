package org.egov.infra.indexer.web.contract;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginationDetails {
	
	@NotNull
	@JsonProperty("offsetKey")
	public String offsetKey;
	
	@NotNull
	@JsonProperty("sizeKey")
	public String sizeKey;
	
	@NotNull
	@JsonProperty("maxPageSize")
	public Integer maxPageSize;

	@JsonProperty("startingOffset")
	public Integer startingOffset = 0;

}
