package org.egov.inbox.web.model;

import java.util.HashMap;
import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import org.egov.inbox.web.model.workflow.ProcessInstanceSearchCriteria;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
public class InboxSearchCriteria {


    @NotNull
    @JsonProperty("tenantId")
    private String tenantId;
    
    @JsonProperty("processSearchCriteria")
    private ProcessInstanceSearchCriteria processSearchCriteria;
    
    @JsonProperty("moduleSearchCriteria")
    private HashMap<String,Object> moduleSearchCriteria;
    
    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    @Max(value = 300)
    private Integer limit;
}
