package org.egov.infra.admin.master.entity;

import java.io.Serializable;

public class ActionT implements Serializable{
	
	private String name;
	private String url;
	private String displayName;
	private Integer orderNumber;
	private String queryParams;
	private String parentModule;
	private String serviceCode;
	
	public ActionT(String name, String url, String displayName, Integer orderNumber, String queryParams,
			String parentModule, String serviceCode) {
		super();
		this.name = name;
		this.url = url;
		this.displayName = displayName;
		this.orderNumber = orderNumber;
		this.queryParams = queryParams;
		this.parentModule = parentModule;
		this.serviceCode = serviceCode;
	}
	
	public ActionT() {};
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public Integer getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}
	public String getQueryParams() {
		return queryParams;
	}
	public void setQueryParams(String queryParams) {
		this.queryParams = queryParams;
	}
	public String getParentModule() {
		return parentModule;
	}
	public void setParentModule(String parentModule) {
		this.parentModule = parentModule;
	}
	public String getServiceCode() {
		return serviceCode;
	}
	public void setServiceCode(String serviceCode) {
		this.serviceCode = serviceCode;
	}


}
