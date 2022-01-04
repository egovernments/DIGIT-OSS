package org.egov.infra.persist.web.contract;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
  
}

