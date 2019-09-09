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
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.domain.service.FunctionService;
import org.egov.egf.master.web.contract.FunctionContract;
import org.egov.egf.master.web.contract.FunctionSearchContract;
import org.egov.egf.master.web.requests.FunctionRequest;
import org.egov.egf.master.web.requests.FunctionResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/functions")
public class FunctionController {

	@Autowired
	private FunctionService functionService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FunctionResponse create(@RequestBody FunctionRequest functionRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FunctionResponse functionResponse = new FunctionResponse();
		functionResponse.setResponseInfo(getResponseInfo(functionRequest.getRequestInfo()));
		List<Function> functions = new ArrayList<>();
		Function function;
		List<FunctionContract> functionContracts = new ArrayList<>();
		FunctionContract contract;

		functionRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FunctionContract functionContract : functionRequest.getFunctions()) {
			function = new Function();
			model.map(functionContract, function);
			function.setCreatedDate(new Date());
			function.setCreatedBy(functionRequest.getRequestInfo().getUserInfo());
			function.setLastModifiedBy(functionRequest.getRequestInfo().getUserInfo());
			functions.add(function);
		}

		functions = functionService.create(functions, errors, functionRequest.getRequestInfo());

		for (Function f : functions) {
			contract = new FunctionContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			functionContracts.add(contract);
		}

		functionResponse.setFunctions(functionContracts);

		return functionResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FunctionResponse update(@RequestBody FunctionRequest functionRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		functionRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FunctionResponse functionResponse = new FunctionResponse();
		List<Function> functions = new ArrayList<>();
		functionResponse.setResponseInfo(getResponseInfo(functionRequest.getRequestInfo()));
		Function function;
		FunctionContract contract;
		List<FunctionContract> functionContracts = new ArrayList<>();
		for (FunctionContract functionContract : functionRequest.getFunctions()) {
			function = new Function();
			model.map(functionContract, function);
			function.setLastModifiedBy(functionRequest.getRequestInfo().getUserInfo());
			function.setLastModifiedDate(new Date());
			functions.add(function);
		}

		functions = functionService.update(functions, errors, functionRequest.getRequestInfo());

		for (Function functionObj : functions) {
			contract = new FunctionContract();
			model.map(functionObj, contract);
			functionObj.setLastModifiedDate(new Date());
			functionContracts.add(contract);
		}

		functionResponse.setFunctions(functionContracts);

		return functionResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FunctionResponse search(@ModelAttribute FunctionSearchContract functionSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FunctionSearch domain = new FunctionSearch();
		mapper.map(functionSearchContract, domain);
		FunctionContract contract;
		ModelMapper model = new ModelMapper();
		List<FunctionContract> functionContracts = new ArrayList<>();
		Pagination<Function> functions = functionService.search(domain, errors);

		for (Function function : functions.getPagedData()) {
			contract = new FunctionContract();
			model.map(function, contract);
			functionContracts.add(contract);
		}

		FunctionResponse response = new FunctionResponse();
		response.setFunctions(functionContracts);
		response.setPage(new PaginationContract(functions));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}