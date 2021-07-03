package org.egov.egf.web.controller.microservice;

import org.egov.commons.Accountdetailkey;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.service.AccountDetailKeyService;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.egf.web.controller.microservice.entity.AccountDetailKeyContractRequest;
import org.egov.egf.web.controller.microservice.entity.AccountDetailKeyContractResponse;
import org.egov.egf.web.controller.microservice.entity.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountDetailKeyController {

	@Autowired
	private AccountDetailKeyService accountDetailKeyservice;

	@Autowired
	private AccountdetailtypeService accountDetailtypeservice;

	@PostMapping(value = "/rest/accountdetailkey/_create")
	public AccountDetailKeyContractResponse create(@RequestBody AccountDetailKeyContractRequest request) {
		Accountdetailkey accoundDetailKey = new Accountdetailkey();
		accoundDetailKey.setDetailname(request.getAccountDetailKey().getKeyName());
		Accountdetailtype accountDetailsType = accountDetailtypeservice.findByName("EMPLOYEE");
		accoundDetailKey.setAccountdetailtype(accountDetailsType);
		accoundDetailKey.setGroupid(1);
		accoundDetailKey.setDetailkey(Integer.valueOf(request.getAccountDetailKey().getKeyId()));
		accountDetailKeyservice.create(accoundDetailKey);
		AccountDetailKeyContractResponse accountDetailresponse = new AccountDetailKeyContractResponse();
		ResponseInfo response = new ResponseInfo();
		response.setStatus("success");
		accountDetailresponse.setResponseInfo(response);
		accountDetailresponse.setAccountDetailKey(request.getAccountDetailKey());
		return accountDetailresponse;

	}
}
