package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BankRequest implements Serializable {

//	private RequestInfo requestInfo;
	private String tenantId;
	private List<Long> ids;
	private String name;
	private String code;
	private boolean active;

	private Integer offset;
	private Integer pageSize;
	private String sortBy;
	
	public BankRequest(){}

	public BankRequest(/*RequestInfo requestInfo,*/String tenantId, List<Long> ids, String name, String code, boolean active,
			Integer offset, Integer pageSize, String sortBy) {
//		this.requestInfo = requestInfo;
		this.tenantId= tenantId;
		this.ids = ids;
		this.name = name;
		this.code = code;
		this.active = active;
		this.offset = offset;
		this.pageSize = pageSize;
		this.sortBy = sortBy;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

//	public RequestInfo getRequestInfo() {
//		return requestInfo;
//	}
//
//	public void setRequestInfo(RequestInfo requestInfo) {
//		this.requestInfo = requestInfo;
//	}

	public List<Long> getIds() {
		return ids;
	}

	public void setIds(List<Long> ids) {
		this.ids = ids;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Integer getOffset() {
		return offset;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}
	
}
