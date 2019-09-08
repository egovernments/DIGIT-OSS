package org.egov.egf.master.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.domain.service.BankBranchService;
import org.egov.egf.master.web.contract.BankBranchContract;
import org.egov.egf.master.web.contract.BankBranchSearchContract;
import org.egov.egf.master.web.requests.BankBranchRequest;
import org.egov.egf.master.web.requests.BankBranchResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bankbranches")
public class BankBranchController {

	@Autowired
	private BankBranchService bankBranchService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public BankBranchResponse create(@RequestBody BankBranchRequest bankBranchRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		BankBranchResponse bankBranchResponse = new BankBranchResponse();
		bankBranchResponse.setResponseInfo(getResponseInfo(bankBranchRequest.getRequestInfo()));
		List<BankBranch> bankbranches = new ArrayList<>();
		BankBranch bankBranch;
		List<BankBranchContract> bankBranchContracts = new ArrayList<>();
		BankBranchContract contract;

		bankBranchRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (BankBranchContract bankBranchContract : bankBranchRequest.getBankBranches()) {
			bankBranch = new BankBranch();
			model.map(bankBranchContract, bankBranch);
			bankBranch.setCreatedDate(new Date());
			bankBranch.setCreatedBy(bankBranchRequest.getRequestInfo().getUserInfo());
			bankBranch.setLastModifiedBy(bankBranchRequest.getRequestInfo().getUserInfo());
			bankbranches.add(bankBranch);
		}

		bankbranches = bankBranchService.create(bankbranches, errors, bankBranchRequest.getRequestInfo());

		for (BankBranch f : bankbranches) {
			contract = new BankBranchContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			bankBranchContracts.add(contract);
		}

		bankBranchResponse.setBankBranches(bankBranchContracts);

		return bankBranchResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public BankBranchResponse update(@RequestBody BankBranchRequest bankBranchRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		bankBranchRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		BankBranchResponse bankBranchResponse = new BankBranchResponse();
		List<BankBranch> bankbranches = new ArrayList<>();
		bankBranchResponse.setResponseInfo(getResponseInfo(bankBranchRequest.getRequestInfo()));
		BankBranch bankBranch;
		BankBranchContract contract;
		List<BankBranchContract> bankBranchContracts = new ArrayList<>();

		for (BankBranchContract bankBranchContract : bankBranchRequest.getBankBranches()) {
			bankBranch = new BankBranch();
			model.map(bankBranchContract, bankBranch);
			bankBranch.setLastModifiedBy(bankBranchRequest.getRequestInfo().getUserInfo());
			bankBranch.setLastModifiedDate(new Date());
			bankbranches.add(bankBranch);
		}

		bankbranches = bankBranchService.update(bankbranches, errors, bankBranchRequest.getRequestInfo());

		for (BankBranch bankBranchObj : bankbranches) {
			contract = new BankBranchContract();
			model.map(bankBranchObj, contract);
			bankBranchObj.setLastModifiedDate(new Date());
			bankBranchContracts.add(contract);
		}

		bankBranchResponse.setBankBranches(bankBranchContracts);

		return bankBranchResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public BankBranchResponse search(@ModelAttribute BankBranchSearchContract bankBranchSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		BankBranchSearch domain = new BankBranchSearch();
		mapper.map(bankBranchSearchContract, domain);
		BankBranchContract contract;
		ModelMapper model = new ModelMapper();
		List<BankBranchContract> bankBranchContracts = new ArrayList<>();
		Pagination<BankBranch> bankbranches = bankBranchService.search(domain, errors);

		for (BankBranch bankBranch : bankbranches.getPagedData()) {
			contract = new BankBranchContract();
			model.map(bankBranch, contract);
			bankBranchContracts.add(contract);
		}

		BankBranchResponse response = new BankBranchResponse();
		response.setBankBranches(bankBranchContracts);
		response.setPage(new PaginationContract(bankbranches));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}