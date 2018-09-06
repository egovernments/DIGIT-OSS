package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;
import org.egov.egf.contract.model.Fund;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FundResponse implements Serializable {
	
	private static final long serialVersionUID = 4761819053048352702L;
	
	private ResponseInfo responseInfo;
	private List<Fund> funds;
	@JsonProperty("page")
	private Pagination page;
	
	public FundResponse(){};
	
	public FundResponse(ResponseInfo responseInfo, List<Fund> funds, Pagination page) {
		this.responseInfo = responseInfo;
		this.funds = funds;
		this.page = page;
	}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}
	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}
	public List<Fund> getFunds() {
		return funds;
	}
	public void setFunds(List<Fund> funds) {
		this.funds = funds;
	}
	public Pagination getPage() {
		return page;
	}
	public void setPage(Pagination page) {
		this.page = page;
	}
	

}
