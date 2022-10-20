package org.egov.user.avm.developer.entity;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Developerdetail {
	
	private float version;
	
	@JsonProperty
	private DevDetail devDetail;
	
	
	
	
	
	/*
	 * public void setJsonData(String jsonData) { // Method parameter jsonData is
	 * simply ignored try { this.jsonData = new
	 * ObjectMapper().writeValueAsString(this); } catch (JsonProcessingException e)
	 * { log.error(e.getMessage()); } }
	 */
	
	

}
