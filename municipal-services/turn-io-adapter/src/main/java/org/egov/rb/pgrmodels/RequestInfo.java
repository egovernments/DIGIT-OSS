package org.egov.rb.pgrmodels;

import org.springframework.beans.factory.annotation.Value;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestInfo {

	
	private String apiId;
	
	private String version;
	
	private String ts;
	
	private String action;
	
	private String did;
	
	private String key;
	
	private String msgId;
	
	private String authToken;
	
}
