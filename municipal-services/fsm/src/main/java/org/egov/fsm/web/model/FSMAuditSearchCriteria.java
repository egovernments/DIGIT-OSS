package org.egov.fsm.web.model;

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
public class FSMAuditSearchCriteria {
    
    @JsonProperty("tenantId")
    private String tenantId;
    
    @JsonProperty("applicationNo")
    private String applicationNo;
    
    @JsonProperty("id")
    private String id;
}
