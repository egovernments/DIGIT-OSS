package com.ingestpipeline.util;

import org.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "dataContext", "dataContextVersion", "dataObject"})
public class JSONUtils {
	 public JSONObject JSONWrapper(JSONObject json) {
	      JSONObject obj = new JSONObject();
	      obj.put("dataContext", "target");
	      obj.put("dataContextVersion", "v1");
	      obj.put("dataObject", json);
	      return obj;
	   }
	
}
