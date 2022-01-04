package org.egov.search.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SearchDefinition   {
	
	  @JsonProperty("moduleName")
	  private String moduleName;
	  
	  @JsonProperty("summary")
	  private String summary;
	  
	  @JsonProperty("version")
	  private String version;
	  
	  @JsonProperty("definitions")
	  private List<Definition> definitions;	  
	
}

