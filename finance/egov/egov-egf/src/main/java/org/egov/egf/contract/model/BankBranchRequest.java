package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;

public class BankBranchRequest implements Serializable {

	private RequestInfo requestInfo;
	private String tenantId;
	private List<Long> ids;
	private Long bank;
	private String code;
	private Boolean active;
	private Integer offset;
	private Integer pageSize;
	private String sortBy;
	private String name;
	public BankBranchRequest(){}

	public BankBranchRequest(RequestInfo requestInfo, String tenantId, List<Long> ids, Long bank, String code,
			Boolean active, Integer offset, Integer pageSize, String sortBy,String name) {
		this.requestInfo = requestInfo;
		this.tenantId = tenantId;
		this.ids = ids;
		this.bank = bank;
		this.code = code;
		this.active = active;
		this.offset = offset;
		this.pageSize = pageSize;
		this.sortBy = sortBy;
		this.name = name;
	}

	public RequestInfo getRequestInfo() {
		return requestInfo;
	}

	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public List<Long> getIds() {
		return ids;
	}

	public void setIds(List<Long> ids) {
		this.ids = ids;
	}

	public Long getBank() {
		return bank;
	}

	public void setBank(Long bank) {
		this.bank = bank;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
