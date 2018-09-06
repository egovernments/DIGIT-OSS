package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class BankResponse implements Serializable {

	private ResponseInfo responseInfo;
	private List<Bank> banks;
	private Pagination page;
	
	public BankResponse(){}

	public BankResponse(ResponseInfo responseInfo, List<Bank> banks, Pagination page) {
		this.responseInfo = responseInfo;
		this.banks = banks;
		this.page = page;
	}

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<Bank> getBanks() {
		return banks;
	}

	public void setBanks(List<Bank> banks) {
		this.banks = banks;
	}

	public Pagination getPage() {
		return page;
	}

	public void setPage(Pagination page) {
		this.page = page;
	}
	
}
