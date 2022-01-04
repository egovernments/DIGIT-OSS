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
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.service.ChartOfAccountService;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.contract.ChartOfAccountSearchContract;
import org.egov.egf.master.web.requests.ChartOfAccountRequest;
import org.egov.egf.master.web.requests.ChartOfAccountResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chartofaccounts")
public class ChartOfAccountController {

	@Autowired
	private ChartOfAccountService chartOfAccountService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public ChartOfAccountResponse create(@RequestBody ChartOfAccountRequest chartOfAccountRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		ChartOfAccountResponse chartOfAccountResponse = new ChartOfAccountResponse();
		chartOfAccountResponse.setResponseInfo(getResponseInfo(chartOfAccountRequest.getRequestInfo()));
		List<ChartOfAccount> chartofaccounts = new ArrayList<>();
		ChartOfAccount chartOfAccount;
		List<ChartOfAccountContract> chartOfAccountContracts = new ArrayList<>();
		ChartOfAccountContract contract;

		chartOfAccountRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (ChartOfAccountContract chartOfAccountContract : chartOfAccountRequest.getChartOfAccounts()) {
			chartOfAccount = new ChartOfAccount();
			model.map(chartOfAccountContract, chartOfAccount);
			chartOfAccount.setCreatedDate(new Date());
			chartOfAccount.setCreatedBy(chartOfAccountRequest.getRequestInfo().getUserInfo());
			chartOfAccount.setLastModifiedBy(chartOfAccountRequest.getRequestInfo().getUserInfo());
			chartofaccounts.add(chartOfAccount);
		}

		chartofaccounts = chartOfAccountService.add(chartofaccounts, errors);

		for (ChartOfAccount f : chartofaccounts) {
			contract = new ChartOfAccountContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			chartOfAccountContracts.add(contract);
		}

		chartOfAccountRequest.setChartOfAccounts(chartOfAccountContracts);
		chartOfAccountService.addToQue(chartOfAccountRequest);
		chartOfAccountResponse.setChartOfAccounts(chartOfAccountContracts);

		return chartOfAccountResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public ChartOfAccountResponse update(@RequestBody ChartOfAccountRequest chartOfAccountRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		chartOfAccountRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		ChartOfAccountResponse chartOfAccountResponse = new ChartOfAccountResponse();
		List<ChartOfAccount> chartofaccounts = new ArrayList<>();
		chartOfAccountResponse.setResponseInfo(getResponseInfo(chartOfAccountRequest.getRequestInfo()));
		ChartOfAccount chartOfAccount;
		ChartOfAccountContract contract;
		List<ChartOfAccountContract> chartOfAccountContracts = new ArrayList<>();

		for (ChartOfAccountContract chartOfAccountContract : chartOfAccountRequest.getChartOfAccounts()) {
			chartOfAccount = new ChartOfAccount();
			model.map(chartOfAccountContract, chartOfAccount);
			chartOfAccount.setLastModifiedBy(chartOfAccountRequest.getRequestInfo().getUserInfo());
			chartOfAccount.setLastModifiedDate(new Date());
			chartofaccounts.add(chartOfAccount);
		}

		chartofaccounts = chartOfAccountService.update(chartofaccounts, errors);

		for (ChartOfAccount chartOfAccountObj : chartofaccounts) {
			contract = new ChartOfAccountContract();
			model.map(chartOfAccountObj, contract);
			chartOfAccountObj.setLastModifiedDate(new Date());
			chartOfAccountContracts.add(contract);
		}

		chartOfAccountRequest.setChartOfAccounts(chartOfAccountContracts);
		chartOfAccountService.addToQue(chartOfAccountRequest);
		chartOfAccountResponse.setChartOfAccounts(chartOfAccountContracts);

		return chartOfAccountResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public ChartOfAccountResponse search(@ModelAttribute ChartOfAccountSearchContract chartOfAccountSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		ChartOfAccountSearch domain = new ChartOfAccountSearch();
		mapper.map(chartOfAccountSearchContract, domain);
		ChartOfAccountContract contract;
		ModelMapper model = new ModelMapper();
		List<ChartOfAccountContract> chartOfAccountContracts = new ArrayList<>();
		Pagination<ChartOfAccount> chartofaccounts = chartOfAccountService.search(domain, errors);

		for (ChartOfAccount chartOfAccount : chartofaccounts.getPagedData()) {
			contract = new ChartOfAccountContract();
			model.map(chartOfAccount, contract);
			chartOfAccountContracts.add(contract);
		}

		ChartOfAccountResponse response = new ChartOfAccountResponse();
		response.setChartOfAccounts(chartOfAccountContracts);
		response.setPage(new PaginationContract(chartofaccounts));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}