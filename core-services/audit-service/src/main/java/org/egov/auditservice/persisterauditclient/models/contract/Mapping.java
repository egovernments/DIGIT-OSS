package org.egov.auditservice.persisterauditclient.models.contract;

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

  @JsonProperty("module")
  private String module = null;

  @JsonProperty("objecIdJsonPath")
  private String objecIdJsonPath = null;

  @JsonProperty("tenantIdJsonPath")
  private String tenantIdJsonPath = null;

  @JsonProperty("transactionCodeJsonPath")
  private String transactionCodeJsonPath = null;

  @JsonProperty("isAuditEnabled")
  private Boolean isAuditEnabled = null;

  @JsonProperty("auditAttributeBasePath")
  private String auditAttributeBasePath = null;

 
}

