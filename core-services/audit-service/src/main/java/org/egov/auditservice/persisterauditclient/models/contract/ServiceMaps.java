package org.egov.auditservice.persisterauditclient.models.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
public class ServiceMaps   {
	
  @JsonProperty("serviceName")
  private String serviceName = null;

  @JsonProperty("mappings")
  private List<Mapping> mappings = null;

 
}
