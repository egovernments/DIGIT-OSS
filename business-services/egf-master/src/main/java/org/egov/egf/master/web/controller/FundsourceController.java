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
import org.egov.egf.master.domain.model.Fundsource;
import org.egov.egf.master.domain.model.FundsourceSearch;
import org.egov.egf.master.domain.service.FundsourceService;
import org.egov.egf.master.web.contract.FundsourceContract;
import org.egov.egf.master.web.contract.FundsourceSearchContract;
import org.egov.egf.master.web.requests.FundsourceRequest;
import org.egov.egf.master.web.requests.FundsourceResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fundsources")
public class FundsourceController {

	@Autowired
	private FundsourceService fundsourceService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FundsourceResponse create(@RequestBody FundsourceRequest fundsourceRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FundsourceResponse fundsourceResponse = new FundsourceResponse();
		fundsourceResponse.setResponseInfo(getResponseInfo(fundsourceRequest.getRequestInfo()));
		List<Fundsource> fundsources = new ArrayList<>();
		Fundsource fundsource;
		List<FundsourceContract> fundsourceContracts = new ArrayList<>();
		FundsourceContract contract;

		fundsourceRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FundsourceContract fundsourceContract : fundsourceRequest.getFundsources()) {
			fundsource = new Fundsource();
			model.map(fundsourceContract, fundsource);
			fundsource.setCreatedDate(new Date());
			fundsource.setCreatedBy(fundsourceRequest.getRequestInfo().getUserInfo());
			fundsource.setLastModifiedBy(fundsourceRequest.getRequestInfo().getUserInfo());
			fundsources.add(fundsource);
		}

		fundsources = fundsourceService.add(fundsources, errors);

		for (Fundsource f : fundsources) {
			contract = new FundsourceContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			fundsourceContracts.add(contract);
		}

		fundsourceRequest.setFundsources(fundsourceContracts);
		fundsourceService.addToQue(fundsourceRequest);
		fundsourceResponse.setFundsources(fundsourceContracts);

		return fundsourceResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FundsourceResponse update(@RequestBody FundsourceRequest fundsourceRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		fundsourceRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FundsourceResponse fundsourceResponse = new FundsourceResponse();
		List<Fundsource> fundsources = new ArrayList<>();
		fundsourceResponse.setResponseInfo(getResponseInfo(fundsourceRequest.getRequestInfo()));
		Fundsource fundsource;
		FundsourceContract contract;
		List<FundsourceContract> fundsourceContracts = new ArrayList<>();

		for (FundsourceContract fundsourceContract : fundsourceRequest.getFundsources()) {
			fundsource = new Fundsource();
			model.map(fundsourceContract, fundsource);
			fundsource.setLastModifiedBy(fundsourceRequest.getRequestInfo().getUserInfo());
			fundsource.setLastModifiedDate(new Date());
			fundsources.add(fundsource);
		}

		fundsources = fundsourceService.update(fundsources, errors);

		for (Fundsource fundsourceObj : fundsources) {
			contract = new FundsourceContract();
			model.map(fundsourceObj, contract);
			fundsourceObj.setLastModifiedDate(new Date());
			fundsourceContracts.add(contract);
		}

		fundsourceRequest.setFundsources(fundsourceContracts);
		fundsourceService.addToQue(fundsourceRequest);
		fundsourceResponse.setFundsources(fundsourceContracts);

		return fundsourceResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FundsourceResponse search(@ModelAttribute FundsourceSearchContract fundsourceSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FundsourceSearch domain = new FundsourceSearch();
		mapper.map(fundsourceSearchContract, domain);
		FundsourceContract contract;
		ModelMapper model = new ModelMapper();
		List<FundsourceContract> fundsourceContracts = new ArrayList<>();
		Pagination<Fundsource> fundsources = fundsourceService.search(domain, errors);

		for (Fundsource fundsource : fundsources.getPagedData()) {
			contract = new FundsourceContract();
			model.map(fundsource, contract);
			fundsourceContracts.add(contract);
		}

		FundsourceResponse response = new FundsourceResponse();
		response.setFundsources(fundsourceContracts);
		response.setPage(new PaginationContract(fundsources));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}