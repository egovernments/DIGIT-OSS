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
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.domain.model.FiscalPeriodSearch;
import org.egov.egf.master.domain.service.FiscalPeriodService;
import org.egov.egf.master.web.contract.FiscalPeriodContract;
import org.egov.egf.master.web.contract.FiscalPeriodSearchContract;
import org.egov.egf.master.web.requests.FiscalPeriodRequest;
import org.egov.egf.master.web.requests.FiscalPeriodResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fiscalperiods")
public class FiscalPeriodController {

	@Autowired
	private FiscalPeriodService fiscalPeriodService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FiscalPeriodResponse create(@RequestBody FiscalPeriodRequest fiscalPeriodRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FiscalPeriodResponse fiscalPeriodResponse = new FiscalPeriodResponse();
		fiscalPeriodResponse.setResponseInfo(getResponseInfo(fiscalPeriodRequest.getRequestInfo()));
		List<FiscalPeriod> fiscalperiods = new ArrayList<>();
		FiscalPeriod fiscalPeriod;
		List<FiscalPeriodContract> fiscalPeriodContracts = new ArrayList<>();
		FiscalPeriodContract contract;

		fiscalPeriodRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FiscalPeriodContract fiscalPeriodContract : fiscalPeriodRequest.getFiscalPeriods()) {
			fiscalPeriod = new FiscalPeriod();
			model.map(fiscalPeriodContract, fiscalPeriod);
			fiscalPeriod.setCreatedDate(new Date());
			fiscalPeriod.setCreatedBy(fiscalPeriodRequest.getRequestInfo().getUserInfo());
			fiscalPeriod.setLastModifiedBy(fiscalPeriodRequest.getRequestInfo().getUserInfo());
			fiscalperiods.add(fiscalPeriod);
		}

		fiscalperiods = fiscalPeriodService.add(fiscalperiods, errors);

		for (FiscalPeriod f : fiscalperiods) {
			contract = new FiscalPeriodContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			fiscalPeriodContracts.add(contract);
		}

		fiscalPeriodRequest.setFiscalPeriods(fiscalPeriodContracts);
		fiscalPeriodService.addToQue(fiscalPeriodRequest);
		fiscalPeriodResponse.setFiscalPeriods(fiscalPeriodContracts);

		return fiscalPeriodResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FiscalPeriodResponse update(@RequestBody FiscalPeriodRequest fiscalPeriodRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		fiscalPeriodRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FiscalPeriodResponse fiscalPeriodResponse = new FiscalPeriodResponse();
		List<FiscalPeriod> fiscalperiods = new ArrayList<>();
		fiscalPeriodResponse.setResponseInfo(getResponseInfo(fiscalPeriodRequest.getRequestInfo()));
		FiscalPeriod fiscalPeriod;
		FiscalPeriodContract contract;
		List<FiscalPeriodContract> fiscalPeriodContracts = new ArrayList<>();

		for (FiscalPeriodContract fiscalPeriodContract : fiscalPeriodRequest.getFiscalPeriods()) {
			fiscalPeriod = new FiscalPeriod();
			model.map(fiscalPeriodContract, fiscalPeriod);
			fiscalPeriod.setLastModifiedBy(fiscalPeriodRequest.getRequestInfo().getUserInfo());
			fiscalPeriod.setLastModifiedDate(new Date());
			fiscalperiods.add(fiscalPeriod);
		}

		fiscalperiods = fiscalPeriodService.update(fiscalperiods, errors);

		for (FiscalPeriod fiscalPeriodObj : fiscalperiods) {
			contract = new FiscalPeriodContract();
			model.map(fiscalPeriodObj, contract);
			fiscalPeriodObj.setLastModifiedDate(new Date());
			fiscalPeriodContracts.add(contract);
		}

		fiscalPeriodRequest.setFiscalPeriods(fiscalPeriodContracts);
		fiscalPeriodService.addToQue(fiscalPeriodRequest);
		fiscalPeriodResponse.setFiscalPeriods(fiscalPeriodContracts);

		return fiscalPeriodResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FiscalPeriodResponse search(@ModelAttribute FiscalPeriodSearchContract fiscalPeriodSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FiscalPeriodSearch domain = new FiscalPeriodSearch();
		mapper.map(fiscalPeriodSearchContract, domain);
		FiscalPeriodContract contract;
		ModelMapper model = new ModelMapper();
		List<FiscalPeriodContract> fiscalPeriodContracts = new ArrayList<>();
		Pagination<FiscalPeriod> fiscalperiods = fiscalPeriodService.search(domain, errors);

		for (FiscalPeriod fiscalPeriod : fiscalperiods.getPagedData()) {
			contract = new FiscalPeriodContract();
			model.map(fiscalPeriod, contract);
			fiscalPeriodContracts.add(contract);
		}

		FiscalPeriodResponse response = new FiscalPeriodResponse();
		response.setFiscalPeriods(fiscalPeriodContracts);
		response.setPage(new PaginationContract(fiscalperiods));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}