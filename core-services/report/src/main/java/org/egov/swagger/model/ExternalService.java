package org.egov.swagger.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalService {
    
	@JsonProperty("entity")
	public String entity;
	
	@JsonProperty("apiURL")
	public String apiURL;
	
	@JsonProperty("keyOrder")
	public String keyOrder;
	
	@JsonProperty("tableName")
	public String tableName;
	
	@JsonProperty("stateData")
	public Boolean stateData = false;
	
	@JsonProperty("postObject")
	public String postObject;
	
	@JsonProperty("criteria")
	public String criteria;
	
	public String getCriteria() {
		return criteria;
	}
	public void setCriteria(String criteria) {
		this.criteria = criteria;
	}
	public String getPostObject() {
		return postObject;
	}
	public void setPostObject(String postObject) {
		this.postObject = postObject;
	}
	public Boolean getStateData() {
		return stateData;
	}
	public void setStateData(Boolean stateData) {
		this.stateData = stateData;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getKeyOrder() {
		return keyOrder;
	}
	public void setKeyOrder(String keyOrder) {
		this.keyOrder = keyOrder;
	}
	public String getEntity() {
		return entity;
	}
	public void setEntity(String entity) {
		this.entity = entity;
	}
	public String getApiURL() {
		return apiURL;
	}
	public void setApiURL(String apiURL) {
		this.apiURL = apiURL;
	}
	
	
	
}
