package org.egov.inbox.web.model;

import java.util.HashMap;
import java.util.Map;

import org.egov.inbox.web.model.workflow.ProcessInstance;
import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.JsonObject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Inbox {

	@JsonProperty("ProcessInstance")
	private ProcessInstance ProcessInstance;
	
	@JsonProperty("businessObject")
	private Map<String,Object>	businessObject;
}
