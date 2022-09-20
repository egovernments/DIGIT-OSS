package org.egov.auditservice.persisterauditclient.models.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@ToString
public class QueryMap  {
  @JsonProperty("query")
  private String query = null;

  @JsonProperty("jsonMaps")
  private List<JsonMap> jsonMaps = new ArrayList<>();

  @JsonProperty("basePath")
  private String basePath = null;

  @JsonProperty("isParentEntity")
  private Boolean isParentEntity = false;
  
}

