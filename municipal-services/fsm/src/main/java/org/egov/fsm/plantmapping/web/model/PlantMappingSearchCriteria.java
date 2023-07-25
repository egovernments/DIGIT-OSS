package org.egov.fsm.plantmapping.web.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlantMappingSearchCriteria {
	
		
    @JsonProperty("tenantId")
    private String tenantId;
    

    @JsonProperty("plantCode")
    private String plantCode;
    
    @JsonProperty("employeeUuid")
    private List<String> employeeUuid;
    
    @JsonProperty("ids")
    private List <String> ids;
    
    
    public boolean isEmpty() {
  		// TODO Auto-generated method stub
  		 return (this.tenantId == null && this.employeeUuid == null && this.plantCode == null );
  	}
      
      public boolean tenantIdOnly() {
  		// TODO Auto-generated method stub
  		 return (this.tenantId != null && this.employeeUuid == null && this.plantCode == null );
  	}

}
