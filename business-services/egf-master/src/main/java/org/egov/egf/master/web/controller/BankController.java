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
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.domain.service.BankService;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.BankSearchContract;
import org.egov.egf.master.web.requests.BankRequest;
import org.egov.egf.master.web.requests.BankResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/banks")
public class BankController {

	@Autowired
	private BankService bankService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public BankResponse create(@RequestBody BankRequest bankRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		BankResponse bankResponse = new BankResponse();
		bankResponse.setResponseInfo(getResponseInfo(bankRequest.getRequestInfo()));
		List<Bank> banks = new ArrayList<>();
		Bank bank;
		List<BankContract> bankContracts = new ArrayList<>();
		BankContract contract;

		bankRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (BankContract bankContract : bankRequest.getBanks()) {
			bank = new Bank();
			model.map(bankContract, bank);
			bank.setCreatedDate(new Date());
			bank.setCreatedBy(bankRequest.getRequestInfo().getUserInfo());
			bank.setLastModifiedBy(bankRequest.getRequestInfo().getUserInfo());
			banks.add(bank);
		}

		banks = bankService.create(banks, errors, bankRequest.getRequestInfo());

		for (Bank f : banks) {
			contract = new BankContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			bankContracts.add(contract);
		}

		bankResponse.setBanks(bankContracts);

		return bankResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public BankResponse update(@RequestBody BankRequest bankRequest, BindingResult errors,@RequestParam String tenantId) {


		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		bankRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		BankResponse bankResponse = new BankResponse();
		List<Bank> banks = new ArrayList<>();
		bankResponse.setResponseInfo(getResponseInfo(bankRequest.getRequestInfo()));
		Bank bank;
		BankContract contract;
		List<BankContract> bankContracts = new ArrayList<>();

		for (BankContract bankContract : bankRequest.getBanks()) {
			bank = new Bank();
			model.map(bankContract, bank);
			bank.setLastModifiedBy(bankRequest.getRequestInfo().getUserInfo());
			bank.setLastModifiedDate(new Date());
			banks.add(bank);
		}

		banks = bankService.update(banks, errors, bankRequest.getRequestInfo());

		for (Bank bankObj : banks) {
			contract = new BankContract();
			model.map(bankObj, contract);
			bankObj.setLastModifiedDate(new Date());
			bankContracts.add(contract);
		}

		bankResponse.setBanks(bankContracts);

		return bankResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public BankResponse search(@ModelAttribute BankSearchContract bankSearchContract, @RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		BankSearch domain = new BankSearch();
		mapper.map(bankSearchContract, domain);
		BankContract contract;
		ModelMapper model = new ModelMapper();
		List<BankContract> bankContracts = new ArrayList<>();
		Pagination<Bank> banks = bankService.search(domain, errors);

		for (Bank bank : banks.getPagedData()) {
			contract = new BankContract();
			model.map(bank, contract);
			bankContracts.add(contract);
		}

		BankResponse response = new BankResponse();
		response.setBanks(bankContracts);
		response.setPage(new PaginationContract(banks));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}