package org.egov.inbox.web.model;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InboxResponse {

	
    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo = null;

 
    @JsonProperty("totalCount")
    private Integer totalCount =null;
    
    @JsonProperty("nearingSlaCount")
    private Integer nearingSlaCount =null;
    
    @JsonProperty("statusMap")
    private List<HashMap<String,Object>> statusMap = null;
    
    @JsonProperty("items")
	private List<Inbox> items = null;
}

