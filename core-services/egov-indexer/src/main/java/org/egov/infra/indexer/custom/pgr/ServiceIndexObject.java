package org.egov.infra.indexer.custom.pgr;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class ServiceIndexObject extends Service {
	
	  @JsonProperty("gro")
	  private String gro;
	  
	  @JsonProperty("assignee")
	  private String assignee;
	  
	  @JsonProperty("department")
	  private String department;
	  
	  @JsonProperty("complaintCategory")
	  private String complaintCategory;
	  
	  @JsonProperty("sla")
	  private Integer sla;
	
	  @JsonProperty("actionHistory")
	  @Valid
	  private ActionHistory actionHistory = null;

}
