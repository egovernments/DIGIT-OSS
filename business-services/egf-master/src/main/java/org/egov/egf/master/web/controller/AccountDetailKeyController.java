package org.egov.egf.master.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.service.AccountDetailKeyService;
import org.egov.egf.master.web.contract.AccountDetailKeyContract;
import org.egov.egf.master.web.contract.AccountDetailKeySearchContract;
import org.egov.egf.master.web.requests.AccountDetailKeyRequest;
import org.egov.egf.master.web.requests.AccountDetailKeyResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accountdetailkeys")
public class AccountDetailKeyController {

	@Autowired
	private AccountDetailKeyService accountDetailKeyService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountDetailKeyResponse create(@RequestBody AccountDetailKeyRequest accountDetailKeyRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		AccountDetailKeyResponse accountDetailKeyResponse = new AccountDetailKeyResponse();
		accountDetailKeyResponse.setResponseInfo(getResponseInfo(accountDetailKeyRequest.getRequestInfo()));
		List<AccountDetailKey> accountdetailkeys = new ArrayList<>();
		AccountDetailKey accountDetailKey;
		List<AccountDetailKeyContract> accountDetailKeyContracts = new ArrayList<>();
		AccountDetailKeyContract contract;

		accountDetailKeyRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (AccountDetailKeyContract accountDetailKeyContract : accountDetailKeyRequest.getAccountDetailKeys()) {
			accountDetailKey = new AccountDetailKey();
			model.map(accountDetailKeyContract, accountDetailKey);
			accountDetailKey.setCreatedDate(new Date());
			accountDetailKey.setCreatedBy(accountDetailKeyRequest.getRequestInfo().getUserInfo());
			accountDetailKey.setLastModifiedBy(accountDetailKeyRequest.getRequestInfo().getUserInfo());
			accountdetailkeys.add(accountDetailKey);
		}

		accountdetailkeys = accountDetailKeyService.create(accountdetailkeys, errors,
				accountDetailKeyRequest.getRequestInfo());

		for (AccountDetailKey f : accountdetailkeys) {
			contract = new AccountDetailKeyContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			accountDetailKeyContracts.add(contract);
		}

		accountDetailKeyResponse.setAccountDetailKeys(accountDetailKeyContracts);

		return accountDetailKeyResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountDetailKeyResponse update(@RequestBody AccountDetailKeyRequest accountDetailKeyRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		accountDetailKeyRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		AccountDetailKeyResponse accountDetailKeyResponse = new AccountDetailKeyResponse();
		List<AccountDetailKey> accountdetailkeys = new ArrayList<>();
		accountDetailKeyResponse.setResponseInfo(getResponseInfo(accountDetailKeyRequest.getRequestInfo()));
		AccountDetailKey accountDetailKey;
		AccountDetailKeyContract contract;
		List<AccountDetailKeyContract> accountDetailKeyContracts = new ArrayList<>();

		for (AccountDetailKeyContract accountDetailKeyContract : accountDetailKeyRequest.getAccountDetailKeys()) {
			accountDetailKey = new AccountDetailKey();
			model.map(accountDetailKeyContract, accountDetailKey);
			accountDetailKey.setLastModifiedBy(accountDetailKeyRequest.getRequestInfo().getUserInfo());
			accountDetailKey.setLastModifiedDate(new Date());
			accountdetailkeys.add(accountDetailKey);
		}

		accountdetailkeys = accountDetailKeyService.update(accountdetailkeys, errors,
				accountDetailKeyRequest.getRequestInfo());

		for (AccountDetailKey accountDetailKeyObj : accountdetailkeys) {
			contract = new AccountDetailKeyContract();
			model.map(accountDetailKeyObj, contract);
			accountDetailKeyObj.setLastModifiedDate(new Date());
			accountDetailKeyContracts.add(contract);
		}

		accountDetailKeyResponse.setAccountDetailKeys(accountDetailKeyContracts);

		return accountDetailKeyResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public AccountDetailKeyResponse search(
			@ModelAttribute AccountDetailKeySearchContract accountDetailKeySearchContract, @RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailKeySearch domain = new AccountDetailKeySearch();
		mapper.map(accountDetailKeySearchContract, domain);
		AccountDetailKeyContract contract;
		ModelMapper model = new ModelMapper();
		List<AccountDetailKeyContract> accountDetailKeyContracts = new ArrayList<>();
		Pagination<AccountDetailKey> accountdetailkeys = accountDetailKeyService.search(domain, errors);

		for (AccountDetailKey accountDetailKey : accountdetailkeys.getPagedData()) {
			contract = new AccountDetailKeyContract();
			model.map(accountDetailKey, contract);
			accountDetailKeyContracts.add(contract);
		}

		AccountDetailKeyResponse response = new AccountDetailKeyResponse();
		response.setAccountDetailKeys(accountDetailKeyContracts);
		response.setPage(new PaginationContract(accountdetailkeys));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}