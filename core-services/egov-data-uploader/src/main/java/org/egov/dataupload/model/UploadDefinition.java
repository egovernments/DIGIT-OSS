package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UploadDefinition   {
	
	  @JsonProperty("moduleName")
	  private String moduleName;
	  
	  @JsonProperty("summary")
	  private String summary;
	  
	  @JsonProperty("version")
	  private String version;
	  
	  @JsonProperty("Definitions")
	  private List<Definition> definitions;	  
	
}

