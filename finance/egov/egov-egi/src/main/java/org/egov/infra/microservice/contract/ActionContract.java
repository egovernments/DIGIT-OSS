package org.egov.infra.microservice.contract;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ActionContract {

	private Long id;
	private String name;
	private String url;
	private String queryParams;
	private String parentModule;
	private String displayName;
	private boolean enabled;
	private Integer orderNumber;
	private String serviceCode;

	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date createdDate;

	private Long createdBy;

	private Date lastModifiedDate;

	private Long lastModifiedBy;
	
	public ActionContract(){}

	public ActionContract(Long id, String name, String url, String queryParams, String parentModule, String displayName,
			boolean enabled, Integer orderNumber, String serviceCode, Date createdDate, Long createdBy,
			Date lastModifiedDate, Long lastModifiedBy) {
		this.id = id;
		this.name = name;
		this.url = url;
		this.queryParams = queryParams;
		this.parentModule = parentModule;
		this.displayName = displayName;
		this.enabled = enabled;
		this.orderNumber = orderNumber;
		this.serviceCode = serviceCode;
		this.createdDate = createdDate;
		this.createdBy = createdBy;
		this.lastModifiedDate = lastModifiedDate;
		this.lastModifiedBy = lastModifiedBy;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Integer getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(Integer orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getServiceCode() {
		return serviceCode;
	}

	public void setServiceCode(String serviceCode) {
		this.serviceCode = serviceCode;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public Date getLastModifiedDate() {
		return lastModifiedDate;
	}

	public void setLastModifiedDate(Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}

	public Long getLastModifiedBy() {
		return lastModifiedBy;
	}

	public void setLastModifiedBy(Long lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}
	
	

}
