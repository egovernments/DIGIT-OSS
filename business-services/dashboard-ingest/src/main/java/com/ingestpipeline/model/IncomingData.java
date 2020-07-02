package com.ingestpipeline.model;

public class IncomingData {
	
	private String dataContext; 
	private String dataContextVersion; 
	private Object dataObject;
	
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
	public Object getDataObject() {
		return dataObject;
	}
	public void setDataObject(Object dataObject) {
		this.dataObject = dataObject;
	}
	@Override
	public String toString() {
		return "IncomingData [dataContext=" + dataContext + ", dataContextVersion=" + dataContextVersion
				+ ", dataObject=" + dataObject + "]";
	} 
	
	

}
