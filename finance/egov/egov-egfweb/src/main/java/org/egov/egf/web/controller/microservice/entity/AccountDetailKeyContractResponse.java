package org.egov.egf.web.controller.microservice.entity;

public class AccountDetailKeyContractResponse {

	private ResponseInfo responseInfo;

	private AccountDetailKeyContract accountDetailKey = new AccountDetailKeyContract();

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public AccountDetailKeyContract getAccountDetailKey() {
		return accountDetailKey;
	}

	public void setAccountDetailKey(AccountDetailKeyContract accountDetailKey) {
		this.accountDetailKey = accountDetailKey;
	}

}