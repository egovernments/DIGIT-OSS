package org.egov.infra.persist.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
public class Mapping   {
	
  @JsonProperty("version")
  private String version = null;

  @JsonProperty("name")
  private String name = null;

  @JsonProperty("fromTopic")
  private String fromTopic = null;
  
  @JsonProperty("description")
  private String description = null;

  @JsonProperty("isTransaction")
  private Boolean isTransaction = true;

  @JsonProperty("isBatch")
  private Boolean isBatch = false;

  @JsonProperty("queryMaps")
  private List<QueryMap> queryMaps = null;

 
}

