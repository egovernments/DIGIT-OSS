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
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.service.AccountCodePurposeService;
import org.egov.egf.master.web.contract.AccountCodePurposeContract;
import org.egov.egf.master.web.contract.AccountCodePurposeSearchContract;
import org.egov.egf.master.web.requests.AccountCodePurposeRequest;
import org.egov.egf.master.web.requests.AccountCodePurposeResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accountcodepurposes")
public class AccountCodePurposeController {

	@Autowired
	private AccountCodePurposeService accountCodePurposeService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountCodePurposeResponse create(@RequestBody AccountCodePurposeRequest accountCodePurposeRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		AccountCodePurposeResponse accountCodePurposeResponse = new AccountCodePurposeResponse();
		accountCodePurposeResponse.setResponseInfo(getResponseInfo(accountCodePurposeRequest.getRequestInfo()));
		List<AccountCodePurpose> accountcodepurposes = new ArrayList<>();
		AccountCodePurpose accountCodePurpose;
		List<AccountCodePurposeContract> accountCodePurposeContracts = new ArrayList<>();
		AccountCodePurposeContract contract;

		accountCodePurposeRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (AccountCodePurposeContract accountCodePurposeContract : accountCodePurposeRequest
				.getAccountCodePurposes()) {
			accountCodePurpose = new AccountCodePurpose();
			model.map(accountCodePurposeContract, accountCodePurpose);
			accountCodePurpose.setCreatedDate(new Date());
			accountCodePurpose.setCreatedBy(accountCodePurposeRequest.getRequestInfo().getUserInfo());
			accountCodePurpose.setLastModifiedBy(accountCodePurposeRequest.getRequestInfo().getUserInfo());
			accountcodepurposes.add(accountCodePurpose);
		}

		accountcodepurposes = accountCodePurposeService.create(accountcodepurposes, errors,
				accountCodePurposeRequest.getRequestInfo());

		for (AccountCodePurpose f : accountcodepurposes) {
			contract = new AccountCodePurposeContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			accountCodePurposeContracts.add(contract);
		}

		accountCodePurposeResponse.setAccountCodePurposes(accountCodePurposeContracts);

		return accountCodePurposeResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountCodePurposeResponse update(@RequestBody AccountCodePurposeRequest accountCodePurposeRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		accountCodePurposeRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		AccountCodePurposeResponse accountCodePurposeResponse = new AccountCodePurposeResponse();
		List<AccountCodePurpose> accountcodepurposes = new ArrayList<>();
		accountCodePurposeResponse.setResponseInfo(getResponseInfo(accountCodePurposeRequest.getRequestInfo()));
		AccountCodePurpose accountCodePurpose;
		AccountCodePurposeContract contract;
		List<AccountCodePurposeContract> accountCodePurposeContracts = new ArrayList<>();

		for (AccountCodePurposeContract accountCodePurposeContract : accountCodePurposeRequest
				.getAccountCodePurposes()) {
			accountCodePurpose = new AccountCodePurpose();
			model.map(accountCodePurposeContract, accountCodePurpose);
			accountCodePurpose.setLastModifiedBy(accountCodePurposeRequest.getRequestInfo().getUserInfo());
			accountCodePurpose.setLastModifiedDate(new Date());
			accountcodepurposes.add(accountCodePurpose);
		}

		accountcodepurposes = accountCodePurposeService.update(accountcodepurposes, errors,
				accountCodePurposeRequest.getRequestInfo());

		for (AccountCodePurpose accountCodePurposeObj : accountcodepurposes) {
			contract = new AccountCodePurposeContract();
			model.map(accountCodePurposeObj, contract);
			accountCodePurposeObj.setLastModifiedDate(new Date());
			accountCodePurposeContracts.add(contract);
		}

		accountCodePurposeResponse.setAccountCodePurposes(accountCodePurposeContracts);

		return accountCodePurposeResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public AccountCodePurposeResponse search(
			@ModelAttribute AccountCodePurposeSearchContract accountCodePurposeSearchContract, @RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		AccountCodePurposeSearch domain = new AccountCodePurposeSearch();
		mapper.map(accountCodePurposeSearchContract, domain);
		AccountCodePurposeContract contract;
		ModelMapper model = new ModelMapper();
		List<AccountCodePurposeContract> accountCodePurposeContracts = new ArrayList<>();
		Pagination<AccountCodePurpose> accountcodepurposes = accountCodePurposeService.search(domain, errors);

		for (AccountCodePurpose accountCodePurpose : accountcodepurposes.getPagedData()) {
			contract = new AccountCodePurposeContract();
			model.map(accountCodePurpose, contract);
			accountCodePurposeContracts.add(contract);
		}

		AccountCodePurposeResponse response = new AccountCodePurposeResponse();
		response.setAccountCodePurposes(accountCodePurposeContracts);
		response.setPage(new PaginationContract(accountcodepurposes));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}