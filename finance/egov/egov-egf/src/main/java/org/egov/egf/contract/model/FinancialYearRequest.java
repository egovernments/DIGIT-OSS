package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialYearRequest implements Serializable {

	private static final long serialVersionUID = 2769951203281774986L;

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
	private String teanantId;
	private List<Integer> ids;
	private String finYearRange;
	private Date startingDate;
	private Date endingDate;
	private boolean active;
	private boolean isActiveForPosting;
	
	private Integer pageSize;
	private Integer offset;
	private String sortBy;
	
	public FinancialYearRequest(){}
	
	public RequestInfo getRequestInfo() {
		return requestInfo;
	}
	public void setRequestInfo(RequestInfo requestInfo) {
		this.requestInfo = requestInfo;
	}
	public String getTeanantId() {
		return teanantId;
	}
	public void setTeanantId(String teanantId) {
		this.teanantId = teanantId;
	}
	public List<Integer> getIds() {
		return ids;
	}
	public void setIds(List<Integer> ids) {
		this.ids = ids;
	}
	public String getFinYearRange() {
		return finYearRange;
	}
	public void setFinYearRange(String finYearRange) {
		this.finYearRange = finYearRange;
	}
	public Date getStartingDate() {
		return startingDate;
	}
	public void setStartingDate(Date startingDate) {
		this.startingDate = startingDate;
	}
	public Date getEndingDate() {
		return endingDate;
	}
	public void setEndingDate(Date endingDate) {
		this.endingDate = endingDate;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean active) {
		this.active = active;
	}
	public boolean isActiveForPosting() {
		return isActiveForPosting;
	}
	public void setActiveForPosting(boolean isActiveForPosting) {
		this.isActiveForPosting = isActiveForPosting;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	public Integer getOffset() {
		return offset;
	}
	public void setOffset(Integer offset) {
		this.offset = offset;
	}
	public String getSortBy() {
		return sortBy;
	}
	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}
	
	
}
