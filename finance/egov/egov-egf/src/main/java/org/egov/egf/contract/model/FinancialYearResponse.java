package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FinancialYearResponse implements Serializable {

	
	private ResponseInfo responseInfo;
	private List<FinancialYear> financialYears;
	
	@JsonProperty("page")
	private Pagination page;
	
	public FinancialYearResponse(){}

	public FinancialYearResponse(ResponseInfo responseInfo, List<FinancialYear> financialYears, Pagination page) {
		this.responseInfo = responseInfo;
		this.financialYears = financialYears;
		this.page = page;
	}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<FinancialYear> getFinancialYears() {
		return financialYears;
	}

	public void setFinancialYears(List<FinancialYear> financialYears) {
		this.financialYears = financialYears;
	}

	public Pagination getPage() {
		return page;
	}

	public void setPage(Pagination page) {
		this.page = page;
	}
	
	
}
