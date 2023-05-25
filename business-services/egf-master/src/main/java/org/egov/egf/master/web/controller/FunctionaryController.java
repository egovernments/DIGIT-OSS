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
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.domain.model.FunctionarySearch;
import org.egov.egf.master.domain.service.FunctionaryService;
import org.egov.egf.master.web.contract.FunctionaryContract;
import org.egov.egf.master.web.contract.FunctionarySearchContract;
import org.egov.egf.master.web.requests.FunctionaryRequest;
import org.egov.egf.master.web.requests.FunctionaryResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/functionaries")
public class FunctionaryController {

	@Autowired
	private FunctionaryService functionaryService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FunctionaryResponse create(@RequestBody FunctionaryRequest functionaryRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FunctionaryResponse functionaryResponse = new FunctionaryResponse();
		functionaryResponse.setResponseInfo(getResponseInfo(functionaryRequest.getRequestInfo()));
		List<Functionary> functionaries = new ArrayList<>();
		Functionary functionary;
		List<FunctionaryContract> functionaryContracts = new ArrayList<>();
		FunctionaryContract contract;

		functionaryRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FunctionaryContract functionaryContract : functionaryRequest.getFunctionaries()) {
			functionary = new Functionary();
			model.map(functionaryContract, functionary);
			functionary.setCreatedDate(new Date());
			functionary.setCreatedBy(functionaryRequest.getRequestInfo().getUserInfo());
			functionary.setLastModifiedBy(functionaryRequest.getRequestInfo().getUserInfo());
			functionaries.add(functionary);
		}

		functionaries = functionaryService.add(functionaries, errors);

		for (Functionary f : functionaries) {
			contract = new FunctionaryContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			functionaryContracts.add(contract);
		}

		functionaryRequest.setFunctionaries(functionaryContracts);
		functionaryService.addToQue(functionaryRequest);
		functionaryResponse.setFunctionaries(functionaryContracts);

		return functionaryResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FunctionaryResponse update(@RequestBody FunctionaryRequest functionaryRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		functionaryRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FunctionaryResponse functionaryResponse = new FunctionaryResponse();
		List<Functionary> functionaries = new ArrayList<>();
		functionaryResponse.setResponseInfo(getResponseInfo(functionaryRequest.getRequestInfo()));
		Functionary functionary;
		FunctionaryContract contract;
		List<FunctionaryContract> functionaryContracts = new ArrayList<>();

		for (FunctionaryContract functionaryContract : functionaryRequest.getFunctionaries()) {
			functionary = new Functionary();
			model.map(functionaryContract, functionary);
			functionary.setLastModifiedBy(functionaryRequest.getRequestInfo().getUserInfo());
			functionary.setLastModifiedDate(new Date());
			functionaries.add(functionary);
		}

		functionaries = functionaryService.update(functionaries, errors);

		for (Functionary functionaryObj : functionaries) {
			contract = new FunctionaryContract();
			model.map(functionaryObj, contract);
			functionaryObj.setLastModifiedDate(new Date());
			functionaryContracts.add(contract);
		}

		functionaryRequest.setFunctionaries(functionaryContracts);
		functionaryService.addToQue(functionaryRequest);
		functionaryResponse.setFunctionaries(functionaryContracts);

		return functionaryResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FunctionaryResponse search(@ModelAttribute FunctionarySearchContract functionarySearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FunctionarySearch domain = new FunctionarySearch();
		mapper.map(functionarySearchContract, domain);
		FunctionaryContract contract;
		ModelMapper model = new ModelMapper();
		List<FunctionaryContract> functionaryContracts = new ArrayList<>();
		Pagination<Functionary> functionaries = functionaryService.search(domain, errors);

		for (Functionary functionary : functionaries.getPagedData()) {
			contract = new FunctionaryContract();
			model.map(functionary, contract);
			functionaryContracts.add(contract);
		}

		FunctionaryResponse response = new FunctionaryResponse();
		response.setFunctionaries(functionaryContracts);
		response.setPage(new PaginationContract(functionaries));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}