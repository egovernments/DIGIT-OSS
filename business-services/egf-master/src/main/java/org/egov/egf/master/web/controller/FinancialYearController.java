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
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.domain.model.FinancialYearSearch;
import org.egov.egf.master.domain.service.FinancialYearService;
import org.egov.egf.master.web.contract.FinancialYearContract;
import org.egov.egf.master.web.contract.FinancialYearSearchContract;
import org.egov.egf.master.web.requests.FinancialYearRequest;
import org.egov.egf.master.web.requests.FinancialYearResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financialyears")
public class FinancialYearController {

	@Autowired
	private FinancialYearService financialYearService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialYearResponse create(
			@RequestBody FinancialYearRequest financialYearContractRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FinancialYearResponse financialYearResponse = new FinancialYearResponse();
		List<FinancialYear> financialyears = new ArrayList<>();
		FinancialYear financialYear;
		List<FinancialYearContract> financialYearContracts = new ArrayList<>();
		FinancialYearContract contract;

		financialYearContractRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FinancialYearContract financialYearContract : financialYearContractRequest.getFinancialYears()) {
			financialYear = new FinancialYear();
			model.map(financialYearContract, financialYear);
			financialYear.setCreatedDate(new Date());
			financialYear.setCreatedBy(financialYearContractRequest.getRequestInfo().getUserInfo());
			financialYear.setLastModifiedBy(financialYearContractRequest.getRequestInfo().getUserInfo());
			financialyears.add(financialYear);
		}

		financialyears = financialYearService.add(financialyears, errors);

		for (FinancialYear f : financialyears) {
			contract = new FinancialYearContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			financialYearContracts.add(contract);
		}

		financialYearContractRequest.setFinancialYears(financialYearContracts);
		financialYearService.addToQue(financialYearContractRequest);
		financialYearResponse.setFinancialYears(financialYearContracts);

		return financialYearResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialYearResponse update(
			@RequestBody  FinancialYearRequest financialYearContractRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		financialYearContractRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FinancialYearResponse financialYearResponse = new FinancialYearResponse();
		List<FinancialYear> financialyears = new ArrayList<>();
		FinancialYear financialYear;
		FinancialYearContract contract;
		List<FinancialYearContract> financialYearContracts = new ArrayList<>();

		for (FinancialYearContract financialYearContract : financialYearContractRequest.getFinancialYears()) {
			financialYear = new FinancialYear();
			model.map(financialYearContract, financialYear);
			financialYear.setLastModifiedDate(new Date());
			financialYear.setLastModifiedBy(financialYearContractRequest.getRequestInfo().getUserInfo());
			financialyears.add(financialYear);
		}

		financialyears = financialYearService.update(financialyears, errors);

		for (FinancialYear financialYearObj : financialyears) {
			contract = new FinancialYearContract();
			model.map(financialYearObj, contract);
			contract.setLastModifiedDate(new Date());
			financialYearContracts.add(contract);
		}

		financialYearContractRequest.setFinancialYears(financialYearContracts);
		financialYearService.addToQue(financialYearContractRequest);
		financialYearResponse.setFinancialYears(financialYearContracts);

		return financialYearResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FinancialYearResponse search(
			@ModelAttribute FinancialYearSearchContract financialYearSearchContract, @RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FinancialYearSearch domain = new FinancialYearSearch();
		mapper.map(financialYearSearchContract, domain);
		FinancialYearContract contract;
		ModelMapper model = new ModelMapper();
		List<FinancialYearContract> financialYearContracts = new ArrayList<>();

		Pagination<FinancialYear> financialyears = financialYearService.search(domain, errors);

		for (FinancialYear financialYear : financialyears.getPagedData()) {
			contract = new FinancialYearContract();
			model.map(financialYear, contract);
			financialYearContracts.add(contract);
		}

		FinancialYearResponse response = new FinancialYearResponse();
		response.setFinancialYears(financialYearContracts);
		response.setPage(new PaginationContract(financialyears));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}