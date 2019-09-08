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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.domain.service.AccountDetailTypeService;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.AccountDetailTypeSearchContract;
import org.egov.egf.master.web.requests.AccountDetailTypeRequest;
import org.egov.egf.master.web.requests.AccountDetailTypeResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accountdetailtypes")
public class AccountDetailTypeController {

	@Autowired
	private AccountDetailTypeService accountDetailTypeService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountDetailTypeResponse create(@RequestBody AccountDetailTypeRequest accountDetailTypeRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		AccountDetailTypeResponse accountDetailTypeResponse = new AccountDetailTypeResponse();
		accountDetailTypeResponse.setResponseInfo(getResponseInfo(accountDetailTypeRequest.getRequestInfo()));
		List<AccountDetailType> accountdetailtypes = new ArrayList<>();
		AccountDetailType accountDetailType;
		List<AccountDetailTypeContract> accountDetailTypeContracts = new ArrayList<>();
		AccountDetailTypeContract contract;

		accountDetailTypeRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (AccountDetailTypeContract accountDetailTypeContract : accountDetailTypeRequest.getAccountDetailTypes()) {
			accountDetailType = new AccountDetailType();
			model.map(accountDetailTypeContract, accountDetailType);
			accountDetailType.setCreatedDate(new Date());
			accountDetailType.setCreatedBy(accountDetailTypeRequest.getRequestInfo().getUserInfo());
			accountDetailType.setLastModifiedBy(accountDetailTypeRequest.getRequestInfo().getUserInfo());
			accountdetailtypes.add(accountDetailType);
		}

		accountdetailtypes = accountDetailTypeService.create(accountdetailtypes, errors,
				accountDetailTypeRequest.getRequestInfo());

		for (AccountDetailType f : accountdetailtypes) {
			contract = new AccountDetailTypeContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			accountDetailTypeContracts.add(contract);
		}

		accountDetailTypeResponse.setAccountDetailTypes(accountDetailTypeContracts);

		return accountDetailTypeResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public AccountDetailTypeResponse update(@RequestBody AccountDetailTypeRequest accountDetailTypeRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		accountDetailTypeRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		AccountDetailTypeResponse accountDetailTypeResponse = new AccountDetailTypeResponse();
		List<AccountDetailType> accountdetailtypes = new ArrayList<>();
		accountDetailTypeResponse.setResponseInfo(getResponseInfo(accountDetailTypeRequest.getRequestInfo()));
		AccountDetailType accountDetailType;
		AccountDetailTypeContract contract;
		List<AccountDetailTypeContract> accountDetailTypeContracts = new ArrayList<>();

		for (AccountDetailTypeContract accountDetailTypeContract : accountDetailTypeRequest.getAccountDetailTypes()) {
			accountDetailType = new AccountDetailType();
			model.map(accountDetailTypeContract, accountDetailType);
			accountDetailType.setLastModifiedBy(accountDetailTypeRequest.getRequestInfo().getUserInfo());
			accountDetailType.setLastModifiedDate(new Date());
			accountdetailtypes.add(accountDetailType);
		}

		accountdetailtypes = accountDetailTypeService.update(accountdetailtypes, errors,
				accountDetailTypeRequest.getRequestInfo());

		for (AccountDetailType accountDetailTypeObj : accountdetailtypes) {
			contract = new AccountDetailTypeContract();
			model.map(accountDetailTypeObj, contract);
			accountDetailTypeObj.setLastModifiedDate(new Date());
			accountDetailTypeContracts.add(contract);
		}

		accountDetailTypeResponse.setAccountDetailTypes(accountDetailTypeContracts);

		return accountDetailTypeResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public AccountDetailTypeResponse search(
			@ModelAttribute AccountDetailTypeSearchContract accountDetailTypeSearchContract,@RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailTypeSearch domain = new AccountDetailTypeSearch();
		mapper.map(accountDetailTypeSearchContract, domain);
		AccountDetailTypeContract contract;
		ModelMapper model = new ModelMapper();
		List<AccountDetailTypeContract> accountDetailTypeContracts = new ArrayList<>();
		Pagination<AccountDetailType> accountdetailtypes = accountDetailTypeService.search(domain, errors);

		for (AccountDetailType accountDetailType : accountdetailtypes.getPagedData()) {
			contract = new AccountDetailTypeContract();
			model.map(accountDetailType, contract);
			accountDetailTypeContracts.add(contract);
		}

		AccountDetailTypeResponse response = new AccountDetailTypeResponse();
		response.setAccountDetailTypes(accountDetailTypeContracts);
		response.setPage(new PaginationContract(accountdetailtypes));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}