package org.egov.infra.indexer.models;

import org.egov.infra.indexer.web.contract.Mapping.ConfigKeyEnum;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class IndexJob {
	
	public String jobId;
	
	public String requesterId;
	
	public ConfigKeyEnum typeOfJob;
	
	public String oldIndex;
	
	public String newIndex;
	
	public StatusEnum jobStatus;
	
	public Long totalTimeTakenInMS;
	
	public Integer recordsToBeIndexed;
	
	public Integer totalRecordsIndexed;

	
	public enum StatusEnum {
		  
			INPROGRESS("INPROGRESS"),
			
			COMPLETED("COMPLETED"),
			        
		    FAILED("FAILED");   

		    private String value;

		    StatusEnum(String value) {
		      this.value = value;
		    }

		    @Override
		    @JsonValue
		    public String toString() {
		      return String.valueOf(value);
		    }

		    @JsonCreator
		    public static StatusEnum fromValue(String text) {
		      for (StatusEnum b : StatusEnum.values()) {
		        if (String.valueOf(b.value).equalsIgnoreCase(text)) {
		          return b;
		        }
		      }
		      return null;
		    }
		  }
	
	public String tenantId;
	
	public AuditDetails auditDetails;

}
