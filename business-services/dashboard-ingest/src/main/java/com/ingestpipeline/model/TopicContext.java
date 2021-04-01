package com.ingestpipeline.model;

public class TopicContext {
	
	private String topic; 
	private String dataContext; 
	private String dataContextVersion;
	public String getTopic() {
		return topic;
	}
	public void setTopic(String topic) {
		this.topic = topic;
	}
	public String getDataContext() {
		return dataContext;
	}
	public void setDataContext(String dataContext) {
		this.dataContext = dataContext;
	}
	public String getDataContextVersion() {
		return dataContextVersion;
	}
	public void setDataContextVersion(String dataContextVersion) {
		this.dataContextVersion = dataContextVersion;
	} 
}
