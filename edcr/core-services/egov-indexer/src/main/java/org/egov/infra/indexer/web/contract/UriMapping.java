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
public class UriMapping {

	  @JsonProperty("path")
	  private String path;
	  
	  @JsonProperty("apiRequest")
	  private Object request;
	  
	  @JsonProperty("queryParam")
	  private String queryParam;
	  
	  @JsonProperty("pathParam")
	  private String pathParam;
	  
	  @JsonProperty("moduleName")
	  private String moduleName;
	  
	  @JsonProperty("masterName")
	  private String masterName;
	  
	  @JsonProperty("tenantId")
	  private String tenantId;
	  
	  @JsonProperty("filter")
	  private String filter;
	  
	  @JsonProperty("filterMapping")
	  private List<FilterMapping> filterMapping;
	  
	  @JsonProperty("uriResponseMapping")
	  private List<FieldMapping> uriResponseMapping;
}
