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
import org.egov.egf.master.domain.model.FinancialStatus;
import org.egov.egf.master.domain.model.FinancialStatusSearch;
import org.egov.egf.master.domain.service.FinancialStatusService;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.egov.egf.master.web.contract.FinancialStatusSearchContract;
import org.egov.egf.master.web.requests.FinancialStatusRequest;
import org.egov.egf.master.web.requests.FinancialStatusResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financialstatuses")
public class FinancialStatusController {

	@Autowired
	private FinancialStatusService financialStatusService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialStatusResponse create(@RequestBody FinancialStatusRequest financialStatusRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FinancialStatusResponse financialStatusResponse = new FinancialStatusResponse();
		financialStatusResponse.setResponseInfo(getResponseInfo(financialStatusRequest.getRequestInfo()));
		List<FinancialStatus> financialstatuses = new ArrayList<>();
		FinancialStatus financialStatus;
		List<FinancialStatusContract> financialStatusContracts = new ArrayList<>();
		FinancialStatusContract contract;

		financialStatusRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FinancialStatusContract financialStatusContract : financialStatusRequest.getFinancialStatuses()) {
			financialStatus = new FinancialStatus();
			model.map(financialStatusContract, financialStatus);
			financialStatus.setCreatedDate(new Date());
			financialStatus.setCreatedBy(financialStatusRequest.getRequestInfo().getUserInfo());
			financialStatus.setLastModifiedBy(financialStatusRequest.getRequestInfo().getUserInfo());
			financialstatuses.add(financialStatus);
		}

		financialstatuses = financialStatusService.add(financialstatuses, errors);

		for (FinancialStatus f : financialstatuses) {
			contract = new FinancialStatusContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			financialStatusContracts.add(contract);
		}

		financialStatusRequest.setFinancialStatuses(financialStatusContracts);
		financialStatusService.addToQue(financialStatusRequest);
		financialStatusResponse.setFinancialStatuses(financialStatusContracts);

		return financialStatusResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialStatusResponse update(@RequestBody FinancialStatusRequest financialStatusRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		financialStatusRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FinancialStatusResponse financialStatusResponse = new FinancialStatusResponse();
		List<FinancialStatus> financialstatuses = new ArrayList<>();
		financialStatusResponse.setResponseInfo(getResponseInfo(financialStatusRequest.getRequestInfo()));
		FinancialStatus financialStatus;
		FinancialStatusContract contract;
		List<FinancialStatusContract> financialStatusContracts = new ArrayList<>();

		for (FinancialStatusContract financialStatusContract : financialStatusRequest.getFinancialStatuses()) {
			financialStatus = new FinancialStatus();
			model.map(financialStatusContract, financialStatus);
			financialStatus.setLastModifiedBy(financialStatusRequest.getRequestInfo().getUserInfo());
			financialStatus.setLastModifiedDate(new Date());
			financialstatuses.add(financialStatus);
		}

		financialstatuses = financialStatusService.update(financialstatuses, errors);

		for (FinancialStatus financialStatusObj : financialstatuses) {
			contract = new FinancialStatusContract();
			model.map(financialStatusObj, contract);
			financialStatusObj.setLastModifiedDate(new Date());
			financialStatusContracts.add(contract);
		}

		financialStatusRequest.setFinancialStatuses(financialStatusContracts);
		financialStatusService.addToQue(financialStatusRequest);
		financialStatusResponse.setFinancialStatuses(financialStatusContracts);

		return financialStatusResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FinancialStatusResponse search(@ModelAttribute FinancialStatusSearchContract financialStatusSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FinancialStatusSearch domain = new FinancialStatusSearch();
		mapper.map(financialStatusSearchContract, domain);
		FinancialStatusContract contract;
		ModelMapper model = new ModelMapper();
		List<FinancialStatusContract> financialStatusContracts = new ArrayList<>();
		Pagination<FinancialStatus> financialstatuses = financialStatusService.search(domain, errors);

		for (FinancialStatus financialStatus : financialstatuses.getPagedData()) {
			contract = new FinancialStatusContract();
			model.map(financialStatus, contract);
			financialStatusContracts.add(contract);
		}

		FinancialStatusResponse response = new FinancialStatusResponse();
		response.setFinancialStatuses(financialStatusContracts);
		response.setPage(new PaginationContract(financialstatuses));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}