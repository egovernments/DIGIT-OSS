package org.egov.infra.indexer.web.contract;


import java.util.List;

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
public class CustomJsonMapping {

	  @JsonProperty("indexMapping")
	  private Object indexMapping;
	  
	  @JsonProperty("fieldMapping")
	  private List<FieldMapping> fieldMapping;
	  
	  @JsonProperty("externalUriMapping")
	  private List<UriMapping> externalUriMapping;
	  
	  @JsonProperty("mdmsMapping")
	  private List<UriMapping> mdmsMapping;
	  
	  
}
