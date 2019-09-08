package org.egov.infra.indexer.web.contract;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

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
public class Index {
	
	  @JsonProperty("name")
	  private String name;

	  @JsonProperty("type")
	  private String type;

	  @JsonProperty("id")
	  private String id;
	  
	  @JsonProperty("isBulk")
	  private Boolean isBulk;
	  
	  @JsonProperty("jsonPath")
	  private String jsonPath;
	  
	  @JsonProperty("timeStampField")
	  private String timeStampField;
	  
	  @JsonProperty("fieldsToBeMasked")
	  private List<String> fieldsToBeMasked;
	 
	  @JsonProperty("typeConfig")
	  private TypeConfig typeConfig;
	  
	  @JsonProperty("customJsonMapping")
	  public CustomJsonMapping customJsonMapping;
	 
}
