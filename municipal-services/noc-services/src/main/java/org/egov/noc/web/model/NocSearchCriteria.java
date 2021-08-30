package org.egov.noc.web.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NocSearchCriteria {

	    @NotNull
	    @JsonProperty("tenantId")
	    private String tenantId;

	    @JsonProperty("ids")
	    private List<String> ids;

	    @JsonProperty("applicationNo")
	    private String applicationNo;
	    	
	    @JsonProperty("nocNo")
	    private String nocNo;
	    
	    @JsonProperty("source")
	    private String source;
	    
	    @JsonProperty("nocType")
	    private String nocType;
	    
	    @JsonProperty("sourceRefId")
	    private String sourceRefId;
	    
	    @JsonProperty("offset")
	    private Integer offset;

	    @JsonProperty("limit")
	    private Integer limit; 
	    
	    @JsonIgnore
	    private List<String> ownerIds;

	    @JsonProperty("accountId")
	    private List<String> accountId; 

	    public boolean isEmpty() {
	        return (this.tenantId == null && this.ids == null && this.applicationNo == null
	                && this.nocNo == null && this.accountId == null	                
	        );
	    }

	    public boolean tenantIdOnly() {
	        return (this.tenantId == null && this.ids == null && this.applicationNo == null
	                && this.nocNo == null && this.accountId == null  
	        );
	    }
}
