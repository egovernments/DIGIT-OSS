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
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.service.BankAccountService;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankAccountSearchContract;
import org.egov.egf.master.web.requests.BankAccountRequest;
import org.egov.egf.master.web.requests.BankAccountResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bankaccounts")
public class BankAccountController {

	@Autowired
	private BankAccountService bankAccountService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public BankAccountResponse create(@RequestBody BankAccountRequest bankAccountRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		BankAccountResponse bankAccountResponse = new BankAccountResponse();
		bankAccountResponse.setResponseInfo(getResponseInfo(bankAccountRequest.getRequestInfo()));
		List<BankAccount> bankaccounts = new ArrayList<>();
		BankAccount bankAccount;
		List<BankAccountContract> bankAccountContracts = new ArrayList<>();
		BankAccountContract contract;

		bankAccountRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (BankAccountContract bankAccountContract : bankAccountRequest.getBankAccounts()) {
			bankAccount = new BankAccount();
			model.map(bankAccountContract, bankAccount);
			bankAccount.setCreatedDate(new Date());
			bankAccount.setCreatedBy(bankAccountRequest.getRequestInfo().getUserInfo());
			bankAccount.setLastModifiedBy(bankAccountRequest.getRequestInfo().getUserInfo());
			bankaccounts.add(bankAccount);
		}

		bankaccounts = bankAccountService.create(bankaccounts, errors, bankAccountRequest.getRequestInfo());

		for (BankAccount f : bankaccounts) {
			contract = new BankAccountContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			bankAccountContracts.add(contract);
		}

		bankAccountResponse.setBankAccounts(bankAccountContracts);

		return bankAccountResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public BankAccountResponse update(@RequestBody BankAccountRequest bankAccountRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		bankAccountRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		BankAccountResponse bankAccountResponse = new BankAccountResponse();
		List<BankAccount> bankaccounts = new ArrayList<>();
		bankAccountResponse.setResponseInfo(getResponseInfo(bankAccountRequest.getRequestInfo()));
		BankAccount bankAccount;
		BankAccountContract contract;
		List<BankAccountContract> bankAccountContracts = new ArrayList<>();

		for (BankAccountContract bankAccountContract : bankAccountRequest.getBankAccounts()) {
			bankAccount = new BankAccount();
			model.map(bankAccountContract, bankAccount);
			bankAccount.setLastModifiedBy(bankAccountRequest.getRequestInfo().getUserInfo());
			bankAccount.setLastModifiedDate(new Date());
			bankaccounts.add(bankAccount);
		}

		bankaccounts = bankAccountService.update(bankaccounts, errors, bankAccountRequest.getRequestInfo());

		for (BankAccount bankAccountObj : bankaccounts) {
			contract = new BankAccountContract();
			model.map(bankAccountObj, contract);
			bankAccountObj.setLastModifiedDate(new Date());
			bankAccountContracts.add(contract);
		}

		bankAccountResponse.setBankAccounts(bankAccountContracts);

		return bankAccountResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public BankAccountResponse search(@ModelAttribute BankAccountSearchContract bankAccountSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		BankAccountSearch domain = new BankAccountSearch();
		mapper.map(bankAccountSearchContract, domain);
		BankAccountContract contract;
		ModelMapper model = new ModelMapper();
		List<BankAccountContract> bankAccountContracts = new ArrayList<>();
		Pagination<BankAccount> bankaccounts = bankAccountService.search(domain, errors);

		for (BankAccount bankAccount : bankaccounts.getPagedData()) {
			contract = new BankAccountContract();
			model.map(bankAccount, contract);
			bankAccountContracts.add(contract);
		}

		BankAccountResponse response = new BankAccountResponse();
		response.setBankAccounts(bankAccountContracts);
		response.setPage(new PaginationContract(bankaccounts));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}