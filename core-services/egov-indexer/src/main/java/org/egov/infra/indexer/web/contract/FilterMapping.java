package org.egov.infra.indexer.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class FilterMapping{
	
	@JsonProperty("variable")
	public String variable;
    
	@JsonProperty("valueJsonpath")
	public String valueJsonpath;

}
